import { jest } from '@jest/globals';

// the language model is never called in tests
const generateJson = jest.fn(async () => ({ text: 'Reels.', insights: [], chart: null }));
jest.unstable_mockModule('../src/assistant/gemini.js', () => ({ generateJson, assistantReady: () => true }));

const request = (await import('supertest')).default;
const { default: app } = await import('../src/app.js');
const { ensureSample } = await import('../src/analysis/sample.js');
const { connectionOf } = await import('../src/utils/visitor.js');
const { Usage } = await import('../src/models/usage.model.js');

afterEach(() => {
    delete process.env.CONNECTION_IP_HEADER;
    delete process.env.DAILY_QUESTION_LIMIT;
});

describe('the address a request really came from', () => {
    const req = (headers = {}, ip = '10.20.30.40') => ({ headers, ip });

    test('is the connecting address, unless the host names a header for it', () => {
        expect(connectionOf(req({ 'cf-connecting-ip': '203.0.113.7' }))).toBe('10.20.30.40');

        process.env.CONNECTION_IP_HEADER = 'CF-Connecting-IP';
        expect(connectionOf(req({ 'cf-connecting-ip': '203.0.113.7' }))).toBe('203.0.113.7');
    });

    test('a named header that is missing or not an address falls back to the connecting address', () => {
        process.env.CONNECTION_IP_HEADER = 'cf-connecting-ip';

        for (const headers of [{}, { 'cf-connecting-ip': 'nonsense' }, { 'cf-connecting-ip': '' }, { 'cf-connecting-ip': ['203.0.113.7', '203.0.113.8'] }]) {
            expect(connectionOf(req(headers))).toBe('10.20.30.40');
        }
    });
});

describe('behind a host whose own proxies hide the caller', () => {
    test('made-up visitors from one caller are capped by the address the host reports', async () => {
        process.env.CONNECTION_IP_HEADER = 'cf-connecting-ip';
        process.env.DAILY_QUESTION_LIMIT = '1';
        await ensureSample();

        const statuses = [];
        for (let index = 1; index <= 12; index += 1) {
            const res = await request(app).post('/api/v1/datasets/sample/questions')
                // a different made-up visitor and a different inner proxy every time
                .set('X-Forwarded-For', `203.0.113.${index}, 10.0.0.${index}`)
                .set('CF-Connecting-IP', '198.51.100.77')
                .send({ question: 'Hello?' });
            statuses.push(res.status);
        }

        expect(statuses.filter((status) => status === 200)).toHaveLength(10);
        expect(statuses.slice(10)).toEqual([429, 429]);
        expect((await Usage.findOne({ key: 'connection:198.51.100.77' })).count).toBe(10);
    });
});

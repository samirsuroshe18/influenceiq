import { jest } from '@jest/globals';

// the language model is never called in tests
const generateJson = jest.fn();
const assistantReady = jest.fn(() => true);
jest.unstable_mockModule('../src/assistant/gemini.js', () => ({ generateJson, assistantReady }));

const request = (await import('supertest')).default;
const { default: app } = await import('../src/app.js');
const { ensureSample } = await import('../src/analysis/sample.js');
const { readPosts } = await import('../src/analysis/csv.js');
const { visitorOf } = await import('../src/utils/visitor.js');
const { Usage } = await import('../src/models/usage.model.js');
const { Dataset } = await import('../src/models/dataset.model.js');
const { DATA_MARKER } = await import('../src/assistant/prompt.js');

const api = '/api/v1/datasets';
const HEADER = 'post_id,post_type,date_posted,likes,shares,comments,views';
const GOOD = `${HEADER}\np1,reels,2026-03-15,120,30,12,4000`;
const ANSWER = { text: 'Reels.', insights: [], chart: null };

const ask = (address) => {
    const req = request(app).post(`${api}/sample/questions`).send({ question: 'Hello?' });
    // the host's proxy adds the address the request really came from at the end
    return address ? req.set('X-Forwarded-For', `${address}, 198.51.100.9`) : req;
};
const refusal = (buffer) => {
    try {
        readPosts(buffer);
    } catch (error) {
        return error.message;
    }
    return null;
};

beforeEach(async () => {
    generateJson.mockReset();
    generateJson.mockResolvedValue(ANSWER);
    await ensureSample();
});

afterEach(() => {
    delete process.env.DAILY_QUESTION_LIMIT;
    delete process.env.SITE_QUESTION_LIMIT;
    delete process.env.UPLOAD_RATE_LIMIT;
});

describe('who a visitor is', () => {
    const req = (forwarded, ip = '198.51.100.9') => ({ headers: forwarded === undefined ? {} : { 'x-forwarded-for': forwarded }, ip });

    test('the first forwarded address, when it is an address', () => {
        expect(visitorOf(req('203.0.113.7, 10.0.0.1'))).toBe('203.0.113.7');
        expect(visitorOf(req('2001:db8::1'))).toBe('2001:db8::1');
    });

    test('anything else in that header is ignored and the connecting address is used', () => {
        for (const forged of ['not an address', 'x'.repeat(5000), '203.0.113.7; DROP', '', ' ', '999.1.1.1']) {
            expect(visitorOf(req(forged))).toBe('198.51.100.9');
        }
        expect(visitorOf(req(undefined))).toBe('198.51.100.9');
    });
});

describe('questions from one connection', () => {
    test('a made-up address in the header does not give a fresh allowance', async () => {
        process.env.DAILY_QUESTION_LIMIT = '1';

        expect((await ask('garbage one')).status).toBe(200);
        expect((await ask('garbage two')).status).toBe(429);
    });

    test('changing the forwarded address at every request is capped for the connection', async () => {
        process.env.DAILY_QUESTION_LIMIT = '1';

        const statuses = [];
        for (let index = 1; index <= 12; index += 1) {
            statuses.push((await ask(`203.0.113.${index}`)).status);
        }

        // ten times one visitor's allowance for the address the requests really came from
        expect(statuses.filter((status) => status === 200)).toHaveLength(10);
        expect(statuses.slice(10)).toEqual([429, 429]);
        expect(generateJson).toHaveBeenCalledTimes(10);
        // the refused requests leave no record of their own behind
        expect(await Usage.countDocuments({ key: /^visitor:203\.0\.113\.1[12]$/ })).toBe(0);
    });
});

describe('what a question costs', () => {
    test('an answer that came back unusable still counts: the model was asked', async () => {
        generateJson.mockResolvedValueOnce({ text: '   ', insights: [] });

        const failed = await ask('203.0.113.7');
        const next = await ask('203.0.113.7');

        expect(failed.status).toBe(502);
        expect(next.body.data.remaining).toBe(18);
        expect((await Usage.findOne({ key: 'site' })).count).toBe(2);
    });

    test('a call that failed gives back the visitor\'s and the site\'s count', async () => {
        generateJson.mockRejectedValueOnce(new Error('network down'));

        await ask('203.0.113.7');

        expect((await Usage.findOne({ key: 'site' })).count).toBe(0);
        expect((await Usage.findOne({ key: 'visitor:203.0.113.7' })).count).toBe(0);
    });

    test('a refusal by the site limit gives the visitor their question back', async () => {
        process.env.SITE_QUESTION_LIMIT = '1';
        await ask('203.0.113.1');

        const refused = await ask('203.0.113.2');

        expect(refused.status).toBe(429);
        expect((await Usage.findOne({ key: 'visitor:203.0.113.2' })).count).toBe(0);
    });
});

describe('what reaches the assistant from a file', () => {
    test('a post id is cut to 40 characters and loses its control characters', () => {
        const { posts } = readPosts(Buffer.from(`${HEADER}\n"${'i'.repeat(500)}",reels,2026-03-15,1,1,1,1\n"a\u0007b\u009fc",reels,2026-03-15,1,1,1,1`));

        expect(posts[0].postId).toBe('i'.repeat(40));
        expect(posts[1].postId).toBe('abc');
    });

    test('the instructions name post ids among the things a visitor typed', async () => {
        await ask('203.0.113.7');

        const prompt = generateJson.mock.calls[0][0];
        expect(prompt.slice(0, prompt.indexOf(DATA_MARKER))).toMatch(/"postId"/);
    });
});

describe('files made to be expensive', () => {
    test('a file of very many short lines is refused without reading all of it', () => {
        const started = Date.now();

        expect(refusal(Buffer.from(`${HEADER}\n${'x\n'.repeat(400000)}`))).toBe('The file has more than 2000 rows');
        expect(Date.now() - started).toBeLessThan(1000);
    });

    test('a line of enormous length is refused', () => {
        expect(refusal(Buffer.from(`${HEADER}\np1,reels,2026-03-15,1,1,1,1${',x'.repeat(200000)}`))).toBe('The file could not be read as CSV');
        expect(refusal(Buffer.from(','.repeat(500000)))).toBe('The file could not be read as CSV');
    });

    test('a header with too many columns is refused', () => {
        const columns = Array.from({ length: 60 }, (_, index) => `extra_${index}`).join(',');

        expect(refusal(Buffer.from(`${HEADER},${columns}\np1,reels,2026-03-15,1,1,1,1`))).toBe('The file has too many columns');
    });

    test('counts are at most twelve digits, so sums stay exact', () => {
        const { posts, skipped } = readPosts(Buffer.from(`${HEADER}\na,reels,2026-03-15,1234567890123,1,1,1\nb,reels,2026-03-15,123456789012,1,1,1`));

        expect(posts.map((post) => post.postId)).toEqual(['b']);
        expect(skipped.rows[0].reason).toBe('likes must be a whole number, 0 or more');
    });

    test('an upload carries a file and nothing else', async () => {
        const res = await request(app).post(api)
            .field('note', 'x'.repeat(1000))
            .attach('file', Buffer.from(GOOD), { filename: 'posts.csv', contentType: 'text/csv' });

        expect(res.status).toBe(400);
        expect(await Dataset.countDocuments({ isSample: false })).toBe(0);
    });
});

describe('line ends', () => {
    test('a file that mixes Windows and Unix line ends is read, with the right line numbers', () => {
        const mixed = `${HEADER}\r\np1,reels,2026-03-15,1,1,1,1\nbad,story,2026-03-15,1,1,1,1\r\np3,static,2026-03-16,1,1,1,1\n`;

        const { posts, skipped } = readPosts(Buffer.from(mixed));

        expect(posts.map((post) => post.postId)).toEqual(['p1', 'p3']);
        expect(skipped.rows).toEqual([{ line: 3, reason: 'post_type must be reels, carousel or static' }]);
    });

    test('old Mac line ends are read too', () => {
        expect(readPosts(Buffer.from(`${HEADER}\rp1,reels,2026-03-15,1,1,1,1\r`)).posts).toHaveLength(1);
    });
});

describe('file names', () => {
    test('a name in another script is kept as it was written', async () => {
        const res = await request(app).post(api).attach('file', Buffer.from(GOOD), { filename: 'résumé जून.csv', contentType: 'text/csv' });

        expect(res.status).toBe(201);
        expect(res.body.data.dataset.name).toBe('résumé जून');
    });
});

describe('the upload limit and made-up addresses', () => {
    test('requests refused for the connection are not counted under the made-up visitor', async () => {
        process.env.UPLOAD_RATE_LIMIT = '1';
        const upload = (address) => request(app).post(api).set('X-Forwarded-For', `${address}, 198.51.100.9`)
            .attach('file', Buffer.from(GOOD), { filename: 'posts.csv', contentType: 'text/csv' });

        const statuses = [];
        for (let index = 1; index <= 12; index += 1) {
            statuses.push((await upload(`203.0.113.${index}`)).status);
        }

        expect(statuses.filter((status) => status === 201)).toHaveLength(10);
        expect(statuses.slice(10)).toEqual([429, 429]);
    });
});

describe('other origins', () => {
    afterEach(() => {
        delete process.env.CORS_ORIGIN;
    });

    test('error answers have the same four fields as every answer', async () => {
        const res = await request(app).get('/api/v1/nope');

        expect(res.body).toEqual({ statusCode: 404, data: null, message: 'Route not found', success: false });
    });
});

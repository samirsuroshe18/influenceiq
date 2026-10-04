import request from 'supertest';
import app from '../src/app.js';
import { Dataset } from '../src/models/dataset.model.js';
import { buildSamplePosts, ensureSample } from '../src/analysis/sample.js';
import { readPosts } from '../src/analysis/csv.js';

const api = '/api/v1/datasets';
const HEADER = 'post_id,post_type,date_posted,likes,shares,comments,views';
const GOOD = [HEADER, 'p1,reels,2026-03-15,120,30,12,4000', 'p2,static,2026-04-16,40,2,5,900'].join('\n');

const upload = (text = GOOD, filename = 'my posts.csv', contentType = 'text/csv') =>
    request(app).post(api).attach('file', Buffer.from(text), { filename, contentType });

describe('the sample dataset', () => {
    test('about 150 posts over six months, in the three types, the same every time', () => {
        const today = new Date('2026-10-04T10:00:00Z');
        const posts = buildSamplePosts(today);

        expect(posts.length).toBeGreaterThanOrEqual(130);
        expect(posts.length).toBeLessThanOrEqual(170);
        expect(buildSamplePosts(today)).toEqual(posts);
        expect([...new Set(posts.map((post) => post.postType))].sort()).toEqual(['carousel', 'reels', 'static']);

        const months = [...new Set(posts.map((post) => post.datePosted.slice(0, 7)))].sort();
        expect(months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
        expect(posts.every((post) => post.datePosted <= '2026-10-04')).toBe(true);
    });

    test('reels are viewed the most and carousels shared the most', () => {
        const posts = buildSamplePosts(new Date('2026-10-04T10:00:00Z'));
        const average = (type, key) => {
            const ofType = posts.filter((post) => post.postType === type);
            return ofType.reduce((sum, post) => sum + post[key], 0) / ofType.length;
        };

        expect(average('reels', 'views')).toBeGreaterThan(average('carousel', 'views'));
        expect(average('carousel', 'views')).toBeGreaterThan(average('static', 'views'));
        expect(average('carousel', 'shares')).toBeGreaterThan(average('reels', 'shares'));
    });

    test('is rebuilt in place and leaves uploads alone', async () => {
        await ensureSample();
        const uploaded = await upload();
        await ensureSample();

        expect(await Dataset.countDocuments({ isSample: true })).toBe(1);
        expect(await Dataset.countDocuments({ token: uploaded.body.data.dataset.id })).toBe(1);
        expect((await Dataset.findOne({ token: 'sample' })).expiresAt).toBeUndefined();
    });

    test('its analytics', async () => {
        await ensureSample();

        const res = await request(app).get(`${api}/sample/analytics`);

        expect(res.status).toBe(200);
        const { dataset, totals, byType, byMonth, topPosts, posts } = res.body.data;
        expect(dataset).toMatchObject({ id: 'sample', name: 'Sample account', isSample: true, expiresAt: null });
        expect(dataset.postCount).toBe(posts.length);
        expect(totals.posts).toBe(posts.length);
        expect(byType).toHaveLength(3);
        expect(byMonth.length).toBeGreaterThanOrEqual(6);
        expect(topPosts).toHaveLength(5);
        expect(posts[0]).toEqual(expect.objectContaining({ postId: expect.any(String), postType: expect.any(String), datePosted: expect.any(String), likes: expect.any(Number) }));
        expect(posts[0]).not.toHaveProperty('_id');
    });

    test('before the sample exists, its analytics are a 404', async () => {
        expect((await request(app).get(`${api}/sample/analytics`)).status).toBe(404);
    });

    test('downloads as a CSV file that reads back to the same posts', async () => {
        await ensureSample();

        const res = await request(app).get(`${api}/sample.csv`);

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/csv/);
        expect(res.headers['content-disposition']).toMatch(/attachment; filename="influenceiq-sample.csv"/);
        const { posts, skipped } = readPosts(Buffer.from(res.text));
        expect(skipped.count).toBe(0);
        expect(posts).toEqual((await request(app).get(`${api}/sample/analytics`)).body.data.posts);
    });

    test('cannot be removed', async () => {
        await ensureSample();

        const res = await request(app).delete(`${api}/sample`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe('The sample dataset cannot be removed');
        expect(await Dataset.countDocuments()).toBe(1);
    });
});

describe('uploading', () => {
    test('a CSV becomes a dataset with an id only the uploader knows', async () => {
        const before = Date.now();

        const res = await upload();

        expect(res.status).toBe(201);
        const { dataset, skipped } = res.body.data;
        expect(dataset.id).toMatch(/^[0-9a-f]{32}$/);
        expect(dataset).toMatchObject({ name: 'my posts', postCount: 2, isSample: false });
        expect(skipped).toEqual({ count: 0, rows: [] });
        const days = (new Date(dataset.expiresAt).getTime() - before) / 86400000;
        expect(days).toBeGreaterThan(6.99);
        expect(days).toBeLessThan(7.01);
    });

    test('its analytics come from its own posts', async () => {
        const { id } = (await upload()).body.data.dataset;

        const res = await request(app).get(`${api}/${id}/analytics`);

        expect(res.status).toBe(200);
        expect(res.body.data.dataset).toMatchObject({ id, name: 'my posts', isSample: false, postCount: 2 });
        expect(res.body.data.totals).toMatchObject({ posts: 2, likes: 160, views: 4900 });
        expect(res.body.data.byMonth.map((row) => row.month)).toEqual(['2026-03', '2026-04']);
        expect(res.body.data.posts).toHaveLength(2);
    });

    test('skipped rows are reported with the upload', async () => {
        const res = await upload([HEADER, 'a,story,2026-03-15,1,1,1,1', 'b,reels,2026-03-15,1,1,1,1'].join('\n'));

        expect(res.status).toBe(201);
        expect(res.body.data.dataset.postCount).toBe(1);
        expect(res.body.data.skipped).toEqual({ count: 1, rows: [{ line: 2, reason: 'post_type must be reels, carousel or static' }] });
        expect(res.body.message).toBe('Dataset uploaded; 1 row was skipped');
    });

    test('the name comes from the file name, cleaned and cut to 60 characters', async () => {
        const long = `${'x'.repeat(80)}.csv`;

        expect((await upload(GOOD, long)).body.data.dataset.name).toBe('x'.repeat(60));
        expect((await upload(GOOD, '  june    report.CSV')).body.data.dataset.name).toBe('june report');
        expect((await upload(GOOD, '.csv')).body.data.dataset.name).toBe('Uploaded posts');
    });

    test('two uploads of the same file are two datasets', async () => {
        const first = (await upload()).body.data.dataset.id;
        const second = (await upload()).body.data.dataset.id;

        expect(first).not.toBe(second);
    });

    test('refusals: no file, wrong kind, too large, unusable content', async () => {
        const none = await request(app).post(api);
        expect([none.status, none.body.message]).toEqual([400, 'Choose a CSV file to upload']);

        const image = await upload('x', 'photo.png', 'image/png');
        expect([image.status, image.body.message]).toEqual([400, 'Only .csv files are accepted']);

        const large = await upload(`${HEADER}\n${'p,reels,2026-03-15,1,1,1,1\n'.repeat(45000)}`);
        expect([large.status, large.body.message]).toEqual([400, 'The file must be 1 MB or smaller']);

        const empty = await upload('');
        expect([empty.status, empty.body.message]).toEqual([400, 'The file is empty']);

        const noColumn = await upload('post_type,date_posted,likes,comments\nreels,2026-03-15,1,1');
        expect([noColumn.status, noColumn.body.message]).toEqual([400, 'Missing column: shares']);

        expect(await Dataset.countDocuments()).toBe(0);
    });

    test('a CSV sent with a spreadsheet content type is accepted by its name', async () => {
        expect((await upload(GOOD, 'posts.csv', 'application/vnd.ms-excel')).status).toBe(201);
    });
});

describe('reading and removing', () => {
    test('an id that does not exist, or is not an id at all, is a 404', async () => {
        for (const id of ['0123456789abcdef0123456789abcdef', 'nope', 'SAMPLE', '{"$ne":null}', '0123456789ABCDEF0123456789ABCDEF']) {
            const res = await request(app).get(`${api}/${encodeURIComponent(id)}/analytics`);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Dataset not found');
        }

        expect((await request(app).delete(`${api}/0123456789abcdef0123456789abcdef`)).status).toBe(404);
    });

    test('the uploader removes their dataset', async () => {
        const { id } = (await upload()).body.data.dataset;

        const res = await request(app).delete(`${api}/${id}`);

        expect(res.status).toBe(200);
        expect(await Dataset.countDocuments()).toBe(0);
        expect((await request(app).get(`${api}/${id}/analytics`)).status).toBe(404);
    });

    test('an upload carries the day it expires, and the database removes it then', async () => {
        const { id } = (await upload()).body.data.dataset;
        const stored = await Dataset.findOne({ token: id });
        const indexes = await Dataset.collection.indexes();

        expect(stored.expiresAt).toBeInstanceOf(Date);
        expect(indexes.find((index) => index.key.expiresAt === 1).expireAfterSeconds).toBe(0);
    });
});

describe('the upload limit', () => {
    afterEach(() => {
        delete process.env.UPLOAD_RATE_LIMIT;
    });

    test('a visitor can upload only so many files an hour; other visitors are not affected', async () => {
        process.env.UPLOAD_RATE_LIMIT = '2';
        const from = (address) => upload().set('X-Forwarded-For', address);

        expect((await from('203.0.113.7')).status).toBe(201);
        expect((await from('203.0.113.7')).status).toBe(201);
        const third = await from('203.0.113.7');
        expect(third.status).toBe(429);
        expect(third.body.message).toBe('Too many uploads. Please try again in an hour.');
        expect((await from('203.0.113.8')).status).toBe(201);
    });
});

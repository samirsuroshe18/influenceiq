import request from 'supertest';
import app from '../src/app.js';

test('health answers ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ statusCode: 200, data: { status: 'ok' }, message: 'OK', success: true });
});

test('an unknown route is a 404 in the common error shape', async () => {
    const res = await request(app).get('/api/v1/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ statusCode: 404, data: null, message: 'Route not found', success: false });
});

test('a body that is not JSON is refused, not a server error', async () => {
    const res = await request(app).post('/api/v1/health').set('content-type', 'application/json').send('{broken');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
});

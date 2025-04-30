// tests/server.test.js
const request = require('supertest');
const app = require('../app'); // import Express app only
const db = require('../db');

describe('GET /alerts', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// clear alerts table before/after test
beforeAll(async () => {
  await db.query('DELETE FROM alerts');
});

afterAll(async () => {
  await db.query('DELETE FROM alerts');
  await db.end(); // Close DB pool
});

describe('POST /alerts', () => {
  it('should create a new alert and return 201', async () => {
    const newAlert = {
      timestamp: new Date().toISOString(),
      type: 'test-type',
      message: 'This is a test alert',
      frame_url: '/frames/test123.png',
    };

    const res = await request(app).post('/alerts').send(newAlert);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({
      type: newAlert.type,
      message: newAlert.message,
      frame_url: newAlert.frame_url,
    });
  });
});

describe('GET /', () => {
  it('should return status 200 and success message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Backend is running!');
  });
});

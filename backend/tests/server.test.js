// tests/server.test.js
const request = require('supertest');
const app = require('../app'); // import Express app only
const db = require('../db');

afterAll(async () => {
  await db.end(); // properly close pg Pool
});

describe('GET /alerts', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


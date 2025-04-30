// tests/server.test.js
jest.mock('../db'); // Mock the db module
const request = require('supertest');
const app = require('../app'); // import Express app only
const db = require('../db');
const path = require('path');
const fs = require('fs');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('GET /alerts', () => {
  it('should return status 200', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


describe('POST /alerts (error case)', () => {
  it('should return 500 if database insert fails', async () => {
    db.query.mockRejectedValueOnce(new Error('DB insert failed'));

    const alertData = {
      timestamp: new Date().toISOString(),
      type: 'test-error',
      message: 'This should trigger an error',
      frame_url: '/frames/error.png',
    };

    const res = await request(app).post('/alerts').send(alertData);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

  afterEach(() => {
    // 👇 Clean up mock for other tests
    db.query.mockReset();
  });
});

describe('GET /', () => {
  it('should return status 200 and success message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Backend is running!');
  });
});

describe('POST /alerts (error case)', () => {
  it('should return 500 if database insert fails', async () => {
    // Force db.query to throw
    db.query.mockRejectedValueOnce(new Error('DB insert failed'));

    const alertData = {
      timestamp: new Date().toISOString(),
      type: 'error-test',
      message: 'This is a test alert',
      frame_url: '/frames/failure.png',
    };

    const res = await request(app).post('/alerts').send(alertData);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

describe('GET /alerts (error case)', () => {
  it('should return 500 if database fetch fails', async () => {
    db.query.mockRejectedValueOnce(new Error('DB fetch failed'));
    const res = await request(app).get('/alerts');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

describe('POST /upload_frame', () => {
  it('should return 200 and frameUrl when a file is uploaded', async () => {
    const res = await request(app)
      .post('/upload_frame')
      .attach('frame', path.resolve(__dirname, 'mock_data', 'test-image.png')); // make sure this file exists

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('frameUrl');
    expect(res.body.frameUrl).toMatch(/\/frames\/frame-.*\.png/);
  });
});

describe('POST /clear_all', () => {
  it('should return 200 after deleting alerts', async () => {
    const res = await request(app).post('/clear_all');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/cleared successfully/i);
  });
});

describe('POST /clear_all (fs.readdir error)', () => {
  it('should return 500 if reading frames directory fails', async () => {
    // mock fs.readdir to simulate error
    jest.spyOn(fs, 'readdir').mockImplementation((dir, cb) => {
      cb(new Error('Mocked read error'), null);
    });

    const res = await request(app).post('/clear_all');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to clear frames' });

    fs.readdir.mockRestore(); // clean up
  });
});

describe('POST /upload_frame (no file)', () => {
  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/upload_frame')
      .field('frame', ''); // simulate form with 'frame' field but no file

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('No frame uploaded.');
  });
});
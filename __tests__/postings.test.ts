const request = require('supertest');
import * as server from '../src/server';

let cookie: any = [];
let app = server.app;

beforeAll(async () => {
  await server.init(true);
  app = server.app;

  // Register the user (if already exists, it's fine because your API ignores duplicates silently)
  await request(app)
    .post('/api/register')
    .send({ username: 'testuser', password: 'testpass' });

  // Login to get cookie
  const loginRes = await request(app)
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpass' });

  const rawCookie = loginRes.headers['set-cookie'];
  if (Array.isArray(rawCookie)) {
    cookie = rawCookie.filter((c): c is string => typeof c === 'string');
  } else if (typeof rawCookie === 'string') {
    cookie = [rawCookie];
  } else {
    cookie = [];
  }
});

describe('Posting Controller Full Coverage', () => {
  let postingId = '';

  it('should retrieve all postings', async () => {
    const res = await request(app)
      .get('/api/postings');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should return 401 when creating a posting without auth', async () => {
    const res = await request(app)
      .post('/api/postings')
      .send({
        title: 'Test Posting',
        description: 'This is a test posting',
        price: 100,
      });

    expect(res.statusCode).toBe(401);
  });

  it('should create a posting with auth', async () => {
    const res = await request(app)
      .post('/api/postings')
      .set('Cookie', cookie)
      .send({
        title: 'Test Posting',
        description: 'This is a test posting',
        price: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    postingId = res.body.id;
  });

  it('should delete a posting with auth', async () => {
    const res = await request(app)
      .delete(`/api/postings/${postingId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Posting deleted');
  });

  it('should return 404 when deleting a non-existent posting', async () => {
    const res = await request(app)
      .delete(`/api/postings/000000000000000000000000`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Posting not found or not authorized');
  });
});
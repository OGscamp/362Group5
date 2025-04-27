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

describe('Chat Controller Full Coverage', () => {
  let recipientId = 'recipientUser';
  let messageId: string;

  it('should return 401 when sending a message without auth', async () => {
    const res = await request(app)
      .post('/api/chat/send')
      .send({ recipientId, message: 'Hello!' });

    expect(res.statusCode).toBe(401);
  });

  it('should send a message with auth', async () => {
    const res = await request(app)
      .post('/api/chat/send')
      .set('Cookie', cookie)
      .send({ recipientId, message: 'Hello!' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Message sent');
  });

  it('should retrieve chat history with auth', async () => {
    const res = await request(app)
      .get('/api/chat/history')
      .set('Cookie', cookie)
      .query({ withUser: recipientId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('message', 'Hello!');
  });

  it('should return empty chat history for non-existent user', async () => {
    const res = await request(app)
      .get('/api/chat/history')
      .set('Cookie', cookie)
      .query({ withUser: 'nonExistentUser' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });
});
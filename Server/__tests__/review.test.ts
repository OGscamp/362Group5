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

describe('Review Controller Full Coverage', () => {
  let postingId = '';
  let comment = 'This is a test review';

  beforeAll(async () => {
    // Create a posting to associate the review with
    const postingRes = await request(app)
      .post('/api/postings')
      .set('Cookie', cookie)
      .send({
        title: 'Test Posting',
        description: 'This is a test posting',
        price: 100,
      });

    postingId = postingRes.body.id;
  });

  it('should retrieve reviews for a posting', async () => {
    const res = await request(app)
      .get(`/api/review/${postingId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should return 401 when adding a review without auth', async () => {
    const res = await request(app)
      .post(`/api/review/${postingId}`)
      .send({
        comment: 'This is a test review',
        rating: 5,
      });

    expect(res.statusCode).toBe(401);
  });

  it('should add a review with auth', async () => {
    const res = await request(app)
      .post(`/api/review/${postingId}`)
      .set('Cookie', cookie)
      .send({
        comment: comment,
        rating: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('review');
    expect(res.body.review.comment).toBe(comment);
  });

  it('should delete a review with auth', async () => {
    const res = await request(app)
      .delete(`/api/review/${postingId}`)
      .set('Cookie', cookie)
      .send({
        comment: comment,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Review deleted');
  });

  it('should return 404 when deleting a non-existent review', async () => {
    const res = await request(app)
      .delete(`/api/review/${postingId}`)
      .set('Cookie', cookie)
      .send({
        comment: 'Non-existent review',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Review not found or not yours to delete');
  });
});
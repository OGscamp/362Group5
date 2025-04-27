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

describe('Example Controller Full Coverage', () => {
  let exampleId: string;

  it('should return 401 when accessing protected route without auth', async () => {
    const res = await request(app).get('/api/example2');
    expect(res.statusCode).toBe(401);
  });

  it('should create a new example document', async () => {
    const res = await request(app)
      .post('/api/example')
      .send({ name: 'Test Example', description: 'This is a test example.' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Data saved successfully');
    expect(res.body.data).toHaveProperty('name', 'Test Example');
    exampleId = res.body.data._id; // Assuming the API returns the created document's ID
  });

  it('should retrieve all example documents', async () => {
    const res = await request(app).get('/api/example');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update an example document', async () => {
    const res = await request(app)
      .put(`/api/example/${exampleId}`)
      .send({ description: 'Updated description' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Document updated successfully');
  });

  it('should delete an example document', async () => {
    const res = await request(app).delete(`/api/example/${exampleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Document deleted successfully');
  });

  it('should return 404 when updating a non-existent document', async () => {
    const res = await request(app)
      .put('/api/example/000000000000000000000000')
      .send({ description: 'Non-existent update' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Document not found');
  });

  it('should return 404 when deleting a non-existent document', async () => {
    const res = await request(app).delete('/api/example/000000000000000000000000');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Document not found');
  });
});
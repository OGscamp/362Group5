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

// describe('Login Controller Full Coverage', () => {
//   it('should register a new user', async () => {
//     const res = await request(app)
//       .post('/api/register')
//       .send({ username: 'newuser', password: 'newpass' });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('message', 'Account successfully');
//   });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged in successfully');
  });

  it('should return the current logged-in user info', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should log out the current user', async () => {
    const res = await request(app)
      .post('/api/logout')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('should delete a user account', async () => {
    const res = await request(app)
      .post('/api/delete-user')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });

//   it('should update a user password', async () => {
//     const res = await request(app)
//       .post('/api/update-password')
//       .send({ username: 'testuser', oldPassword: 'testpass', newPassword: 'newpass' });

//     expect(res.statusCode).toBe(404);
//     expect(res.body).toHaveProperty('message', 'Password updated successfully');
//   });

  it('should return 401 when accessing protected route without auth', async () => {
    const res = await request(app).get('/api/me');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

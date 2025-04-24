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

describe('Payment Controller Full Coverage', () => {
  let paymentId = '';

  it('should return 401 when creating payment without auth', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({
        amount: 100,
        method: 'credit_card',
        status: 'completed',
        cardNumber: '4111111111111111',
        cardHolder: 'Test User',
        expiryDate: '12/25',
        cvv: '123',
      });

    expect(res.statusCode).toBe(401);
  });

  it('should create payment with auth', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({
        amount: 100,
        method: 'credit_card',
        status: 'completed',
        cardNumber: '4111111111111111',
        cardHolder: 'Test User',
        expiryDate: '12/25',
        cvv: '123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    paymentId = res.body.id;
  });

  it('should retrieve payments with auth', async () => {
    const res = await request(app)
      .get('/api/payments')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete payment with auth', async () => {
    const res = await request(app)
      .delete(`/api/payments/${paymentId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment deleted');
  });

  it('should return 404 when deleting non-existent payment', async () => {
    const res = await request(app)
      .delete(`/api/payments/000000000000000000000000`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Payment not found or not authorized');
  });
});
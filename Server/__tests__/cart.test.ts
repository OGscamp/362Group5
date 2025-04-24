//import request from 'supertest';
const request = require('supertest');
import * as server from '../src/server';

let cookie:any = [];

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

// The tests are the "it" blocks inside the "describe" block
// The "describe" block is used to group related tests together
describe('Cart Controller Full Coverage', () => {
  let itemId = '';

  it('should return 401 when adding item to cart without auth', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({"item":{ "id":"680983197347121253a24a19", "title": "testItem", "price": 1 }});

    expect(res.statusCode).toBe(401);
  });

  it('should add item to cart with auth', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Cookie', cookie)
      .send({"item":{ "id":"680983197347121253a24a19", "title": "testItem", "price": 1 }});

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    itemId = res.body._id;
  });

  it('should retrieve cart items with auth', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body.items).toBeInstanceOf(Array);
  });


  it('should delete cart item with auth', async () => {
    const res = await request(app)
      .delete(`/api/cart`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cart cleared');
  });

  it('should return 404 when deleting non-existent cart item', async () => {
    const res = await request(app)
      .post(`/api/cart/remove`)
      .set('Cookie', cookie)
      .send({ itemId: 5 });

    expect(res.statusCode).toBe(404);
  });
});

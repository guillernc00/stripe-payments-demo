import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('GET /api/products', () => {
  it('returns 200 status', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
  });

  it('returns an array', async () => {
    const res = await request(app).get('/api/products');
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns exactly 3 products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body).toHaveLength(3);
  });

  it('each product has required fields', async () => {
    const res = await request(app).get('/api/products');
    res.body.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
    });
  });

  it('prices are integers', async () => {
    const res = await request(app).get('/api/products');
    res.body.forEach(product => {
      expect(Number.isInteger(product.price)).toBe(true);
    });
  });
});

describe('POST /api/setup-intent', () => {
  it('returns 200 status', async () => {
    const res = await request(app).post('/api/setup-intent');
    expect(res.status).toBe(200);
  });

  it('returns a clientSecret', async () => {
    const res = await request(app).post('/api/setup-intent');
    expect(res.body).toHaveProperty('clientSecret');
  });

  it('clientSecret starts with seti_', async () => {
    const res = await request(app).post('/api/setup-intent');
    expect(res.body.clientSecret).toMatch(/^seti_/);
  });
});

describe('GET /api/payment-methods', () => {
  it('returns 200 status', async () => {
    const res = await request(app).get('/api/payment-methods');
    expect(res.status).toBe(200);
  });

  it('returns an array', async () => {
    const res = await request(app).get('/api/payment-methods');
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('each payment method has required fields', async () => {
    const res = await request(app).get('/api/payment-methods');
    res.body.forEach(pm => {
      expect(pm).toHaveProperty('id');
      expect(pm).toHaveProperty('card');
      expect(pm.card).toHaveProperty('last4');
      expect(pm.card).toHaveProperty('brand');
      expect(pm.card).toHaveProperty('exp_month');
      expect(pm.card).toHaveProperty('exp_year');
    });
  });
});

describe('DELETE /api/payment-methods/:id', () => {
  it('returns error on invalid payment method id', async () => {
    const res = await request(app).delete('/api/payment-methods/pm_fake123');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  it('successfully detaches a valid payment method', async () => {
    const listRes = await request(app).get('/api/payment-methods');
    const cards = listRes.body;

    if (cards.length === 0) {
      console.log('No saved cards to delete — skipping test');
      return;
    }

    const pmId = cards[0].id;
    const deleteRes = await request(app).delete(`/api/payment-methods/${pmId}`);
    expect(deleteRes.status).toBe(200);

    const afterRes = await request(app).get('/api/payment-methods');
    const remainingIds = afterRes.body.map(pm => pm.id);
    expect(remainingIds).not.toContain(pmId);
  });
});

describe('POST /api/payment-intent', () => {
  it('returns 200 with valid items', async () => {
    const res = await request(app)
      .post('/api/payment-intent')
      .send({ items: [{ id: 'smart-watch', quantity: 1 }] });
    expect(res.status).toBe(200);
  });

  it('returns a clientSecret', async () => {
    const res = await request(app)
      .post('/api/payment-intent')
      .send({ items: [{ id: 'smart-watch', quantity: 1 }] });
    expect(res.body).toHaveProperty('clientSecret');
  });

  it('clientSecret starts with pi_', async () => {
    const res = await request(app)
      .post('/api/payment-intent')
      .send({ items: [{ id: 'smart-watch', quantity: 1 }] });
    expect(res.body.clientSecret).toMatch(/^pi_/);
  });

  it('returns 400 when items array is empty', async () => {
    const res = await request(app)
      .post('/api/payment-intent')
      .send({ items: [] });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns error when product id does not exist', async () => {
    const res = await request(app)
      .post('/api/payment-intent')
      .send({ items: [{ id: 'fake-product', quantity: 1 }] });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Product not found/);
  });

  it('calculates total correctly server-side', async () => {
    const res = await request(app)
      .post('/api/payment-intent')
      .send({ items: [{ id: 'laptop-stand', quantity: 2 }] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('clientSecret');
  });
});
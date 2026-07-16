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
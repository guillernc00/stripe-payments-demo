import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { products } from './products.js';
import Stripe from 'stripe'


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3001;

//Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//Health Check
app.get('/health', (req, res) => {
    res.json({status: 'ok'})
})

//Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Setup Intent
app.post('/api/setup-intent', async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: process.env.STRIPE_CUSTOMER_ID,
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment Methods
app.get('/api/payment-methods', async (req, res) => {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      process.env.STRIPE_CUSTOMER_ID,
      { type: 'card' }
    );
    res.json(paymentMethods.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Payment Method
app.delete('/api/payment-methods/:id', async (req, res) => {
  try {
    const detached = await stripe.paymentMethods.detach(req.params.id);
    res.json(detached);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment Intent
app.post('/api/payment-intent', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      return sum + product.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      customer: process.env.STRIPE_CUSTOMER_ID,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
});

//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
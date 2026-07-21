# Stripe Payments Demo

A full-stack payment integration demo built with the Stripe SDK — featuring three complete payment flows: tokenizing a card, creating a purchase, and managing saved payment methods.

🔗 **[Live Demo](https://stripe-payments-demo-prod.vercel.app)** | 📋 **[Agile Board](https://github.com/users/guillernc00/projects/3)**

---

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)

---

## Overview

This project demonstrates a production-ready Stripe SDK integration across three flows:

- **Tokenize a Card** — collects card details via Stripe Elements and saves a PaymentMethod to a shared Stripe Customer using a SetupIntent
- **Create a Purchase** — multi-step checkout with product selection, server-side price calculation, and payment confirmation using a saved or new card
- **View Saved Cards** — lists all saved PaymentMethods with the ability to delete them via a confirmation modal

---

## Architecture

```
React (Vercel) → Express API (Railway) → Stripe SDK → Stripe
```

The frontend never handles card data directly — Stripe Elements collects it in an iframe and returns a reference. The backend uses that reference to confirm intents and manage PaymentMethods.

**Trust boundary:** The purchase flow sends item IDs and quantities to the server, never prices. The server looks up prices from its own catalog and calculates the total before creating a PaymentIntent. This prevents client-side price tampering.

**Key separation:**
- `STRIPE_SECRET_KEY` lives only on the Express server
- `VITE_STRIPE_PUBLISHABLE_KEY` is the only Stripe key exposed to the frontend

---

## Features

- Card tokenization via SetupIntent and Stripe Elements
- Multi-step purchase flow with stepper UI
- Saved card selection and new card entry on checkout
- Server-side price calculation (trust boundary)
- Delete saved cards with confirmation modal
- Loading and error states throughout
- 25 backend tests (unit + integration)

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Stripe account (test mode)

### Clone the repo
```bash
git clone git@github.com:guillernc00/stripe-payments-demo.git
cd stripe-payments-demo
```

### Backend setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your Stripe test keys in .env
npm run dev
```

### Frontend setup
```bash
cd client
npm install
cp .env.example .env
# Fill in your Stripe publishable key and API URL in .env
npm run dev
```

### Environment variables

**server/.env**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CUSTOMER_ID=cus_...
PORT=3001
```

**client/.env**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
```

### Test cards
```
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
```

---

## Running Tests

```bash
cd server
npm test

# With coverage
npm run test:coverage
```

---

## Development Process

This project was built using Agile methodology across 7 sprints, tracked on a public GitHub Projects board. Each sprint had its own branch, issues, and PR — mirroring a professional team workflow.

View the board: [Stripe Payments Demo — GitHub Projects](https://github.com/users/guillernc00/projects/3)

---

## Backlog

Items scoped out for future iterations:

- Stripe webhook handler for internal transaction logging
- Request logging middleware (Morgan)
- Express Router refactor for cleaner route organization
- Input validation middleware
- Rate limiting on payment endpoints
- Restrict PaymentElement to card only on Tokenize flow

---

## Author

Guillermo Nunez — [GitHub](https://github.com/guillernc00)
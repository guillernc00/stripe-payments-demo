import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe.js';
import TokenizeForm from '../components/TokenizeForm.jsx';

function Tokenize() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/setup-intent', { method: 'POST' })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div>
      <h1>Tokenize a Card</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <TokenizeForm />
        </Elements>
      )}
    </div>
  );
}

export default Tokenize;
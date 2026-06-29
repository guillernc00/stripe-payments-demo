import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe.js';
import TokenizeForm from '../components/TokenizeForm.jsx';

function Tokenize() {
  const [clientSecret, setClientSecret] = useState(''); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('http://localhost:3001/api/setup-intent', { method: 'POST' });
        if (!res.ok) throw new Error('Server error');
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message || 'Failed to initialize payment form. Please try again');
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  if (isLoading) return <p>Loading...</p>; 
  if (error) return <p>{error}</p>;

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
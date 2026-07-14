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

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tokenize a Card</h1>
        <p className="text-gray-500">Create a payment method token from card details</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg">
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <TokenizeForm />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default Tokenize;
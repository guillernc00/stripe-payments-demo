import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe.js';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import OrderSummary from './OrderSummary.jsx';

function PaymentForm({ cart, total, clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPm, setSelectedPm] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [tab, setTab] = useState('saved');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/payment-methods');
        if (!res.ok) throw new Error('Failed to fetch saved cards');
        const data = await res.json();
        setSavedCards(data);
        if (data.length === 0) setTab('new');
      } catch (err) {
        setError(err.message || 'Failed to load saved cards');
      }
    };

    fetchCards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe) return;
    setIsLoading(true);
    setError('');

    try {
      let result;

      if (tab === 'saved' && selectedPm) {
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedPm,
        });
      } else {
        result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: 'http://localhost:5173/purchase',
          },
          redirect: 'if_required',
        });
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <OrderSummary cart={cart} total={total} />

      <div>
        <button type="button" onClick={() => setTab('saved')}>Saved Cards</button>
        <button type="button" onClick={() => setTab('new')}>New Card</button>
      </div>

      {tab === 'saved' && (
        <div>
          {savedCards.length === 0 ? (
            <p>No saved cards. Use a new card below.</p>
          ) : (
            savedCards.map(pm => (
              <div key={pm.id}>
                <input
                  type="radio"
                  name="savedCard"
                  value={pm.id}
                  onChange={() => setSelectedPm(pm.id)}
                />
                <span>{pm.card.brand} •••• {pm.card.last4} expires {pm.card.exp_month}/{pm.card.exp_year}</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'new' && <PaymentElement />}

      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={isLoading || (tab === 'saved' && !selectedPm)}
      >
        {isLoading ? 'Processing...' : `Pay $${(total / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

function PaymentStep({ cart, total, onSuccess }) {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const createIntent = async () => {
      try {
        const items = cart.map(item => ({ id: item.id, quantity: item.quantity }));
        const res = await fetch('http://localhost:3001/api/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        if (!res.ok) throw new Error('Failed to create payment intent');
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, []);

  if (isLoading) return <p>Loading payment details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm
        cart={cart}
        total={total}
        clientSecret={clientSecret}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

export default PaymentStep;
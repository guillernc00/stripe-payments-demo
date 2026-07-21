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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment-methods`);
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
          confirmParams: { return_url: `${window.location.origin}/purchase`, },
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

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => setTab('saved')}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${tab === 'saved'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}
          >
            Saved Cards
          </button>
          <button
            type="button"
            onClick={() => setTab('new')}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${tab === 'new'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}
          >
            New Card
          </button>
        </div>

        <div className="p-4">
          {tab === 'saved' && (
            <div className="space-y-2">
              {savedCards.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No saved cards. Use a new card.</p>
              ) : (
                savedCards.map(pm => (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                      ${selectedPm === pm.id
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name="savedCard"
                      value={pm.id}
                      onChange={() => setSelectedPm(pm.id)}
                      className="accent-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {pm.card.brand} •••• {pm.card.last4}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {pm.card.exp_month}/{pm.card.exp_year}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          )}

          {tab === 'new' && (
            <div className="pt-2">
              <PaymentElement />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (tab === 'saved' && !selectedPm)}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment-intent`, {
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

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500">Loading payment details...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  );

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
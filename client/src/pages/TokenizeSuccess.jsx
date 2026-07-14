import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { stripePromise } from "../lib/stripe";

function TokenizeSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const clientSecret = searchParams.get('setup_intent_client_secret');

    if (!clientSecret) {
      setError('No setup intent found');
      return;
    }

    const fetchCardDetails = async () => {
      try {
        const stripe = await stripePromise;
        const { setupIntent } = await stripe.retrieveSetupIntent(clientSecret);

        if (setupIntent.status === 'succeeded') {
          const res = await fetch('http://localhost:3001/api/payment-methods');
          if (!res.ok) throw new Error('Failed to fetch payment methods');
          const paymentMethods = await res.json();
          const savedCard = paymentMethods.find(pm => pm.id === setupIntent.payment_method);
          if (!savedCard) throw new Error('Card not found');
          setCard(savedCard);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCardDetails();
  }, []);

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  );

  if (!card) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-lg">
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Card Saved!</h1>
        <p className="text-gray-500 mb-6">Your payment method has been tokenized successfully.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Brand</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{card.card.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Card number</span>
            <span className="text-sm font-medium text-gray-900">•••• {card.card.last4}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Expires</span>
            <span className="text-sm font-medium text-gray-900">{card.card.exp_month}/{card.card.exp_year}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/tokenize')}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tokenize another
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenizeSuccess;
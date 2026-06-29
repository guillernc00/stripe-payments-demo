import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { stripePromise } from "../lib/stripe";

function TokenizeSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [error, setError] = useState('');

    useEffect(()=> {
        const clientSecret = searchParams.get('setup_intent_client_secret');

        if (!clientSecret) {
            setError('No setup intent found')
            return;
        }

        const fetchCardDetails = async () => {
            try {
                const stripe = await stripePromise;
                const { setupIntent } = await stripe.retrieveSetupIntent(clientSecret)

                if (setupIntent.status === 'succeeded') {
                    const res = await fetch('http://localhost:3001/api/payment-methods')
                    if (!res.ok) throw new Error('Failed to fetch payment methods');
                    const paymentMethods = await res.json();
                    const savedCard = paymentMethods.find(pm => pm.id === setupIntent.payment_method);
                    if (!savedCard) throw new Error('Card not found');
                    setCard(savedCard)
                }
            } catch (err) {
                setError(err.message)
            }
        }

        fetchCardDetails();
    }, []);

    if (error) return <p>{error}</p>;
    if (!card) return <p>Loading...</p>;

    return (
    <div>
      <h1>Card Saved Successfully!</h1>
      <p>Brand: {card.card.brand}</p>
      <p>Last 4: •••• {card.card.last4}</p>
      <p>Expires: {card.card.exp_month}/{card.card.exp_year}</p>
      <button onClick={() => navigate('/tokenize')}>Tokenize another card</button>
      <button onClick={() => navigate('/')}>Go home</button>
    </div>
  );
}

export default TokenizeSuccess;
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Stripe Payments Demo</h1>
      <p>Choose a flow to get started</p>

      <div>
        <div onClick={() => navigate('/tokenize')}>
          <h2>Tokenize a Card</h2>
          <p>Create a payment method token from card details</p>
        </div>

        <div onClick={() => navigate('/purchase')}>
          <h2>Create a Purchase</h2>
          <p>Complete checkout with product selection</p>
        </div>

        <div onClick={() => navigate('/view-cards')}>
          <h2>View Saved Cards</h2>
          <p>Manage your saved payment methods</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
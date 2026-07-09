import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ViewCards() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/payment-methods');
        if (!res.ok) throw new Error('Failed to fetch saved cards');
        const data = await res.json();
        setCards(data);
      } catch (err) {
        setError(err.message || 'Failed to load saved cards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:3001/api/payment-methods/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete card');
      setCards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete card');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (isLoading) return <p>Loading saved cards...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>View Saved Cards</h1>

      {cards.length === 0 ? (
        <div>
          <p>No saved cards found.</p>
          <button onClick={() => navigate('/tokenize')}>Tokenize a Card</button>
        </div>
      ) : (
        <div>
          {cards.map(card => (
            <div key={card.id}>
              <span>{card.card.brand} •••• {card.card.last4}</span>
              <span>Expires {card.card.exp_month}/{card.card.exp_year}</span>
              <button
                onClick={() => setConfirmId(card.id)}
                disabled={deletingId === card.id}
              >
                {deletingId === card.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmId && (
        <div>
          <div>
            <p>Are you sure? This cannot be undone.</p>
            <button onClick={() => handleDelete(confirmId)}>
              Yes, delete
            </button>
            <button onClick={() => setConfirmId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCards;
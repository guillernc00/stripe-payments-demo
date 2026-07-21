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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment-methods`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment-methods/${id}`, {
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

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500">Loading saved cards...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">View Saved Cards</h1>
        <p className="text-gray-500">Manage your saved payment methods</p>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">💳</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No saved cards</h2>
          <p className="text-gray-500 mb-6">You haven't saved any payment methods yet.</p>
          <button
            onClick={() => navigate('/tokenize')}
            className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Tokenize a Card
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              {cards.length} saved {cards.length === 1 ? 'card' : 'cards'}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {cards.map(card => (
              <div key={card.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-500 uppercase">{card.card.brand}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {card.card.brand} •••• {card.card.last4}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {card.card.exp_month}/{card.card.exp_year}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmId(card.id)}
                  disabled={deletingId === card.id}
                  className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === card.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this card?</h3>
              <p className="text-sm text-gray-500">This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="flex-1 bg-red-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCards;
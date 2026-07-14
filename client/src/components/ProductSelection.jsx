import { useState, useEffect } from 'react';

const productIcons = {
  'wireless-headphones': '🎧',
  'smart-watch': '⌚',
  'laptop-stand': '💻',
};

function ProductSelection({ onProceed }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        const initialQuantities = {};
        data.forEach(p => initialQuantities[p.id] = 0);
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const cartItems = products
    .filter(p => quantities[p.id] > 0)
    .map(p => ({ ...p, quantity: quantities[p.id] }));

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartIsEmpty = cartItems.length === 0;

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500">Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Choose your products</h2>
          <p className="text-sm text-gray-500">Select the items you'd like to purchase</p>
        </div>

        <div className="divide-y divide-gray-100">
          {products.map(product => (
            <div key={product.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {productIcons[product.id] || '📦'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="w-4 text-center font-medium text-gray-900">
                  {quantities[product.id]}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-700 font-medium">
          Total: <span className="text-gray-900 font-bold">${(total / 100).toFixed(2)}</span>
        </p>
        <button
          onClick={() => onProceed(cartItems, total)}
          disabled={cartIsEmpty}
          className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}

export default ProductSelection;
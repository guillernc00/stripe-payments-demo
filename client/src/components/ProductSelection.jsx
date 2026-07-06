import { useState, useEffect } from 'react';

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

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Select Products</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${(product.price / 100).toFixed(2)}</p>
          <button onClick={() => updateQuantity(product.id, -1)}>-</button>
          <span>{quantities[product.id]}</span>
          <button onClick={() => updateQuantity(product.id, 1)}>+</button>
        </div>
      ))}

      <p>Total: ${(total / 100).toFixed(2)}</p>

      <button
        onClick={() => onProceed(cartItems, total)}
        disabled={cartIsEmpty}
      >
        Proceed to Payment
      </button>
    </div>
  );
}

export default ProductSelection;
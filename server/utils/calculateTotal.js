export function calculateTotal(items, products) {
  if (!items || items.length === 0) return 0;

  return items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    if (!product) {
      throw new Error(`Product not found: ${item.id}`);
    }
    return sum + product.price * item.quantity;
  }, 0);
}
function OrderSummary({ cart, total }) {
  return (
    <div>
      <h3>Order Summary</h3>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name} x{item.quantity}</span>
          <span>${(item.price * item.quantity / 100).toFixed(2)}</span>
        </div>
      ))}
      <div>
        <strong>Total: ${(total / 100).toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default OrderSummary;

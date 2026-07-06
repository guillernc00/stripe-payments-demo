import OrderSummary from './OrderSummary.jsx';

function PurchaseSuccess({ cart, total, paymentIntent, onReset }) {
  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Your order has been processed successfully.</p>

      <div>
        <p>Transaction ID: {paymentIntent?.id}</p>
        <p>Amount: ${(total / 100).toFixed(2)}</p>
        <p>Status: {paymentIntent?.status}</p>
      </div>

      <OrderSummary cart={cart} total={total} />

      <button onClick={onReset}>Make Another Purchase</button>
    </div>
  );
}

export default PurchaseSuccess;
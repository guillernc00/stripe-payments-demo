import OrderSummary from './OrderSummary.jsx';

function PurchaseSuccess({ cart, total, paymentIntent, onReset }) {
  if (!paymentIntent) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mb-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">Your order has been processed successfully.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Transaction ID</span>
            <span className="text-xs font-mono font-medium text-gray-900">{paymentIntent.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount</span>
            <span className="text-sm font-medium text-gray-900">${(total / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-medium text-green-600 capitalize">{paymentIntent.status}</span>
          </div>
        </div>

        <OrderSummary cart={cart} total={total} />

        <button
          onClick={onReset}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Make Another Purchase
        </button>
      </div>
    </div>
  );
}

export default PurchaseSuccess;
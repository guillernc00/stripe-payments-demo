function OrderSummary({ cart, total }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
      <div className="space-y-2 mb-3">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span className="text-sm text-gray-600">
              {item.name} <span className="text-gray-400">×{item.quantity}</span>
            </span>
            <span className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity / 100).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-3 flex justify-between">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="font-bold text-gray-900">${(total / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
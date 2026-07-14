import { useState } from 'react';
import ProductSelection from '../components/ProductSelection.jsx';
import PaymentStep from '../components/PaymentStep.jsx';
import PurchaseSuccess from '../components/PurchaseSuccess.jsx';

const steps = [
  { number: 1, label: 'Select Products' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Confirmation' },
];

function Purchase() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Purchase</h1>
        <p className="text-gray-500">Select products and complete checkout</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step > s.number ? 'bg-green-500 text-white' :
                  step === s.number ? 'bg-indigo-600 text-white' :
                  'bg-gray-100 text-gray-400 border border-gray-200'}`}
              >
                {step > s.number ? '✓' : s.number}
              </div>
              <span className={`text-sm ${step === s.number ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px w-12 bg-gray-200 mx-3" />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <ProductSelection
          onProceed={(items, amount) => {
            setCart(items);
            setTotal(amount);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <PaymentStep
          cart={cart}
          total={total}
          onSuccess={(pi) => {
            setPaymentIntent(pi);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <PurchaseSuccess
          cart={cart}
          total={total}
          paymentIntent={paymentIntent}
          onReset={() => {
            setCart([]);
            setTotal(0);
            setPaymentIntent(null);
            setStep(1);
          }}
        />
      )}
    </div>
  );
}

export default Purchase;
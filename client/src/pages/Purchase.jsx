import { useState } from 'react';
import ProductSelection from '../components/ProductSelection.jsx';
import PaymentStep from '../components/PaymentStep.jsx';
import PurchaseSuccess from '../components/PurchaseSuccess.jsx';

function Purchase() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState(null);

  return (
    <div>
      <h1>Create a Purchase</h1>

      <div>
        <span>Step 1: Select Products</span>
        <span>Step 2: Payment</span>
        <span>Step 3: Confirmation</span>
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
        />
      )}
    </div>
  );
}

export default Purchase;
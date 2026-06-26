import { PaymentElement } from '@stripe/react-stripe-js';

function TokenizeForm() {
  return (
    <form>
      <PaymentElement />
      <button type="submit">Save Card</button>
    </form>
  );
}

export default TokenizeForm;
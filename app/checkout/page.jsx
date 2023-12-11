import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      console.log(error);
    } else {
      // Send the token to your server for further processing
      
      console.log(token);
    }
  };

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

  return (
    <Elements stripe={stripePromise}>
      <form onSubmit={handleCheckout}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay Now
        </button>
        
      </form>
    </Elements>
  );
};

export default Checkout;



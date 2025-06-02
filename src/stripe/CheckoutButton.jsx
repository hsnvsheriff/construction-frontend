// src/stripe/CheckoutButton.jsx
import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from '../lib/axios';

const CheckoutButton = ({ plan = 'Pro Plan', amount = 49 }) => {
  const stripe = useStripe();

  const handleClick = async () => {
    try {
      const res = await axios.post('/api/payment/create-checkout-session', {
        name: plan,
        amount: amount
      });

      const result = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Stripe Checkout Error:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Pay ${amount}
    </button>
  );
};

export default CheckoutButton;

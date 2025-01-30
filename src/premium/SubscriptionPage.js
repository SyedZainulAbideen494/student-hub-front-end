import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(99); // Default amount in INR (₹99)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium'); // Updated to premium plan
  const [showPremium, setShowPremium] = useState(true); // State to toggle between free and premium features
  const [isPremium, setIsPremium] = useState(null);
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60); // 3 days in seconds
  const nav = useNavigate()
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        alert('Please log in to subscribe.');
        return;
      }

      // Step 1: Create an order on the backend
      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount,
        currency: 'INR',
        subscription_plan: subscriptionPlan,
        token, // Send only the token
      });

      const options = {
        key: 'rzp_live_jPX6SxetQbApHC', // Razorpay key_id
        amount: data.order.amount,
        currency: 'INR',
        order_id: data.order.id,
        name: 'Edusify',
        description: 'Subscription Payment',
        handler: async (response) => {
          // Step 2: Verify payment on the backend
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token, // Send only the token
            subscription_plan: subscriptionPlan,
          });

          if (data.success) {
            nav('/payment-success')
          } else {
            alert('Payment verification failed!');
          }
        },
        theme: { color: '#030303' },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Error initiating payment', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  useEffect(() => {
    // Countdown timer logic
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };


  return (
    <div className="__subscription__place__page__card">
    <h2 className="__subscription__place__page__title">
      Upgrade to Premium <FaCrown className="crown-icon" />
    </h2>
    <p className="__subscription__place__page__description">
      Unlock exclusive features and elevate your learning experience.
    </p>
  
    <div className="__subscription__place__page__price-container">
      <p className="__subscription__place__page__price">
₹99 / month
      </p>
   
    </div>
  
    <div className="__subscription__place__page__button-container">
      {showPremium &&
        (isPremium ? (
          <p className="__subscription__place__page__Noaction">
            You have Premium <FaCrown className="crown-icon-small" />
          </p>
        ) : (
          <button className="__subscription__place__page__action" onClick={handlePayment}>
            Get Premium <FaCrown className="crown-icon-small" />
          </button>
        ))}
    </div>
  
    <ul className="__subscription__place__page__lists">
      {[
        "Unlimited study plans",
        "Unlimited Magic AI generations",
        "Unlimited note creation options",
        "Unlimited PDF to notes",
        "Unlimited AI notes creation",
        "Unlock AI tasks plan generator",
        "Get daily tips on study plan",
        "Unlimited AI quizzes creation",
        "Unlimited AI flashcards creation",
        "Unlimited PDF to flashcards",
        "Unlimited PDF to quizzes",
      ].map((feature, index) => (
        <li className="__subscription__place__page__list" key={index}>
          <span>
            <i className="fa fa-check-circle golden-check"></i> {feature}
          </span>
        </li>
      ))}
    </ul>
  
    <FooterNav />
  </div>
  );
};

export default PaymentComponent;

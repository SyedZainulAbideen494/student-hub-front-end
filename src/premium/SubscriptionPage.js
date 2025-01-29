import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(99); // Default amount in INR (₹99)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium'); // Updated to premium plan
  const [showPremium, setShowPremium] = useState(true); // State to toggle between free and premium features
  const [isPremium, setIsPremium] = useState(null);
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


  return (
    <div className="__subscription__place__page__card">
      <h2 className="__subscription__place__page__title">Upgrade to Premium</h2>
      <p className="__subscription__place__page__description">
        Get access to exclusive features and elevate your learning experience!
      </p>
      <p className="__subscription__place__page__price">₹99 / month</p>

      {/* Toggle Buttons */}
      <div className="__subscription__place__page__toggle">
        <button
          className={`__subscription__place__page__toggle-btn ${!showPremium ? 'active' : ''}`}
          onClick={() => setShowPremium(false)}
        >
          Free Features
        </button>
        <button
          className={`__subscription__place__page__toggle-btn ${showPremium ? 'active' : ''}`}
          onClick={() => setShowPremium(true)}
        >
          Premium Features
        </button>
      </div>

      {/* Free Features List */}
      {!showPremium && (
  <ul className="__subscription__place__page__lists">
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> Unlimited manual tasks</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> Unlimited manual quizzes creation</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> Unlimited notes creation</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> 5 Magic uses per day</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> 5 AI quizzes per day</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> 5 PDF notes per day</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> 5 AI notes per day</span>
    </li>
    <li className="__subscription__place__page__list">
      <span><i className="fa fa-check-circle"></i> 1 AI study plan per month</span>
    </li>
  </ul>

      )}

      {/* Premium Features List */}
      {showPremium && (
        <ul className="__subscription__place__page__lists">
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited study plans</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited Magic AI generations</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited note creation options</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited PDF to notes</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited AI notes creation</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlock AI tasks plan generator</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Get daily tips on study plan</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited AI quizzes creation</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited AI flashcards creation</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited PDF to flashcards</span>
        </li>
        <li className="__subscription__place__page__list">
          <span><i className="fa fa-check-circle"></i> Unlimited PDF to quizzes</span>
        </li>
      </ul>
      )}


<div className="__subscription__place__page__button-container">
{showPremium && (
  isPremium ? (
    <p
    className="__subscription__place__page__Noaction"
  >
    You have Premium
  </p>
  
  ) : (
    <button className="__subscription__place__page__action" onClick={handlePayment}>
      Get Premium
    </button>
  )
)}
</div>

      <FooterNav />
    </div>
  );
};

export default PaymentComponent;

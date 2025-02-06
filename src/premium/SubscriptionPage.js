import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(129); // Default to ₹129 (monthly)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium');
  const [duration, setDuration] = useState('monthly'); // Always set to 'monthly' now
  const [showPremium, setShowPremium] = useState(true); // State to toggle between free and premium features
  const [isPremium, setIsPremium] = useState(null);
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60); // 3 days in seconds
  const nav = useNavigate();
  
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to subscribe.');
        return;
      }
  
      let planAmount = 129; // Always ₹129 for monthly plan
  
      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: planAmount,
        currency: 'INR',
        subscription_plan: subscriptionPlan,
        token,
        duration, // Send the selected duration
      });
  
      const options = {
        key: 'rzp_live_jPX6SxetQbApHC',
        amount: data.order.amount,
        currency: 'INR',
        order_id: data.order.id,
        name: 'Edusify',
        description: `Subscription Payment (${duration})`,
        handler: async (response) => {
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            subscription_plan: subscriptionPlan,
            duration, // Send the selected duration
          });
  
          if (data.success) {
            nav('/payment-success');
          } else {
            alert('Payment verification failed!');
          }
        },
        theme: { color: '#000000' },
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
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #f9f9f9, #eceff4)',
  }}
>
  <div className="card__subscription__new">
    <h3 className="title__subscription__new">Premium</h3>
    <p className="description__subscription__new">
      Elevate your learning with AI-powered tools.
    </p>
    <p className="price__subscription__new">
      <span className="currency__subscription__new">₹</span>129
      <span className="per__subscription__new"> / Month</span>
    </p>
    <div>
      {isPremium ? (
        <p className="premium__status">You have premium!</p>
      ) : (
        <button className="button__subscription__new" onClick={handlePayment}>
          Unlock Premium
        </button>
      )}
    </div>
  </div>
  <FooterNav />
</div>

  );
};

export default PaymentComponent;

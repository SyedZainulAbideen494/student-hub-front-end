import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(99); // Default to ₹99 (monthly)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium');
  const [duration, setDuration] = useState('monthly'); // Default plan  
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
  
      let planAmount = 129; // Default to monthly price
      if (duration === 'weekly') planAmount = 49;
      else if (duration === 'monthly') planAmount = 129;
      else if (duration === '6months') planAmount = 599;      
  
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

  const getButtonLabel = () => {
    if (duration === 'weekly') return 'Get Premium for 1 Week';
    if (duration === 'monthly') return 'Get Premium for 1 Month';
    if (duration === '6months') return 'Get Premium for 6 Months';
    return 'Get Premium';
  };



  return (
<div 
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '100vh', // Makes sure it takes full height of the screen
    width: '100%', // Ensures it spans full width
  }}
>
<div 
  className="subscription-card"

>
    <h2 className="subscription-title">
      Join the Elite Study Club <FaCrown className="crown-icon" />
    </h2>
    <p className="subscription-description">
      Unlock all premium study tools and elevate your learning.
    </p>
  
    <div className="subscription-plan__subs_plan__selector">
      <button className={`plan-button__subs_plan__selector ${duration === 'weekly' ? 'active__actve__subs' : ''}`} onClick={() => { setDuration('weekly'); setAmount(49); }}>
        ₹49 / Week
      </button>
      <button className={`plan-button__subs_plan__selector ${duration === 'monthly' ? 'active__actve__subs' : ''}`} onClick={() => { setDuration('monthly'); setAmount(129); }}>
        ₹129 / Month
      </button>
      <button className={`plan-button__subs_plan__selector ${duration === '6months' ? 'active__actve__subs' : ''}`} onClick={() => { setDuration('6months'); setAmount(599); }}>
        ₹599 /<br /> 6 Months
      </button>
    </div>
    {showPremium &&
    (isPremium ? (
              <button className="subscription-action">
              You have Premium <FaCrown className="crown-icon-small" />
    </button>
    ) : (
      <button className="subscription-action" onClick={handlePayment}>
      Join Now <FaCrown className="crown-icon-small" />
    </button>
    ))}
    <div className="why-premium">
      <p>Say goodbye to multiple subscriptions. Get everything you need with Edusify Premium — in one luxurious package.</p>
    </div>

  </div>
      <FooterNav/>
      </div>
  );
};

export default PaymentComponent;

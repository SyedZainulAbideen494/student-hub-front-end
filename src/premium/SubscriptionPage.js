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
  
      let planAmount = 99;
      if (duration === 'weekly') planAmount = 39;
      else if (duration === 'monthly') planAmount = 99;
      else if (duration === '6months') planAmount = 499;
  
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
    <div className="subscription-card">
      <h2 className="subscription-title">
        Upgrade to Premium <FaCrown className="crown-icon" />
      </h2>
      <p className="subscription-description">
        Unlock exclusive features and elevate your learning experience.
      </p>

      {/* Plan Selection */}
      <div className="subscription-plan__subs_plan__selector">
        <button
          className={`plan-button__subs_plan__selector ${duration === 'weekly' ? 'active__actve__subs' : ''}`}
          onClick={() => {
            setDuration('weekly');
            setAmount(39);
          }}
        >
          ₹39 / Week
        </button>
        <button
          className={`plan-button__subs_plan__selector ${duration === 'monthly' ? 'active__actve__subs' : ''}`}
          onClick={() => {
            setDuration('monthly');
            setAmount(99);
          }}
        >
          ₹99 / Month
        </button>
        <button
          className={`plan-button__subs_plan__selector ${duration === '6months' ? 'active__actve__subs' : ''}`}
          onClick={() => {
            setDuration('6months');
            setAmount(499);
          }}
        >
          ₹499 /<br /> 6 Months
        </button>
      </div>

      <div className="subscription-button-container">
        {showPremium &&
          (isPremium ? (
            <p className="subscription-no-action">
              You have Premium <FaCrown className="crown-icon-small" />
            </p>
          ) : (
            <button className="subscription-action" onClick={handlePayment}>
              {getButtonLabel()} <FaCrown className="crown-icon-small" />
            </button>
          ))}
      </div>

      <ul className="subscription-features">
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
          "Notes to Quizzes",
          "Notes to Flashcards",
          "Generate AI practice question papers",
          "AI explanation on flashcards",
        ].map((feature, index) => (
          <li className="subscription-feature" key={index}>
            <span>
              <i className="fa fa-check-circle check-icon"></i> {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="why-premium">
  <p>Say goodbye to multiple subscriptions. Get everything you need for studying with a single, all-in-one Edusify Premium subscription — saving you both time and money.</p>
</div>

      <FooterNav />
    </div>
  );
};

export default PaymentComponent;

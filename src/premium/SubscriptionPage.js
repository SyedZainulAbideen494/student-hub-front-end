import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import styled from 'styled-components';


const PaymentComponent = () => {
  const [amount, setAmount] = useState(129); // Default to ₹129 (monthly)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium');
  const [duration, setDuration] = useState('monthly'); // Always set to 'monthly' now
  const [showPremium, setShowPremium] = useState(true); // State to toggle between free and premium features
  const [isPremium, setIsPremium] = useState(null);
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60); // 3 days in seconds
  const nav = useNavigate();

  const StyledWrapper = styled.div`
  .card__subs__page__premium__edusify {
    max-width: 320px;
    display: flex;
    flex-direction: column;
    border-radius: 1.5rem;
    background-color: rgba(0, 0, 0, 1);
    padding: 1.5rem;
  }

  .price__subs__page__premium__edusify {
    font-size: 1.6rem;
    line-height: 1;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }

  .lists__subs__page__premium__edusify {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    grid-row-gap: 0.75rem;
    row-gap: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(255, 255, 255, 1);
  }

  .list__subs__page__premium__edusify {
    display: flex;
    align-items: center;
  }

  .list__subs__page__premium__edusify svg {
    height: 1rem;
    width: 1rem;
  }

  .list__subs__page__premium__edusify span {
    margin-left: 1rem;
  }

  .action__subs__page__premium__edusify {
    margin-top: 2rem;
    width: 80%;
    border: 2px solid rgba(255, 255, 255, 1);
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 1);
    padding: 0.625rem 1.5rem;
    font-weight: 600;
    text-align: center;
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 1);
    outline: none;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .action__subs__page__premium__edusify:hover {
    color: rgba(255, 255, 255, 1);
    background-color: transparent;
  }
`;


  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to subscribe.');
        return;
      }
  
      let planAmount = 99; // Always ₹99 for monthly plan
  
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
<div className="container__pricing__subs__page">

<StyledWrapper>
  <div className="card__subs__page__premium__edusify">
    <p className="price__subs__page__premium__edusify">₹99/month</p>
    {isPremium ? (
     <a  className="action__subs__page__premium__edusify">You have premium!</a>
    ) : (
      <a  className="action__subs__page__premium__edusify" onClick={handlePayment}>Get started</a>
    )}
    <ul className="lists__subs__page__premium__edusify">
  {[
    "Unlimited Magic Usage",
    "Unlimited AI Quiz Generation",
    "Unlimited AI Study Plan Generations",
    "Unlimited AI Notes Generation",
    "Unlimited PDF to Notes",
    "AI Pomodoro Recommendations",
    "AI Task Generation",
    "AI Plan Tasks Generation",
    "AI Quiz Results Analysis",
    "AI Flashcards Explain",
    "AI PDF to Quiz",
    "AI PDF to Flashcards",
    "Notes to Quiz",
    "Notes to Flashcards"
  ].map((feature, index) => (
    <li key={index} className="list__subs__page__premium__edusify">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <g strokeWidth={0} id="SVGRepo_bgCarrier" />
        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
        <g id="SVGRepo_iconCarrier">
          <path
            fill="#ffffff"
            d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </g>
      </svg>
      <span>{feature}</span>
    </li>
  ))}
</ul>

  </div>
</StyledWrapper>
<FooterNav/>
</div>

  );
};

export default PaymentComponent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import styled, { keyframes } from "styled-components";
import Confetti from 'react-confetti';
import { FiArrowLeft } from 'react-icons/fi';
import FeaturesCard from './FeaturesCard';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(99); // Default to ₹129 (monthly)
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium');
  const [duration, setDuration] = useState(''); // Always set to 'monthly' now
  const [showPremium, setShowPremium] = useState(true); // State to toggle between free and premium features
  const [isPremium, setIsPremium] = useState(null);
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60); // 3 days in seconds
  const [showConfetti, setShowConfetti] = useState(false);
  const nav = useNavigate();

  const SubscriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #F8F5FF, #FDFDFD); /* Soft pastel gradient */
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
`;

const Card = styled.div`
  width: 85%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const Header = styled.div`
  height: 80px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: relative;
  margin: -2rem -2rem 1rem -2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #5A3EAB; /* Deep luxe purple */
  background: linear-gradient(to right, #E6DAFF,rgb(222, 207, 255));
  box-shadow: inset 0px -2px 6px rgba(0, 0, 0, 0.05);
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2E1A47; /* Rich, elegant text color */
  margin-bottom: 1rem;
`;

const Plan = styled.div`
  padding: 1rem;
  border-radius: 14px;
  margin-top: 1rem;
  color: #3A2D62;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
  background: rgba(255, 255, 255, 0.4);
  border: ${({ active }) => (active ? '2px solid #D1A3FF' : '1px solid rgba(0, 0, 0, 0.05)')};
  box-shadow: ${({ active }) => (active ? '0px 4px 12px rgba(209, 163, 255, 0.4)' : 'none')};

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

const BestValue = styled.span`
  background: #D1A3FF;
  color: white;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
`;

const ButtonBase = styled.button`
  width: 100%; /* Ensures both buttons take full width */
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 14px;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
  box-shadow: 0px 6px 16px rgba(182, 139, 255, 0.4);
`;

const BorderButton = styled(ButtonBase)`
  background: transparent;
  border: 2.5px solid #6F42C1;
  color: #6F42C1;
`;

const Button = styled(ButtonBase)`
  background: linear-gradient(135deg, #B68BFF, #D1A3FF);
  color: white;
  border: none;

  &:hover {
    background: linear-gradient(135deg, #D1A3FF, #B68BFF);
    transform: scale(1.02);
  }
`;


const Countdown = styled.div`
  font-size: 0.9rem;
  margin-top: 1rem;
  color: #FF6B6B; /* Soft warning color */
  font-weight: 500;
  font-style: italic;
`;

const BackButton = styled.div`
  color: #222; /* Premium dark gray */
  font-size: 1.3rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  z-index: 1000;
  backdrop-filter: blur(10px); /* Subtle blur for premium glass effect */

  &:hover {
    background: rgba(0, 0, 0, 0.1); /* Slightly darker on hover */
  }


`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: #6B5B95; /* Soft elite color */
  margin-bottom: 1.5rem;
  text-align: center;
  max-width: 80%;
`;

// 🎨 Gradient Shine Animation for Best Value Badge
const shimmer = keyframes`
  0% { background-position: 0% }
  100% { background-position: 200% }
`;

// 🌟 Glowing Header Effect
const glow = keyframes`
  0% { box-shadow: 0px 0px 10px rgba(210, 173, 255, 0.4); }
  50% { box-shadow: 0px 0px 18px rgba(210, 173, 255, 0.8); }
  100% { box-shadow: 0px 0px 10px rgba(210, 173, 255, 0.4); }
`;





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

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to subscribe.');
        return;
      }
  
      let planAmount = 119; // Default to monthly

      if (duration === 'daily') planAmount = 29;
      else if (duration === 'weekly') planAmount = 59;
      else if (duration === 'monthly') planAmount = 119;
      
  
      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: amount,
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
    <SubscriptionWrapper>
    {showConfetti && <Confetti numberOfPieces={200} />}
  
    <Card>
      
<Link to='/'>
  <BackButton><FaArrowLeft/></BackButton>
  </Link>
      {/* 🚀 Premium Header */}
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
  {/* 🎯 Exclusive Messaging */}
  <Title>One Price. Unlimited Learning.</Title>
  <Subtitle>The AI-powered study ecosystem for toppers.</Subtitle>
</div>
<Plan
  active={duration === 'daily'}
  onClick={() => {
    setDuration('daily');
    setAmount(29); // Set daily price
  }}
>
  <span>Daily Access</span>
  <span>₹29/day</span>
</Plan>

      {/* 📌 Pricing Plans */}
      <Plan
        active={duration === 'weekly'}
        onClick={() => {
          setDuration('weekly');
          setAmount(99);
        }}
      >
        <span>Weekly Access</span>
        <span>₹99/week</span>
      </Plan>

      <Plan active={duration === "monthly"} onClick={() => { setDuration("monthly"); setAmount(2999); }}>
          <span>Monthly Plan <BestValue>Best Value</BestValue></span>
          <span>₹299/mo</span>
        </Plan>
  
    
  
{/* 🏆 Call to Action */}
{isPremium ? (
  <>
    <Button>You have Premium! 🔥</Button>
       <BorderButton onClick={() => nav('/subscription/features')}>See What You're Missing 👀</BorderButton>
  </>
) : (
  <>
 <Button onClick={handlePayment}>
  {`Unlock ${duration === "daily" ? "Daily" : duration === "weekly" ? "Weekly" : "Monthly"} Access Now 🚀`}
</Button>

    <BorderButton onClick={() => nav('/subscription/features')}>See What You're Missing 👀</BorderButton>
  </>
)}


    </Card>

  </SubscriptionWrapper>
  
  );
};

export default PaymentComponent;

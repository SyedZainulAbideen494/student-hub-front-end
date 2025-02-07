import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubscriptionPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';

const PaymentComponent = () => {
  const [isPremium, setIsPremium] = useState(null);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [discountActive, setDiscountActive] = useState(true);
  const nav = useNavigate();

  // Set fixed expiry timestamp for March 7, 2025, at 1:00 PM IST
  const offerExpiryTimestamp = new Date('2025-02-08T07:30:00Z').getTime(); // Convert IST to UTC

  useEffect(() => {
    const updateRemainingTime = () => {
      const currentTime = Date.now();
      const remainingTime = Math.max(0, Math.floor((offerExpiryTimestamp - currentTime) / 1000));

      setTimeLeft(remainingTime);
      setDiscountActive(remainingTime > 0);
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
        .then((response) => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to subscribe.');
        return;
      }

      let planAmount = discountActive ? 79 : 129; // ₹99 if discount is active, ₹129 otherwise

      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: planAmount,
        currency: 'INR',
        subscription_plan: 'premium',
        token,
        duration: 'monthly',
      });

      const options = {
        key: 'rzp_live_jPX6SxetQbApHC',
        amount: data.order.amount,
        currency: 'INR',
        order_id: data.order.id,
        name: 'Edusify',
        description: `Subscription Payment (Monthly)`,
        handler: async (response) => {
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            subscription_plan: 'premium',
            duration: 'monthly',
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
        paddingBottom: '50px',
      }}
    >
      {/* Premium Card */}
      <div className="card__subscription__new">
        <h3 className="title__subscription__new">Premium</h3>
        <p className="description__subscription__new">
          Elevate your learning with AI-powered tools.
        </p>
        {discountActive ? (
  <div className="fomo-banner">
    <span className="fomo-icon"></span> Limited Time Offer!  
    <br />
    <span className="fomo-price">Get Premium for ₹79 instead of ₹129!</span>  
    <br />
    <span className="fomo-timer">Offer expires in {formatTime(timeLeft)}</span>
  </div>
) : (
  <div className="expired-banner">
    <span className="expired-icon"></span> Offer Expired! Now ₹129/month.
  </div>
)}
        <p className="price__subscription__new">
          <span className="currency__subscription__new">₹</span>
          {discountActive ? '79' : '129'}
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

  {/* Plan Includes Card */}
  <div className="card__plan__includes">
  <h3 className="title__plan__includes">Plan Includes</h3>
  <ul className="features__list">
    <li><span className="checkmark__features__list"></span> Unlimited Magic Usage</li>
    <li><span className="checkmark__features__list"></span> Unlimited AI Quiz Generation</li>
    <li><span className="checkmark__features__list"></span> Unlimited AI Plan Generations</li>
    <li><span className="checkmark__features__list"></span> Unlimited AI Notes Generation</li>
    <li><span className="checkmark__features__list"></span> Unlimited PDF to Notes</li>
    <li><span className="checkmark__features__list"></span> Unlock AI Recommendations on Pomodoro</li>
    <li><span className="checkmark__features__list"></span> Unlock AI Tasks Generation</li>
    <li><span className="checkmark__features__list"></span> Unlock AI Plan Tasks Generation</li>
    <li><span className="checkmark__features__list"></span> Unlock AI Quiz Results Analysis</li>
    <li><span className="checkmark__features__list"></span> Unlock AI Flashcards Explain</li>
    <li><span className="checkmark__features__list"></span> Unlock PDF Quiz</li>
    <li><span className="checkmark__features__list"></span> Unlock PDF to Flashcards</li>
    <li><span className="checkmark__features__list"></span> Unlock Notes to Quiz</li>
    <li><span className="checkmark__features__list"></span> Unlock Notes to Flashcards</li>
  </ul>
</div>


  <FooterNav />
</div>
  );
};

export default PaymentComponent;



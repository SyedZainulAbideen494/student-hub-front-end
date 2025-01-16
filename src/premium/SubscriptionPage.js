import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './SubscriptionPage.css'; // Import the CSS file for styling
import FooterNav from '../app_modules/footernav';

const freeFeatures = [
  'Manage up to 10 tasks at a time',
  'Join up to 2 groups',
  'Create up to 15 notes and flashcards at once',
  '20 AI queries per day',
  'Create up to 5 quizzes at a time',
  'Attend only 5 quizzes a day',
  'Default, non-changeable Pomodoro Timer',
  'No stats shown for Pomodoro Timer',
  'Manage up to 20 calendar dates at a time',
];

const premiumFeatures = [
  'Unlimited task management',
  'Create unlimited groups',
  'Join unlimited groups',
  'Create unlimited notes',
  'Unlimited math queries',
  'Unlimited science queries',
  'Unlimited commerce queries',
  'Create unlimited quizzes',
  'Customizable Pomodoro Timer',
  'Stats for Pomodoro Time',
  'Unlimited calendar date management',
];

const SubscriptionPage = () => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Replace with your method of obtaining the token
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await axios.post(API_ROUTES.verifyPremium, { token });
        const { is_premium } = response.data;
        setIsPremium(true);
      } catch (error) {
        console.error('Error verifying premium status:', error);
      }
    };

    checkPremiumStatus();
  }, [token]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post(API_ROUTES.getPremium, { token });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <section className="pricing-section">
      <h2>Choose Your Plan</h2>
      <div className="pricing-cards">
        {/* Free Plan */}
        <div className="pricing-card">
          <h3>Free Plan</h3>
          <p className="price">$0/month</p>
          <ul className="features-list">
            {freeFeatures.map((feature, index) => (
              <li key={index}>✔️ {feature}</li>
            ))}
          </ul>
        </div>

        {/* Premium Plan */}
        <div className={`pricing-card ${isPremium ? 'active' : ''}`}>
          <h3>Premium Plan</h3>
          <p className="price">$1.18/month</p>
          <ul className="features-list">
            {premiumFeatures.map((feature, index) => (
              <li key={index}>✔️ {feature}</li>
            ))}
          </ul>
          {isPremium ? (
            <span className="cta-btn" onClick={handleCheckout}>
            Select Premium Plan
          </span>
          ) : (
            <span className="cta-btn" onClick={handleCheckout}>
              Select Premium Plan
            </span>
          )}
        </div>
      </div>
      <FooterNav />
    </section>
  );
};

export default SubscriptionPage;
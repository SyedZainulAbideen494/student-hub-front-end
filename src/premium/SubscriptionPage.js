import React, { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './SubscriptionPage.css'; // Import the CSS file for styling

const freeFeatures = [
  'Manage up to 10 tasks at a time',
  'Create up to 2 groups',
  'Join up to 10 groups at once',
  'Create up to 15 notes at once',
  '15 math queries per day',
  '15 science queries per day',
  '15 commerce queries per day',
  'Create up to 20 quizzes at a time',
  'Default, non-changeable Pomodoro Timer',
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
  'Unlimited calendar date management',
];

const SubscriptionPage = () => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Replace with your method of obtaining the token

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
      <div className="pricing-card">
        <h3>Premium Plan</h3>
        <p className="price">$0.60/month</p>
        <ul className="features-list">
          {premiumFeatures.map((feature, index) => (
            <li key={index}>✔️ {feature}</li>
          ))}
        </ul>
          <span className="cta-btn" onClick={handleCheckout}>
            Select Premium Plan
          </span>
      </div>
    </div>
  </section>
  );
};

export default SubscriptionPage;
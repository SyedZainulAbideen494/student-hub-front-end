import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';

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
    <div className="subscription-page">
      <h1>Choose Your Subscription</h1>
      <div className="plan">
        <h2>Free Plan</h2>
        <ul>
          {freeFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p>Price: Free</p>
      </div>
      <div className="plan">
        <h2>Premium Plan</h2>
        <ul>
          {premiumFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p>$0.60 approx.</p> {/* Display INR and approximate USD */}
        <button onClick={handleCheckout}>Subscribe</button>
      </div>
    </div>
  );
};

export default SubscriptionPage;
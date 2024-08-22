import React from 'react';
import './PricingSection.css';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const freeFeatures = [
    'Basic Task Management',
    'Limited Study Planner',
    'Access to Group Study',
    'Standard Pomodoro Timer',
    'Basic Analytics',
    'Daily Quotes',
  ];

  const premiumFeatures = [
    'Customizable Quizzes',
    'Advanced Pomodoro Timer',
    'Enhanced Study Planner',
    'Priority Group Study Access',
    'Detailed Study Analytics',
    'Exclusive Daily Quotes',
    'Priority Support',
    'Music Player Integration',
    'Social Feed Integration',
    'Math & Science Helper',
    'Aesthetic Notes & Flashcards',
    'Calendar & Reminders',
  ];

  const priceInINR = 50;
  const priceInUSD = (priceInINR / 83).toFixed(2); // Assuming 1 USD = 83 INR

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
          <Link to='/sign-up'>
          <a className="cta-btn">
            Select Free Plan
          </a>
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="pricing-card">
          <h3>Premium Plan</h3>
          <p className="price">${priceInUSD}/month</p>
          <ul className="features-list">
            {premiumFeatures.map((feature, index) => (
              <li key={index}>✔️ {feature}</li>
            ))}
          </ul>
          <Link to='/sign-up'>
          <a className="cta-btn">
            Select Free Plan
          </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
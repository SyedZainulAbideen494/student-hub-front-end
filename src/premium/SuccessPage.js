import React, { useEffect, useState } from 'react';
import './SuccessPage.css';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showText, setShowText] = useState(false);
  const nav = useNavigate()

  const handleGoBack = () => {
    nav('/')
  }

  useEffect(() => {
    setTimeout(() => setShowCheckmark(true), 500);
    setTimeout(() => setShowText(true), 1000);
  }, []);

  return (
    <div className="success-modal">
      <div className="success-content">
        <div className="success-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`checkmark-svg ${showCheckmark ? 'show' : ''}`}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              className="speedometer-circle"
            />
            <path
              d="M9 12.5l2.5 2.5 5-5"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={`checkmark-path ${showCheckmark ? 'animate-checkmark' : ''}`}
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#38ef7d', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#11998e', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {showText && (
          <>
            <h1 className="success-headline">Awesome</h1>
            <p className="success-message">You have Edusify premium!</p>
            <button className="success-button" onClick={handleGoBack}>Go Back</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
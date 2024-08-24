import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SuccessPage.css'; // Import the CSS file for styling

const SuccessPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const success = query.get('success') === 'true';

  return (
    <div className="success-page">
      <div className="content-success-page">
        {success ? (
          <>
            <div className="icon-success-page success-icon-success-page">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.285 6.707a1 1 0 00-1.414 0L10 15.172 5.707 10.879a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l9.5-9.5a1 1 0 000-1.414z" fill="#1DB954"/>
              </svg>
            </div>
            <h1 className="headline-success-page">Success!</h1>
            <p className="message-success-page">Your Edusify Premium subscription has been activated.</p>
            <p className="details-success-page">Enjoy all the premium features and make the most out of your experience!</p>
            <Link to='/planner'>
              <button className="button-success-page">Go to planner</button>
            </Link>
          </>
        ) : (
          <>
          <div className="icon-success-page error-icon-success-page">
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#E63946" strokeWidth="2" fill="none" />
    <line x1="12" y1="8" x2="12" y2="14" stroke="#E63946" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1" fill="#E63946" />
  </svg>
</div>
            <h1 className="headline-success-page">Oops!</h1>
            <p className="message-success-page">Something went wrong with your subscription. Please try again.</p>
            <Link to='/planner'>
              <button className="button-success-page">Go to planner</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
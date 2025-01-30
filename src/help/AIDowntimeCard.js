import React from 'react';
import './AIDowntimeCard.css'; // Import the CSS file

const AIDowntimeCard = ({ onDismiss }) => {
  return (
    <div className="container__downTime__Card">
      <div className="content__downTime__Card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13v6h2V7h-2zm0 8v2h2v-2h-2z" fill="#d9534f" />
        </svg>
        <div className="text__downTime__Card">
          <h3>AI Features Are Temporarily Down</h3>
          <p>Our AI services rely on Google's servers, which are currently experiencing downtime. Other features are working fine.</p>
        </div>
        <button className="button__downTime__Card" onClick={onDismiss}>Got it</button>
      </div>
    </div>
  );
};

export default AIDowntimeCard;

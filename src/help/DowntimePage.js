import React from 'react';
import './DowntimePage.css'; // Import the CSS file

const DowntimePage = ({ onProceed }) => {
  return (
    <div className="container__downtime__page">
      <div className="content__downtime__page">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="120" height="120">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13v6h2V7h-2zm0 8v2h2v-2h-2z" fill="#007aff" />
        </svg>
        <h1 className="heading__downtime__page">Our AI Services Are Temporarily Unavailable</h1>
        <p className="message__downtime__page">
          We’re working to resolve the issue. Thank you for your patience.
        </p>
        <button className="button__downtime__page" onClick={onProceed}>Proceed Anyway</button>
      </div>
    </div>
  );
};

export default DowntimePage;
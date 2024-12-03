import React from 'react';
import './badgeModal.css';

const BadgeModal = ({ isVisible, badgeName, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="__badge__Modal__page-overlay" onClick={onClose}>
      <div className="__badge__Modal__page-content" onClick={(e) => e.stopPropagation()}>
        {/* Prize Medal with Ribbon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 140"
          width="100"
          height="140"
          className="__badge__Modal__page-badge-icon"
        >
          {/* Outer Circle (Medal Base) */}
          <circle cx="50" cy="50" r="40" fill="#FFD700" stroke="#F1C40F" strokeWidth="4" />
          
          {/* Inner Circle (Shiny Effect) */}
          <circle cx="50" cy="50" r="30" fill="#FFDC00" stroke="#F39C12" strokeWidth="2" />

          {/* Inner Shiny Center */}
          <circle cx="50" cy="50" r="20" fill="#FFB84D" />

          {/* Ribbon part */}
          <path
            d="M30,90 C50,110 50,110 70,90"
            fill="none"
            stroke="#E67E22"
            strokeWidth="6"
          />
          
          {/* Ribbon End */}
          <path
            d="M40,120 L60,120 L50,130 L40,120"
            fill="#E67E22"
          />
        </svg>

        <h2>Congratulations!</h2>
        <p>You've earned a new badge:</p>
        <h3>{badgeName}</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BadgeModal;

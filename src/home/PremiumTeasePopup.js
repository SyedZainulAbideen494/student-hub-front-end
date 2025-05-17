import React, { useEffect, useState } from 'react';
import './PremiumTeasePopup.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';

const PremiumTeasePopup = ({ isOpen, onClose, onUpgrade }) => {
  const [isPremium, setIsPremium] = useState(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const lastSeen = localStorage.getItem('premiumPopupSeenAt');

    // Check if popup was seen within the last hour
    const now = Date.now();
    const seenRecently = lastSeen && now - parseInt(lastSeen, 10) < 3600 * 1000;

    if (!seenRecently) {
      setShouldShow(true); // only allow if not seen recently
    }

    if (token) {
      axios
        .post(API_ROUTES.checkSubscription, {}, {
          headers: { Authorization: token }
        })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('premiumPopupSeenAt', Date.now().toString());
    onClose();
  };

  if (!isOpen || isPremium === null || isPremium || !shouldShow) return null;

  return (
  <div className="lux-popup-overlay">
    <div className="lux-stars"></div>
    <div className="lux-popup-container">
      <span className="lux-popup-close" onClick={handleClose}>×</span>

      <div className="lux-ribbon">Not for everyone. Built for the 1%.</div>

      <h1 className="lux-title">Edusify Premium</h1>
      <p className="lux-tagline">Your unfair advantage is waiting.</p>

      <div className="lux-divider"></div>

      <p className="lux-desc">
        Instant access to elite AI tools.<br />
        Designed for those who move differently.
      </p>

      <p className="lux-scarcity">
        Most students scroll. You execute.<br />
        This isn’t a free tool. It’s a weapon.
      </p>

      <div className="lux-price">Access: ₹299/month</div>

      <button className="lux-btn" onClick={() => {
        localStorage.setItem('premiumPopupSeenAt', Date.now().toString());
        onUpgrade();
      }}>
        Unlock Premium
      </button>

      <div className="lux-powered">AI-Driven · Distraction-Free · Results-Only</div>
    </div>
  </div>
);

};

export default PremiumTeasePopup;

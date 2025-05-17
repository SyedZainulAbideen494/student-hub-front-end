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
    <div className="popup-overlay">
      <div className="popup-container">
        <span className="popup-close" onClick={handleClose}>×</span>
        <h1 className="popup-title">Edusify Premium</h1>
        <p className="popup-subtitle">Effortlessly ahead. Quietly powerful.</p>
        <div className="popup-divider" />
        <p className="popup-info">Smart AI · AI Tools · Clean Interface · Zero Noise</p>
        <div className="popup-price">₹299/month</div>
        <button className="popup-btn" onClick={() => {
          localStorage.setItem('premiumPopupSeenAt', Date.now().toString());
          onUpgrade();
        }}>
          Get Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumTeasePopup;

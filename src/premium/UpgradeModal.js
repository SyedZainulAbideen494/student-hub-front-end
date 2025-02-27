import React, { useState } from 'react';
import './UpgradeModal__premium__upgrade__modal.css';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ message, isOpen, onClose }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const nav = useNavigate();

  if (!isOpen) return null; // Hide modal if not open

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      nav('/subscription');
    }, 0); // Simulating a small delay for UX (optional)
  };

  return (
    <div className="overlay__premium__upgrade__modal">
      <div className="modal__premium__upgrade__modal">
        <h2 className="heading__premium__upgrade__modal">Upgrade</h2>
        <p className="message__premium__upgrade__modal">{message}</p>
        <div className="buttons__premium__upgrade__modal">
          <button className="close__premium__upgrade__modal" onClick={onClose} disabled={isUpgrading}>
            {isUpgrading ? "Processing..." : "Cancel"}
          </button>
          <button className="upgrade__premium__upgrade__modal" onClick={handleUpgrade} disabled={isUpgrading}>
            {isUpgrading ? "Upgrading..." : "Get Premium"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

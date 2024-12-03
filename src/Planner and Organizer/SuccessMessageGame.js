import React, { useEffect } from 'react';
import './SuccessMessageGame.css';

const GamificationMessage = ({ message, points, onClose }) => {

  // Auto-close the modal after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the modal
    }, 1500); // 2 seconds auto-close

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [onClose]);

  return (
    <div className="modal__game__msg__planner">
      <div className="modal-content__game__msg__planner">
        <p>{message} +<strong>{points}</strong> points!</p>
      </div>
    </div>
  );
};

export default GamificationMessage;

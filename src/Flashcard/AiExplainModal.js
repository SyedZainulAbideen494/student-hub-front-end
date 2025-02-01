import { useEffect } from 'react';
import './AiExplainModal.css';

const AIExplanationModal = ({ isOpen, onClose, explanation, loading, setExplanation }) => {
  // Clear explanation when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setExplanation(""); // Reset explanation on close
    }
  }, [isOpen, setExplanation]);

  if (!isOpen) return null;

  return (
    <div className="modal__ai__explain__set__Modal">
      <div className="modal__content__ai__explain__set__Modal">
        <button className="modal__close-btn__ai__explain__set__Modal" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title__ai__explain__set__Modal">AI Explanation</h2>
        {loading ? (
          <p className="modal__loading__ai__explain__set__Modal">Loading...</p>
        ) : (
          <p className="modal__text__ai__explain__set__Modal">{explanation}</p>
        )}
      </div>
    </div>
  );
};

export default AIExplanationModal;

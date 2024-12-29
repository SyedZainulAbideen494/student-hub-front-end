import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './Survey.css';

const FeedbackForm = () => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Get the current date and month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
  
    // Check if the current date is within the range 28, 29, 30, 31, 1, or 2
    const validDays = [28, 29, 30, 31, 1];
    if (validDays.includes(currentDay)) {
      // Check if feedback has already been submitted this month
      const submittedDates = JSON.parse(localStorage.getItem('submittedDatesWeeklySurvey')) || [];
      const hasSubmittedThisMonth = submittedDates.some((date) => new Date(date).getMonth() === currentMonth);
  
      // If feedback hasn't been submitted this month, show the feedback form
      if (!hasSubmittedThisMonth) {
        setTimeout(() => setIsOpen(true), 2000); // Delay modal opening by 2 seconds
      }
    }
  }, []);
  

  const handleEmojiClick = (emojiRating) => {
    setRating(emojiRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const data = {
      token,
      feedback: feedback.trim()
        ? `${feedback} (satisfaction level: ${rating} star${rating > 1 ? 's' : ''})`
        : `Satisfaction level: ${rating} star${rating > 1 ? 's' : ''}`,
    };
    

    try {
      await axios.post(API_ROUTES.feedbackEduisfy, data);
      setSuccessMessage('Thank you for your feedback!');

      // Track the date when feedback was submitted
      const submittedDates = JSON.parse(localStorage.getItem('submittedDatesWeeklySurvey')) || [];
      const newSubmittedDates = [...submittedDates, new Date().toISOString()];
      localStorage.setItem('submittedDatesWeeklySurvey', JSON.stringify(newSubmittedDates));

      setIsSubmitted(true);
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && !isSubmitted && (
        <div className={`__feedback__survey__form__monthly__modal ${isOpen ? '__feedback__survey__form__monthly__modal__slide-down' : ''}`}>
          <h2 className="__feedback__survey__form__monthly__heading">How satisfied are you with Edusify?</h2>
          
          {!rating ? (
            <div className="__feedback__survey__form__monthly__emoji-rating">
              {['😔', '😟', '😐', '😊', '😁'].map((emoji, index) => (
                <span
                  key={index}
                  onClick={() => handleEmojiClick(index + 1)}
                  className="__feedback__survey__form__monthly__emoji"
                >
                  {emoji}
                </span>
              ))}
            </div>
          ) : (
            <div className="__feedback__survey__form__monthly__feedback-textbox">
              <textarea
                className="__feedback__survey__form__monthly__feedback-textarea"
                placeholder="Optional: Add your feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                className="__feedback__survey__form__monthly__submit-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          )}

          {successMessage && (
            <p className="__feedback__survey__form__monthly__thank-you-message">{successMessage}</p>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackForm;

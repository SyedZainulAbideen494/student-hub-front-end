import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Survey.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const FeedbackFormWeekly = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(3); // Default neutral rating
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTextareaVisible, setIsTextareaVisible] = useState(false); // For controlling textarea visibility

  useEffect(() => {
    const feedbackSubmitted = localStorage.getItem('feedbackSubmittedWeeklySurvey');
    const submittedDates = JSON.parse(localStorage.getItem('submittedDatesWeeklySurvey')) || [];

    const today = new Date();
    const lastSubmittedDate = submittedDates.length > 0 ? new Date(submittedDates[submittedDates.length - 1]) : null;

    const isThreeWeeksPassed = lastSubmittedDate ? today - lastSubmittedDate >= 21 * 24 * 60 * 60 * 1000 : true;
    const isWeekend = today.getDay() === 5 || today.getDay() === 6 || today.getDay() === 0;

    if (feedbackSubmitted || !isThreeWeeksPassed || !isWeekend) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const data = {
      token,
      feedback: feedback.trim() ? `${feedback} (Rating: ${rating} star${rating > 1 ? 's' : ''})` : `Rating given: ${rating} star${rating > 1 ? 's' : ''}`,
    };

    try {
      await axios.post(API_ROUTES.feedbackEduisfy, data);
      setSuccessMessage('Feedback submitted successfully!');
      setFeedback('');

      const submittedDates = JSON.parse(localStorage.getItem('submittedDatesWeeklySurvey')) || [];
      const newSubmittedDates = [...submittedDates, new Date().toISOString()];
      localStorage.setItem('submittedDatesWeeklySurvey', JSON.stringify(newSubmittedDates));

      setIsSubmitted(true);
      localStorage.setItem('feedbackSubmittedWeeklySurvey', 'true');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (ratingValue) => {
    setRating(ratingValue);
    setIsTextareaVisible(true); // Show the feedback form after emoji click
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleClose = () => {
    localStorage.setItem('feedbackSubmittedWeeklySurvey', 'true');
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="feedback-card__feedback__weekly">
        {/* Emoji Container with SVG Icons */}
        <div className="emoji-container__feedback__weekly">
          <svg
            onClick={() => handleEmojiClick(1)}
            className={`emoji__feedback__weekly ${rating === 1 ? 'selected' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            role="button"
            aria-label="Rate as 1 star"
            title="Rate as 1 star"
          >
            <circle cx="12" cy="12" r="10" fill="#f44336" />
            <path d="M8 10 L16 10 C17.1 10 18 10.9 18 12 C18 13.1 17.1 14 16 14 L8 14 C6.9 14 6 13.1 6 12 C6 10.9 6.9 10 8 10 Z" fill="#fff" />
          </svg>

          <svg
            onClick={() => handleEmojiClick(2)}
            className={`emoji__feedback__weekly ${rating === 2 ? 'selected' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            role="button"
            aria-label="Rate as 2 stars"
            title="Rate as 2 stars"
          >
            <circle cx="12" cy="12" r="10" fill="#ff9800" />
            <path d="M8 10 L16 10 C17.1 10 18 10.9 18 12 C18 13.1 17.1 14 16 14 L8 14 C6.9 14 6 13.1 6 12 C6 10.9 6.9 10 8 10 Z" fill="#fff" />
          </svg>

          <svg
            onClick={() => handleEmojiClick(3)}
            className={`emoji__feedback__weekly ${rating === 3 ? 'selected' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            role="button"
            aria-label="Rate as 3 stars"
            title="Rate as 3 stars"
          >
            <circle cx="12" cy="12" r="10" fill="#ffeb3b" />
            <path d="M8 10 L16 10 C17.1 10 18 10.9 18 12 C18 13.1 17.1 14 16 14 L8 14 C6.9 14 6 13.1 6 12 C6 10.9 6.9 10 8 10 Z" fill="#fff" />
          </svg>

          <svg
            onClick={() => handleEmojiClick(4)}
            className={`emoji__feedback__weekly ${rating === 4 ? 'selected' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            role="button"
            aria-label="Rate as 4 stars"
            title="Rate as 4 stars"
          >
            <circle cx="12" cy="12" r="10" fill="#4caf50" />
            <path d="M8 10 L16 10 C17.1 10 18 10.9 18 12 C18 13.1 17.1 14 16 14 L8 14 C6.9 14 6 13.1 6 12 C6 10.9 6.9 10 8 10 Z" fill="#fff" />
          </svg>

          <svg
            onClick={() => handleEmojiClick(5)}
            className={`emoji__feedback__weekly ${rating === 5 ? 'selected' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            role="button"
            aria-label="Rate as 5 stars"
            title="Rate as 5 stars"
          >
            <circle cx="12" cy="12" r="10" fill="#8bc34a" />
            <path d="M8 10 L16 10 C17.1 10 18 10.9 18 12 C18 13.1 17.1 14 16 14 L8 14 C6.9 14 6 13.1 6 12 C6 10.9 6.9 10 8 10 Z" fill="#fff" />
          </svg>
        </div>

        {/* Feedback Form - Only visible after emoji click */}
        {isTextareaVisible && (
          <div className="feedback-form-container">
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Your feedback..."
              className="feedback-textarea__feedback__weekly"
              aria-label="Enter your feedback"
            />
            <button onClick={handleSubmit} className="submit-button__feedback__weekly" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="success-message__feedback__weekly">
            {successMessage}
            <button onClick={handleClose} className="close-button__feedback__weekly">Close</button>
          </div>
        )}
      </div>
    )
  );
};

export default FeedbackFormWeekly;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewModal.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useLocation } from 'react-router-dom';

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  // Rating click handler
  const handleRatingClick = async (rate) => {
    setRating(rate);
    const token = localStorage.getItem('token');

    if (rate >= 4) {
      const data = { token, feedback: `Rating given: ${rate}` };
      try {
        await axios.post(API_ROUTES.feedbackEduisfy, data);
        localStorage.setItem('feedbackSubmitted', 'true');
        window.open('https://g.page/r/CbK_EhVVrsJqEAI/review', '_blank');
        setIsOpen(false);
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  // Feedback form submission handler
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
      localStorage.setItem('feedbackSubmitted', 'true');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // "Later" button handler
  const handleLaterClick = () => {
    const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000);
    localStorage.setItem('nextReviewTime', twoHoursLater);
    setIsOpen(false);
  };

  const checkModalConditions = () => {
    const feedbackSubmitted = localStorage.getItem('feedbackSubmitted');
    const nextReviewTime = localStorage.getItem('nextReviewTime');
    const firstSignInTime = localStorage.getItem('firstSignInTime');
  
    if (!firstSignInTime) {
      const currentTime = new Date().getTime();
      localStorage.setItem('firstSignInTime', currentTime);
      setIsOpen(false); // Don't show modal yet
    } else if (feedbackSubmitted === 'true') {
      setIsOpen(false); // Feedback already submitted
    } else {
      const now = new Date().getTime();
      const timeSinceLogin = (now - firstSignInTime) / (1000 * 60 * 60); // Time in hours
  
      if (timeSinceLogin >= 2 && (!nextReviewTime || now >= new Date(nextReviewTime).getTime())) {
        setIsOpen(true); // Show modal after 2 hours since login and if nextReviewTime has passed
      }
    }
  };
  
  useEffect(() => {
    checkModalConditions();
    setLoading(false);
  }, []);
  
  if (loading) return null;
  if (!isOpen) return null;

  return (
    <div className="modal-overlay__review__give__Eduisyf">
      <div className="modal-content__review__give__Eduisyf">
        <h2>Rate Your Experience</h2>
        <p>Help us make Eduisfy better!</p>
        <div className="rating-container__review__give__Eduisyf">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star__review__give__Eduisyf ${rating >= star ? 'selected__review__give__Eduisyf' : ''}`}
              onClick={() => handleRatingClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        {rating > 0 && rating < 4 ? (
          <form className="feedback-form__review__give__Eduisyf" onSubmit={handleSubmit}>
            <textarea
              className="feedback-textarea__review__give__Eduisyf"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your suggestions matter a lot! Please tell us how we can improve."
            />
            <button className="submit-button__review__give__Eduisyf" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        ) : null}
        {rating === 0 && (
          <button className="later-button__review__give__Eduisyf" onClick={handleLaterClick}>
            Later
          </button>
        )}
        {successMessage && <p className="success-message__review__give__Eduisyf">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ReviewModal;

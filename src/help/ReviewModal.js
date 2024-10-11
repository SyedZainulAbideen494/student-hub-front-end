import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewModal.css'; // Import CSS for styling
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useLocation } from 'react-router-dom';

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false); // Modal is initially closed
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [showLater, setShowLater] = useState(false);
  const location = useLocation(); // To get the current location/path

  // Function to handle rating click
  const handleRatingClick = async (rate) => {
    setRating(rate);
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
    // Set feedback message based on rating
    const feedbackMessage = `Rating given: ${rate}`;
  
    if (rate >= 4) {
      const data = { token, feedback: feedbackMessage };
      try {
        await axios.post(API_ROUTES.feedbackEduisfy, data);
        localStorage.setItem('feedbackSubmitted', 'true'); // Mark feedback as submitted
        window.open('https://g.page/r/CbK_EhVVrsJqEAI/review', '_blank'); // Redirect to review link
        setIsOpen(false); // Close the modal
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  // Function to handle feedback form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token'); // Retrieve token from local storage
  
    const data = {
      token,
      feedback: feedback.trim() ? `${feedback} (Rating: ${rating} star${rating > 1 ? 's' : ''})` : `Rating given: ${rating} star${rating > 1 ? 's' : ''}`,
    };
  
    try {
      await axios.post(API_ROUTES.feedbackEduisfy, data); // Send token with feedback
      setSuccessMessage('Feedback submitted successfully!');
      setFeedback(''); // Clear the feedback
      localStorage.setItem('feedbackSubmitted', 'true'); // Mark feedback as submitted
      setIsOpen(false); // Close the modal
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle "Later" button click
  const handleLaterClick = () => {
    const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours later
    localStorage.setItem('nextReviewTime', twoHoursLater); // Set the next review time
    setShowLater(true);
    setIsOpen(false); // Close the modal
  };

  // Function to check if 2 hours of usage have passed since first login
  const checkUsageTime = () => {
    const firstSignInTime = localStorage.getItem('firstSignInTime');
    const now = new Date().getTime();
  
    if (firstSignInTime) {
      const timeElapsed = (now - firstSignInTime) / (1000 * 60 * 60); // Time elapsed in hours
      return timeElapsed >= 2; // Return true if 2 hours have passed
    }
    return false;
  };

  // Check if feedback should be shown based on user activity
  useEffect(() => {
    const processData = async () => {
      const feedbackSubmitted = localStorage.getItem('feedbackSubmitted');
      const nextReviewTime = localStorage.getItem('nextReviewTime');
      const now = new Date().getTime();

      if (!localStorage.getItem('firstSignInTime')) {
        // If first sign-in time is not stored, store it now
        localStorage.setItem('firstSignInTime', now);
        setIsOpen(false); // Don't show modal yet
      } else if (checkUsageTime() && feedbackSubmitted !== 'true') {
        // Check if 2 hours have passed since first login
        if (!nextReviewTime || now >= new Date(nextReviewTime).getTime()) {
          setIsOpen(true); // Show the modal if 2 hours passed and feedback not submitted
        }
      }

      setLoading(false); // Stop loading after processing
    };

    processData(); // Call the async function to process data
  }, []);

  if (loading) return null; // While loading, show nothing
  if (!isOpen) return null; // If the modal is not open, show nothing

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
        <button className="later-button__review__give__Eduisyf" onClick={handleLaterClick}>
          Later
        </button>
        {showLater && <p className="later-message__review__give__Eduisyf">You can provide feedback again in 2 hours.</p>}
        {successMessage && <p className="success-message__review__give__Eduisyf">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ReviewModal;

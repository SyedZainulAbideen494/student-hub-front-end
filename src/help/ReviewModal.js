import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewModal.css'; // Import CSS for styling
import { API_ROUTES } from '../app_modules/apiRoutes';

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(true); // Modal is open by default
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [showLater, setShowLater] = useState(false);

  const handleRatingClick = async (rate) => {
    setRating(rate);
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
    // Set feedback message based on rating
    const feedbackMessage = `Rating given: ${rate}`; // Create feedback message
  
    if (rate >= 4) {
      // Prepare data to send to the backend
      const data = {
        token,
        feedback: feedbackMessage // Use the feedback message here
      };
  
      try {
        // Send the data to the backend
        await axios.post(API_ROUTES.feedbackEduisfy, data);
        
        // Store the feedback submission state
        localStorage.setItem('feedbackSubmitted', 'true'); // Mark feedback as submitted
  
        // Redirect to review link after successful submission
        window.open('https://g.page/r/CbK_EhVVrsJqEAI/review', '_blank');
        setIsOpen(false); // Close the modal
      } catch (error) {
        console.error('Error submitting feedback before redirect:', error);
        // Optionally, handle the error (e.g., show a message to the user)
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token'); // Retrieve token from local storage
  
    // Prepare data to send based on feedback input
    const data = {
      token,
      feedback: feedback.trim() ? `${feedback} (Rating: ${rating} star${rating > 1 ? 's' : ''})` : `Rating given: ${rating} star${rating > 1 ? 's' : ''}`, // Include stars in the feedback message
    };
  
    try {
      const response = await axios.post(API_ROUTES.feedbackEduisfy, data); // Send token with feedback
      setSuccessMessage('Feedback submitted successfully!'); // Set success message
      setFeedback(''); // Clear the feedback after submission
      localStorage.setItem('feedbackSubmitted', 'true'); // Mark feedback as submitted
      setIsOpen(false); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLaterClick = () => {
    // Store the current time in local storage or any other method to show the form again after 8 hours
    const eightHoursLater = new Date(Date.now() + 8 * 60 * 60 * 1000); // Change to 8 hours
    localStorage.setItem('nextReviewTime', eightHoursLater);
    setShowLater(true);
    setIsOpen(false); // Close the modal
  };

  useEffect(() => {
    const processData = async () => {
      // Fetch or process any token or other initial data first
      const token = await localStorage.getItem('token'); // Process token (mock async if needed)
      const feedbackSubmitted = localStorage.getItem('feedbackSubmitted');
      const nextReviewTime = localStorage.getItem('nextReviewTime');
      const now = new Date();

      // After token and other data are fetched, process the modal logic
      if (feedbackSubmitted === 'true') {
        setIsOpen(false); // Close the modal if feedback has already been submitted
      } else if (nextReviewTime && now < new Date(nextReviewTime)) {
        setShowLater(true);
        setIsOpen(false); // Close the modal if feedback is not allowed yet
      } else {
        setIsOpen(true); // Open the modal if all conditions are satisfied
      }

      setLoading(false); // Set loading to false once processing is complete
    };

    processData(); // Call the async function to process the token and feedback check
  }, []);

  if (loading) return null; // While loading, do not show anything

  if (!isOpen) return null; // If the modal is closed, return null



  return (
    <div className="modal-overlay__review__give__Eduisyf">
      <div className="modal-content__review__give__Eduisyf">
        <h2>Rate Your Experience</h2>
        <p style={{margin: '0px 0px 10px 0px'}}>Help us make Eudisfy better!</p>
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
        {rating > 0 && rating < 4 ? ( // Show input only if stars are selected and rating is less than 4
          <form className="feedback-form__review__give__Eduisyf" onSubmit={handleSubmit}>
            <textarea
              className="feedback-textarea__review__give__Eduisyf"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your suggestions matter a lot! Please tell us how we can improve."
            />
            <button style={{padding: '12px '}} className="later-button__review__give__Eduisyf" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        ) : null}
        {/* Always show the Later button */}
        <div className="button-container__review__give__Eduisyf">
          <button className="later-button__review__give__Eduisyf" onClick={handleLaterClick}>
            Later
          </button>
        </div>
        {showLater && <p className="later-message__review__give__Eduisyf">You can provide feedback again in 3 hours.</p>}
        {successMessage && <p className="success-message__review__give__Eduisyf">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ReviewModal;

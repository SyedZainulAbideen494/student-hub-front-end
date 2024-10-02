import React, { useState } from 'react';
import axios from 'axios';
import SuccessMessage from '../app_modules/SuccessMessage';
import './FeedbackForm.css'; // Import the CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.post(API_ROUTES.feedbackEduisfy, { feedback, token }); // Send token with feedback
      setSuccessMessage('Feedback submitted successfully!'); // Set success message
      setFeedback(''); // Clear the feedback after submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setSuccessMessage(''); // Clear the message when closed
  };

  return (
    <div className="feedback-container__feedback__main__edusify">
      <h1 className="feedback-title__feedback__main__edusify">Send Feedback</h1>
      <form onSubmit={handleSubmit} className="feedback-form__feedback__main__edusify">
        <textarea
          placeholder="Your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="feedback-textarea__feedback__main__edusify"
          required
        />
        <button type="submit" className="submit-button__feedback__main__edusify" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
      {successMessage && <SuccessMessage message={successMessage} onClose={handleCloseMessage} />}
    </div>
  );
};

export default FeedbackForm;

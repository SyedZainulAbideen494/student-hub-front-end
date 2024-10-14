import React, { useState } from 'react';
import axios from 'axios';
import SuccessModal from '../app_modules/SuccessModal';
import './QuestionCard.css';
import { FaImage } from 'react-icons/fa';
import { API_ROUTES } from '../app_modules/apiRoutes';

const QuestionCard = ({ onQuestionSubmit }) => {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage); // Allow only one image
    }
  };

  const handleRemoveImage = () => {
    setImage(null); // Remove the selected image
  };

  const handleSubmit = async () => {
    // Show error if the question is empty
    if (!question) {
      setMessage('Please enter a question before submitting.');
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('question', question);
      if (image) formData.append('image', image);
      formData.append('token', token);

      const response = await axios.post(API_ROUTES.addEduscribe, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Eduscribe submitted successfully!');
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
      }, 3000);

      if (typeof onQuestionSubmit === 'function') {
        onQuestionSubmit(question);
      }
      setQuestion('');
      setImage(null);
    } catch (error) {
      setMessage('Error submitting Eduscribe, please try again.');
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
      }, 3000);

      console.error('Error submitting question:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="question-card">
      <textarea
        placeholder="Write a question, share your thoughts, or ask for help..."
        value={question}
        onChange={handleQuestionChange}
        className="question-input"
      />

      <div className="question-actions">
        <label className="upload-icon-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-input"
            style={{ display: 'none' }}
          />
          <span className="upload-icon">
            <FaImage />
          </span>
        </label>
        <button
          className="send-button"
          onClick={handleSubmit}
          disabled={!question} // Only disable if question is empty
        >
          Send
        </button>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="image-preview__flashcard__add__images">
          <h3>Selected Image:</h3>
          <div className="image-preview-container__flashcard__add__images">
            <div className="image-thumbnail__flashcard__add__images">
              <img
                src={URL.createObjectURL(image)}
                alt="Selected image preview"
              />
              <button
                className="remove-image-button"
                onClick={handleRemoveImage}
                type="button"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal visible={modalVisible} message={message} />
    </div>
  );
};

export default QuestionCard;

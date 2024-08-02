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
    setImage(e.target.files[0]); // Save the file object
  };

  const handleSubmit = async () => {
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
  
      // Hide the modal after 3 seconds
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
  
      if (typeof onQuestionSubmit === 'function') {
        onQuestionSubmit(question);
      }
      setQuestion('');
      setImage(null);
    } catch (error) {
      setMessage('Eduscribe submitted successfully!');
      setModalVisible(true);
  
      // Hide the modal after 3 seconds
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
  
      console.error('Error submitting question:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="question-card-social-media">
      <input
        type="text"
        placeholder="Share your question..."
        value={question}
        onChange={handleQuestionChange}
        className="question-input-social-media"
      />
      <div className="question-actions-social-media">
        <label className="upload-icon-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-input"
            style={{display: 'none'}}
          />
          <span className="upload-icon"><FaImage/></span>
        </label>
        <button className="send-button-social-media" onClick={handleSubmit}>Send</button>
      </div>
      <SuccessModal visible={modalVisible} message={message} />
    </div>
  );
};

export default QuestionCard;
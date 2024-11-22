import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "../app_modules/SuccessModal";
import { FaImage, FaSpinner } from "react-icons/fa";
import { API_ROUTES } from "../app_modules/apiRoutes";
import "./QuestionCard.css";

const QuestionCard = ({ onQuestionSubmit }) => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    if (selectedImage) {
      if (!validTypes.includes(selectedImage.type)) {
        setMessage("Invalid file type. Only JPG, PNG, and GIF are allowed.");
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
        return;
      }
      if (selectedImage.size > 5 * 1024 * 1024) {
        setMessage("File size exceeds 5MB. Please upload a smaller image.");
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
        return;
      }
      setImage(selectedImage); // Allow only valid image
    }
  };

  const handleRemoveImage = () => setImage(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setMessage("Please enter a question before submitting.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("question", question);
      if (image) formData.append("image", image);
      formData.append("token", token);

      const response = await axios.post(API_ROUTES.addEduscribe, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Eduscribe submitted successfully!");
      setModalVisible(true);
      setQuestion("");
      setImage(null);

      if (typeof onQuestionSubmit === "function") {
        onQuestionSubmit(question);
      }
    } catch (error) {
      setMessage("Error submitting Eduscribe, please try again.");
      setModalVisible(true);
    } finally {
      setLoading(false);
      setTimeout(() => setModalVisible(false), 3000);
    }
  };

  return (
    <div className="question-card">
      <textarea
        placeholder="Write a question, share your thoughts, or ask for help..."
        value={question}
        onChange={handleQuestionChange}
        className="question-input"
        aria-label="Enter your question"
      />

      <div className="question-actions">
        <label className="upload-icon-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-input"
            aria-label="Upload an image"
          />
          <span className="upload-icon">
            <FaImage />
          </span>
        </label>
        <button
          className="send-button"
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          aria-label="Submit question"
        >
          {loading ? <FaSpinner className="spinner" /> : "Upload"}
        </button>
      </div>

      {image && (
        <div className="image-preview">
          <div className="image-container">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview of the selected file"
              className="preview-img"
            />
            <button
              onClick={handleRemoveImage}
              className="remove-image-button"
              aria-label="Remove selected image"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <SuccessModal visible={modalVisible} message={message} />
    </div>
  );
};

export default QuestionCard;

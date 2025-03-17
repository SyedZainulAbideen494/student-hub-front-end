import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaImage } from "react-icons/fa"; // Icons for buttons
import "./AiSelectionPage.css"; // Import the CSS

const AiSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="ai-selection-container-ai-selection-page">
      <h1 className="ai-title-ai-selection-page">Choose Your AI</h1>
      <div className="ai-buttons-ai-selection-page">
        <button className="ai-btn-ai-selection-page" onClick={() => navigate("/ai")}>
          <FaRobot className="ai-icon-ai-selection-page" />
          AI Chatbot
        </button>
        <button className="ai-btn-ai-selection-page" onClick={() => navigate("/ai/image")}>
          <FaImage className="ai-icon-ai-selection-page" />
          AI Image Generator
        </button>
      </div>
    </div>
  );
};

export default AiSelectionPage;

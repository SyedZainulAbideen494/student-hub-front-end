import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaPencilAlt, FaLayerGroup, FaRegLightbulb } from "react-icons/fa"; 
import { MdBrush, MdQuiz } from "react-icons/md"; 
import "./AiSelectionPage.css"; 

const AiSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="copo__container__ai__selection">
      <h1 className="copo__title__ai__selection">Choose Your AI</h1>

      {/* SVG Floating Animation */}
      <div className="copo__floating__svg">
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="3" fill="none" />
          <circle cx="60" cy="60" r="40" fill="rgba(0, 0, 0, 0.05)" />
        </svg>
      </div>

      <div className="copo__buttons__ai__selection">
        <button className="copo__btn__ai__selection copo__btn__chat" onClick={() => navigate("/ai")}>
          <FaBrain className="copo__icon__ai__selection" />
          AI Chatbot
        </button>

        <button className="copo__btn__ai__selection copo__btn__image" onClick={() => navigate("/ai/image")}>
          <MdBrush className="copo__icon__ai__selection" />
          AI Image Generator
        </button>

      </div>
    </div>
  );
};

export default AiSelectionPage;

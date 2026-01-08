import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookReader, FaBrain, FaMap, FaUserGraduate, FaLock,
  FaMicrophone
} from "react-icons/fa";
import {
  MdBrush, MdQuiz, MdNotes, MdOutlineAssignment, MdArrowBack
} from "react-icons/md";
import "./AiSelectionPage.css";
import { API_ROUTES } from "../app_modules/apiRoutes";
import axios from "axios";

const AiSelectionPage = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [isPremium, setIsPremium] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(API_ROUTES.checkSubscription, {}, {
          headers: { Authorization: token }
        })
        .then((response) => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

const aiOptions = [
  { icon: <FaBrain />, text: "AI Chatbot", path: "/ai", locked: false },
  { icon: <MdNotes />, text: "AI Notes", path: "/notes/create/ai", locked: true },
  { icon: <MdQuiz />, text: "AI Quizzes", path: "/quiz/ai", locked: false },
  { icon: <FaMap />, text: "AI Mind Maps", path: "/mindmap/create", locked: true },
  { icon: <MdOutlineAssignment />, text: "AI Assignment Maker", path: "/assignment-maker", locked: true },
  { icon: <FaBookReader />, text: "AI Exam Mode", path: "/exam-mode", locked: true },
];


  const handleNavigation = (item) => {
    if (item.locked && !isPremium) {
      navigate("/subscription");
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="copo__container__ai__selection">
      <button className="copo__back__btn" onClick={() => navigate("/")}>
        <MdArrowBack className="copo__back__icon" />
      </button>

      <h1 className="copo__title__ai__selection">Choose Your AI</h1>

      <div className="copo__floating__svg">
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="3" fill="none" />
          <circle cx="60" cy="60" r="40" fill="rgba(0, 0, 0, 0.05)" />
        </svg>
      </div>

      <div className="copo__buttons__ai__selection">
        {aiOptions.map((item, index) => (
          <button
            key={index}
            className={`copo__btn__ai__selection ${item.locked && !isPremium ? 'locked' : ''}`}
            onClick={() => handleNavigation(item)}
            style={{
              animation: animate ? `copo__fade__in 0.5s ease-out ${index * 0.1}s forwards` : "none"
            }}
          >
            <div className="copo__btn__content">
              {item.icon}
              {item.text}
              {item.locked && !isPremium && (
                <FaLock className="copo__lock__icon" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiSelectionPage;

import React, { useEffect, useState } from 'react';
import './PremiumTeasePopup.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';

const popupData = [
  {
    title: "🚨 Exam Mode: Built for War. Locked for You.",
    body: "One tap → Get Smart Notes, Predicted Questions, Formulas, and Flashcards for any chapter. Toppers already use this as their secret weapon. Still going manual?",
  },
  {
    title: "🏁 Real Exam Pressure. Real Results. Not for Free.",
    body: "Timer-based mock tests crafted for NEET, JEE, Boards, CLAT & more. Feel the heat before the real day. Only serious students unlock this — ₹299/month.",
  },
  {
    title: "⚡ Swipe. Recall. Repeat. Not Available for Free.",
    body: "Top scorers use this daily for lightning-fast revision. You get AI-crafted flashcards for your chapters — smart and aesthetic. Still stuck rereading pages?",
  },
  {
    title: "📚 One Line → Notes Done.",
    body: "Type any topic. Get AI-generated notes that feel like a topper wrote them. Fast, clean, effective — and locked till you go Premium.",
  },
  {
    title: "🧠 Turn PDFs into Power Notes",
    body: "Upload. Chill. Get smart notes with diagrams, summaries & highlights from any PDF. Still manually reading? That’s cute. ₹299/month unlocks this beast.",
  },
  {
    title: "🧠 One Topic → One Brain Map",
    body: "Complex chapters simplified into clean, visual mindmaps. If you think in visuals, this is your superpower — locked till you upgrade.",
  },
  {
    title: "📄 Assignments? Auto Done.",
    body: "Generate full-length answers, references, structure, and formatting — all within seconds. Others are typing. You’ll be done. Premium unlocks your time back.",
  },
  {
    title: "📊 AI Reports That Look Human-Made",
    body: "Craft clean, formal, well-structured reports in minutes. Lab reports, school projects, you name it. Free users can’t touch this.",
  }
];

const PremiumTeasePopup = ({ isOpen, onClose, onUpgrade }) => {
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const random = popupData[Math.floor(Math.random() * popupData.length)];
    setPopup(random);
  }, []);

  const [isPremium, setIsPremium] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);
  
  // Do not show popup if user is already premium
  if (!isOpen || isPremium || !popup) return null;

  return (
    <div className="overlay__noti__popup__Modal__premuium__tease__free">
      <div className="container__noti__popup__Modal__premuium__tease__free">
        <div className="badge__noti__popup__Modal__premuium__tease__free">Premium</div>
        <h2 className="title__noti__popup__Modal__premuium__tease__free">{popup.title}</h2>
        <p className="body__noti__popup__Modal__premuium__tease__free">{popup.body}</p>
        <div className="buttons__noti__popup__Modal__premuium__tease__free">
          <button className="unlockBtn__noti__popup__Modal__premuium__tease__free" onClick={onUpgrade}>
            Unlock Now – ₹299/month
          </button>
          <button className="laterBtn__noti__popup__Modal__premuium__tease__free" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumTeasePopup;

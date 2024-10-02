import React, { useEffect, useState } from "react";
import './TipBox.css';

const TipBox = () => {
  const tips = [
    "On the search page, search for your friends by their username and follow them to see their flashcards, quizzes, and eduscribes.",
    "Download flashcards as PDF to access them offline and any time.",
    "Wanna share your flashcards/notes/quizzes with your friends all at once? Create discussion groups and share your notes or quizzes there.",
    "View all the results of your quiz attendees by clicking 'View Results'.",
    "You've got free premium!",
    "Invite your friends to Edusify to create groups, share flashcards, notes, quizzes, etc."
  ];

  const [shuffledTips, setShuffledTips] = useState([]);
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Function to shuffle the tips array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const lastShownTime = localStorage.getItem('lastTipShown');
    const currentTime = Date.now();

    // Check if the tip box was shown within the last 3 hours (10800000 milliseconds)
    if (!lastShownTime || (currentTime - lastShownTime) >= 3 * 60 * 60 * 1000) {
      setIsVisible(true);
      localStorage.setItem('lastTipShown', currentTime); // Update last shown time
      
      // Shuffle tips and set initial tip index
      const shuffled = shuffleArray(tips);
      setShuffledTips(shuffled);
      setTipIndex(0);
    }

    // Change tip every 3 hours
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % shuffledTips.length);
    }, 3 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleGotIt = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 500); // Close after 2 seconds
  };

  if (!isVisible) return null;

  return (
    <div className="tip-box">
      <div className="tip-arrow"></div>
      <div className="tip-content">
        <h3 className="tip-heading">Tip</h3>
        <p>{shuffledTips[tipIndex]}</p>
        <button className="close-btn" onClick={handleClose}>X</button>
        <button className="got-it__btn__tip__box" onClick={handleGotIt}>Got it</button>
      </div>
    </div>
  );
};

export default TipBox;

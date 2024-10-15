import React, { useEffect, useState } from "react";
import './TipBox.css';

const TipBox = () => {
  const tips = [
    "Stay organized by categorizing your notes by subjects in the Notes section.",
    "Use the Planner to set task priorities and get email reminders before deadlines.",
    "AI in Edusify can help answer your study questions – save them directly as notes!",
    "Add events to the Calendar and get reminders 3 days before important dates.",
    "Follow your friends to view their public notes, quizzes, and Edusicribes.",
    "The Pomodoro Timer can boost your focus – track your stats and share them!",
    "Generate flashcards with AI or manually and swipe to track your progress.",
    "Customizable notes allow you to add links, images, and videos for deeper learning.",
    "Use the social feed to share your thoughts and stay motivated with others.",
    "Use the search feature to find and follow friends easily on Edusify.",
    "Check the leaderboard to see who’s the most active and challenge yourself!",
    "Set task due dates and receive automatic email reminders to stay ahead of deadlines.",
    "Save time by using AI-generated notes and flashcards for quick studying.",
    "Create quizzes and share them with friends to test each other’s knowledge.",
    "Stay accountable by joining groups to share notes, quizzes, and collaborate.",
    "Swipe through flashcards to mark what you know and don’t know, improving retention.",
    "Download your notes as PDF files for offline study sessions.",
    "Create custom tasks and events to stay on top of all your assignments.",
    "Regularly review your dashboard for a quick overview of your day’s tasks and events.",
    "Stay consistent with the Pomodoro timer to improve productivity and focus."
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
    const nextReviewTime = localStorage.getItem('nextReviewTime');
    const currentTime = Date.now();

    // Show the tip box regardless of feedbackSubmitted and nextReviewTime presence
    if (lastShownTime) {
        // Check if the tip box was shown within the last 3 hours (10800000 milliseconds)
        if (currentTime - lastShownTime >= 3 * 60 * 60 * 1000) {
            setIsVisible(true);
            localStorage.setItem('lastTipShown', currentTime); // Update last shown time

            // Shuffle tips and set initial tip index
            const shuffled = shuffleArray(tips);
            setShuffledTips(shuffled);
            setTipIndex(0);
        }
    } else {
        // If lastShownTime is not present, show the tip box for the first time
        setIsVisible(true);
        localStorage.setItem('lastTipShown', currentTime); // Set initial last shown time

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
}, [tips]);

  


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

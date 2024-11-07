import React, { useEffect, useState } from "react";
import './TipBox.css';

const TipBox = () => {
  const tips = [
    "Organize your notes by subjects.",
    "Use Edusify’s AI assistant to answer questions and save them directly to your notes!",
    "Get reminders three days before important dates by adding events to your Calendar.",
    "Follow friends to view their public notes, quizzes, and activity in your social feed.",
    "Boost focus with the Pomodoro Timer and review your productivity stats each week.",
    "Create flashcards with AI or manually, and swipe to mark what you know and what needs review.",
    "Personalize sticky notes on your dashboard with custom colors and font styles.",
    "Challenge yourself with the leaderboard – see how you compare with others in productivity!",
    "Save time by using AI-generated notes, flashcards, and quizzes for efficient study sessions.",
    "Create and share quizzes with friends – test each other’s knowledge and have fun learning.",
    "Download notes as PDFs to study offline anytime, anywhere.",
    "Track your learning streaks and see your progress grow day by day.",
    "Review your dashboard regularly to stay on top of today’s tasks, events, and goals.",
    "Log in each day to keep your learning streak alive and build consistent study habits.",
    "Access monthly and weekly reports to see your progress and areas to improve.",
    "Add tasks, and easily manage all your assignments in one place.",
    "Use the new sticky notes feature to jot down quick reminders and to-do’s on your dashboard.",
    "Get inspired by new updates and tips in your weekly progress report on Edusify."
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

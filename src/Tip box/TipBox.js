import React, { useEffect, useState } from "react";
import './TipBox.css';

const TipBox = () => {
  const tips = [
    "On the search page, search for your friends by their username and follow them to see their flashcards, quizzes, and eduscribes.",
    "Download flashcards as PDF to access them offline and any time.",
    "Wanna share your flashcards/notes/quizzes with your friends all at once? Create discussion groups and share your notes or quizzes there.",
    "View all the results of your quiz attendees by clicking 'View Results'.",
    "You've got free premium!",
    "Invite your friends to Edusify to create groups, share flashcards, notes, quizzes, etc.",
    "Create AI-generated notes from your study material to save time and get organized quickly.",
    "Ask the AI to help solve science, commerce, and math problems instantly with step-by-step explanations.",
    "AI can suggest a study break schedule to maintain your productivity throughout the day.",
    "Generate and customize flashcards automatically with AI to prepare for exams faster.",
    "Use AI to create personalized revision schedules leading up to your exams.",
    "Collaborate in study groups by sharing AI-generated notes and quizzes with others.",
    "The AI can help you find the best resources to tackle difficult subjects or assignments.",
    "Get a complete breakdown of any topic by asking the AI for detailed explanations or summaries.",
    "AI can help you set goals for the day and prioritize tasks in your to-do list.",
    "Easily adapt your study plan with AI recommendations based on your progress and upcoming deadlines.",
    "Get daily email reminders about your tasks and events at 7 AM, 3 PM, and 9 PM IST if a task or event deadline is 3 days away, so you're always prepared.",
    "AI can generate personalized study timetables based on your subjects and deadlines.",
    "Easily organize your day with tasks, deadlines, and study sessions tracked in the app.",
    "Stay productive with a built-in Pomodoro timer to track study sessions and breaks.",
    "On the planner and calendar pages, click on a date to see the events and tasks scheduled for that date."
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
    const feedbackSubmitted = localStorage.getItem('feedbackSubmitted') === 'true'; // Convert to boolean
    const nextReviewTime = localStorage.getItem('nextReviewTime');
    const currentTime = Date.now();

    // Check if feedback has been submitted and the next review time is in the future
    if (feedbackSubmitted && (!nextReviewTime || currentTime >= nextReviewTime)) {
      // Check if the tip box was shown within the last 3 hours (10800000 milliseconds)
      if (!lastShownTime || (currentTime - lastShownTime) >= 3 * 60 * 60 * 1000) {
        setIsVisible(true);
        localStorage.setItem('lastTipShown', currentTime); // Update last shown time

        // Shuffle tips and set initial tip index
        const shuffled = shuffleArray(tips);
        setShuffledTips(shuffled);
        setTipIndex(0);
      }
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

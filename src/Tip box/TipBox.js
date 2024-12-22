import React, { useEffect, useState } from "react";
import './TipBox.css'; // Ensure the CSS styles are still appropriate
import { useNavigate } from 'react-router-dom';  // For navigation
import { API_ROUTES } from "../app_modules/apiRoutes";

const TipBox = () => {
  const [tipContent, setTipContent] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [tipType, setTipType] = useState(""); // State to manage tip type (e.g., peer, quick task)
  const [streakCount, setStreakCount] = useState(0);
  const navigate = useNavigate(); // React Router's navigate for navigation

  // Store the tips for each category
  const tips = {
    peerComparison: [
      "Today, 85% of Edusify users are on top of their game, while the other 15% are probably arguing with their alarm clocks.",
      "The top students today are already 3 tasks ahead. Meanwhile, you’re deciding whether your brain needs a nap or a coffee.",
      "Did you know? Some students crush tasks before breakfast. The rest of us? We’re still figuring out how to make it through the morning.",
      "Almost 90% of users are crushing it today. It’s not too late to start—jump in and end the day feeling unstoppable!",
      "Top users have already knocked out 5 tasks. What’s your excuse? Still snoozing or scrolling?",
      "Some users seem to have mastered productivity. But hey, even small steps are progress. Start now, and you’ll catch up!",
      "Procrastinators are just perfectionists trying to avoid failure. But remember—done is better than perfect. Start small!",
      "Think you’re too busy? Someone else is getting work done *and* making time for a quick game. No more excuses!"
    ],
    quickTask: [
      "Got 5 minutes to spare? That tiny task on your to-do list won’t tackle itself. Go for it—your future self will thank you!",
      "Short breaks = small wins. Organize a note or go through a flashcard. It’s like a productivity power-up.",
      "That tiny task you keep ignoring? It’s time to crush it. You’ll feel great ticking it off!",
      "Feeling sluggish? A quick 5-minute push can turn you into a productivity powerhouse. Take that task down!",
      "Your notes need love too. Spend 5 minutes updating them, and you’ll see that knowledge blossom.",
      "Tiny tasks are like quick wins: easy, satisfying, and rewarding. Tackle one now and enjoy a treat afterward.",
      "Even superheroes need a starting point. Finish a small task, and you’re on your way to academic greatness.",
      "Think you’re distracted? Focus on just one flashcard first. Get started, and the rest will follow!"
    ],
    interactiveTip: [
      "Need help? The AI Assistant is your personal study genius. It’s like having a tutor on call while you sip your coffee.",
      "Procrastinating? Let the AI Assistant do the hard work. It's your tireless, super-smart study buddy.",
      "Stuck on a topic? The AI Assistant has your back. Ask it for notes, plans, or even study tricks.",
      "Late-night study grind? The AI Assistant is your 24/7 support—no sleep, no judgment, just results.",
      "Why spend hours making notes when the AI Assistant can do it in seconds? Try it, and get ahead effortlessly!"
    ],
    featureDiscovery: [
      "Did you know? The Document Locker is your personal vault for important files. Secure, easy-to-use, and always there when you need it.",
      "Feeling disorganized? Let the Calendar come to the rescue. Add dates, stay on track, and feel like a productivity pro.",
      "The Pomodoro Timer: Work for 25 minutes, then take a break. It’s the perfect system for boosting focus and preventing burnout.",
      "New Feature Alert: Keep your important files safe with the Document Locker—like a digital safe for your notes.",
      "The Pomodoro Timer isn’t just a tool; it’s your secret weapon for productivity. Focus, break, repeat, and win!"
    ],
    additionalFunTips: [
      "Need a study buddy who doesn’t steal the spotlight? The AI Assistant is always there to help, no drama.",
      "Feeling stressed about exams? Let the AI Assistant guide you while you snack your way through the anxiety.",
      "Pomodoro hack: Focus like a machine for 25 minutes, then relax like a king for 5. Work hard, break harder.",
      "Feeling overwhelmed? Pomodoro breaks are like mini-vacations for your brain. Take one—you deserve it!",
      "Not feeling it? Remember: even a 10-minute study burst can make a huge difference. You’ve got this!",
      "Fun fact: The AI Assistant can save you hours. Use it wisely, and you’ll even have time to nap afterward!"
    ],
    founderTips: [
      // Add your own tips here based on your experiences or personal insights!
    ]
  };
  
  
  

  useEffect(() => {
    const lastShownTime = localStorage.getItem('lastTipShown');
    const currentTime = new Date().getTime();
    
    if (!lastShownTime || currentTime - lastShownTime >= 600000) { // 10 minutes = 600000 ms
      setTimeout(() => {
        setIsVisible(true);
        generateTip();
        localStorage.setItem('lastTipShown', currentTime);
      }, 500); // 2-second delay before showing the modal
    }
  
    const interval = setInterval(() => {
      const lastShownTime = localStorage.getItem('lastTipShown');
      const currentTime = new Date().getTime();
  
      if (currentTime - lastShownTime >= 1800000) { // 10 minutes
        setTimeout(() => {
          setIsVisible(true);
          generateTip();
          localStorage.setItem('lastTipShown', currentTime);
        }, 500); // 2-second delay before showing the modal
      }
    }, 1800000); // Check every 10 minutes
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  
  
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let round = 0; round < Math.floor(Math.random() * 3) + 1; round++) {
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
    }
    return shuffledArray;
  };

  const generateTip = () => {
    const availableTipTypes = Object.keys(tips);
    
    if (availableTipTypes.length === 0) return; // No tips available, stop showing
    
    const recentlyShownTips = JSON.parse(localStorage.getItem('recentlyShownTips')) || [];
    
    let selectedTipType;
    let selectedTipList;
    let shuffledTips;
    let selectedTip;
  
    // First, give 70% chance for 'founderTips' and 30% for other tip types
    const tipChance = Math.random();
    
    if (tipChance <= 0.7) {
      // 70% chance: Select 'founderTips'
      selectedTipType = 'founderTips';
    } else {
      // 30% chance: Select a random tip type from the other categories
      const shuffledTipTypes = shuffleArray(availableTipTypes.filter(type => type !== 'founderTips'));
      selectedTipType = shuffledTipTypes[Math.floor(Math.random() * shuffledTipTypes.length)];
    }
  
    selectedTipList = tips[selectedTipType];
    shuffledTips = shuffleArray(selectedTipList);
  
    selectedTip = shuffledTips.find(tip => !recentlyShownTips.includes(tip));
  
    if (!selectedTip) {
      recentlyShownTips.length = 0;
      selectedTipType = 'founderTips';
      selectedTipList = tips[selectedTipType];
      shuffledTips = shuffleArray(selectedTipList);
      selectedTip = shuffledTips[0];
    }
  
    setTipType(selectedTipType);
    setTipContent(selectedTip);
  
    recentlyShownTips.unshift(selectedTip);
    if (recentlyShownTips.length > 30) recentlyShownTips.pop();
    localStorage.setItem('recentlyShownTips', JSON.stringify(recentlyShownTips));
  };
  
  
  const handleClose = () => {
    setIsVisible(false);
  };

  const handleGotIt = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 500); // Close after 0.5 seconds
  };

  const handleButtonClick = () => {
    if (tipType === 'founderTips') {
      window.location.href = "https://www.instagram.com/_syed_zain_ul/";  // Redirect to your Instagram page
    } else if (tipType === 'interactiveTip') {
      navigate('/ai');
    } else if (tipType === 'quickTask') {
      navigate('/planner');
    } else if (tipType === 'peerComparison') {
      navigate('/leaderboard');
    } else if (tipType === 'featureDiscovery') {
      if (tipContent.toLowerCase().includes("pomodoro")) {
        navigate('/pomodoro');
      } else if (tipContent.toLowerCase().includes("calendar")) {
        navigate('/calendar');
      } else if (tipContent.toLowerCase().includes("document locker")) {
        navigate('/document-locker');
      } else {
        navigate('/feature-discovery');
      }
    } else if (tipType === 'additionalFunTips') {
      navigate('/');
    }
  };
  

  if (!isVisible || !tipContent) return null;

  return (
    <div className="tip-box">
      <div className="tip-content">
        <div className="tip-message">
          {tipContent}
        </div>
        <button className="got-it__btn__tip__box" onClick={handleGotIt}>
          Got it
        </button>
        <button className="action-btn__tip__box" onClick={handleButtonClick}>
          {tipType === 'founderTips' ? 'Follow me on Instagram' : 'Explore'}
        </button>
      </div>
    </div>
  );
};

export default TipBox;

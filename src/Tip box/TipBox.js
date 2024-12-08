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
      "85% of Edusify users finished tasks today! The other 15%? Probably in a ‘meeting’ with their pillows.",
      "The top students today are already 3 tasks ahead. Meanwhile, you’re still deciding if it’s a tea day or a coffee day.",
      "Fun Fact: Productivity robots disguised as students finish tasks before breakfast. Humans like us? We need two cups of coffee first.",
      "Almost 90% of users crushed it today. Don’t worry if you’re late to the party. Start now, and end the day with a mic drop!",
      "Top users already completed 5 tasks. What about you? Still negotiating with your alarm clock?",
      "Some users are task-destroying machines. But hey, slow and steady can still beat procrastination. Start small!",
      "Procrastinators are simply perfectionists in disguise. But remember, done is better than perfect. Get cracking!",
      "Think you’re busy? Someone out there is nailing tasks *and* beating their high score in Candy Crush. No excuses now!"
    ],
    quickTask: [
      "Got 5 minutes? Knock out that tiny task lurking in the corner of your to-do list. Future You will thank you!",
      "Short breaks = small wins. Use this one to organize a note or review one flashcard. Boom, instant productivity!",
      "That annoying little task? It’s begging to be done. Do it now, and bask in the glory of ticking it off.",
      "Feeling meh? A 5-minute burst of effort can turn you into a productivity ninja. Chop that task!",
      "Your notes are like plants—they need regular care. Spend 5 minutes tending them, and watch your knowledge grow.",
      "Tiny tasks are like snacks: easy to handle and surprisingly satisfying. Tackle one now and reward yourself with a cookie.",
      "Even superheroes start small. Complete a quick task, and you’re one step closer to saving the (academic) world.",
      "Think you can’t focus? Start with one flashcard. Just one. Then watch yourself magically tackle three more!"
    ],
    interactiveTip: [
      "The AI Assistant is your personal genius-on-call. While it works, you can sip your coffee and nod wisely.",
      "Procrastinating? Let the AI Assistant handle the heavy lifting. It’s like having a super-smart study buddy who never complains.",
      "Stuck? The AI Assistant has your back. Just ask, and it’ll whip up notes, plans, or even genius-level excuses.",
      "Late-night study sesh? The AI Assistant doesn’t sleep, judge, or steal your snacks. Use it and feel like a pro.",
      "Why struggle with notes when AI can do it faster than you can scroll through Instagram? Try it—you’ll love it!"
    ],
    featureDiscovery: [
      "Did you know? The Document Locker is like Fort Knox for your files. Secure, stylish, and zero drama.",
      "Feeling disorganized? The Calendar’s here to save the day. Add your dates and pretend you’ve always had it together.",
      "Pomodoro Timer: Work hard for 25 minutes, then break like a champ. It’s productivity with built-in guilt-free breaks.",
      "New Feature Alert: Our Document Locker is the VIP lounge for your important files. Keep them safe and sound.",
      "The Pomodoro Timer isn’t just a tool—it’s a lifestyle. Use it, and you’ll look so productive even your cat will be impressed."
    ],
    additionalFunTips: [
      "Looking for a study buddy who doesn’t hog the spotlight? The AI Assistant is here and always in a good mood.",
      "Exam stress? Let the AI Assistant take the wheel while you stress-eat snacks like a pro.",
      "Pomodoro hack: Focus like a laser for 25 minutes, then relax like a potato for 5. It’s the perfect balance.",
      "Overwhelmed? Pomodoro breaks = mini vacations for your brain. Take one. Your neurons will cheer!",
      "Feel like giving up? Just remember: Even a 10-minute study session can turn chaos into clarity. You got this!",
      "Fun Fact: The AI Assistant can save hours of your life. Use it wisely, and maybe even take a nap afterward!"
    ],
    founderTips: [
    
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

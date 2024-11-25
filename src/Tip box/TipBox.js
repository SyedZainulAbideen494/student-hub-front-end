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
      "85% of Edusify users finished their tasks today... the rest are probably watching Netflix! Be one of the 85%.",
      "Top performers are ahead by 2 tasks today. Can you catch up, or are you too busy wondering what's for lunch?",
      "Pro Tip: Best students finish tasks before lunch. The rest of us finish after the third cup of coffee. Which team are you on?",
      "Almost 90% of Edusify users are on track today. Don’t get left behind—catch up one task at a time!",
      "Top students are already crushing it with 3 tasks done before noon. You still figuring out if cereal is breakfast or lunch?",
      "Some people are already 5 tasks ahead, but don’t worry—you’ve got this. Small steps lead to big wins.",
      "Did you know? Top performers finish their work in record time. Start small, but make it count!",
      "Pro Tip: Finish your tasks before your friends even realize you’re doing work. Be the stealth ninja of productivity!"
    ],
    quickTask: [
      "Got 15 minutes? Revise a topic or organize your notes—it’s a quick win for your study goals.",
      "Short break? Review a topic or tackle a small task. It’s like a mini confidence boost for the day.",
      "Short on time? Organize your notes in a few clicks. It’s like tidying your mind without cleaning your room.",
      "You know that task you’ve been ignoring? It’ll take 5 minutes. Start now, and feel the relief.",
      "Can’t focus? Try organizing your notes! It’s a simple way to reset your mind and get productive.",
      "Quick task? Do it now, or let it haunt you later. Future you will thank you for the effort!",
      "No time to study? Well, you’ve got 10 minutes—that’s enough to review a topic or write a quick flashcard.",
      "Pro Tip: Use small breaks to handle tiny tasks. They add up to big progress!"
    ],
    interactiveTip: [
      "Feeling stuck? Let the AI Assistant handle your notes while you sip coffee. ☕️",
      "AI Assistant: Your personal study buddy that never takes a day off. Try it out for instant notes!",
      "Procrastinating? The AI Assistant is here to get you back on track. Just give it a topic, and watch the magic.",
      "Think of the AI Assistant as your study partner—only faster, smarter, and available 24/7.",
      "Writing notes just got easier. The AI Assistant does the hard work so you can focus on learning."
    ],
    featureDiscovery: [
      "New Feature Alert: Keep your documents safe in our Document Locker. Your notes are too valuable to lose!",
      "Pomodoro Timer: 25 minutes of work, followed by a 5-minute break. Focus hard, then relax like a pro. 🌴",
      "Need to keep track of important dates? Use the Calendar feature. It’s like having a planner that never forgets!",
      "Discover the Pomodoro Timer—25 minutes of pure focus, followed by a 5-minute guilt-free break.",
      "Document Locker: Because losing notes is not an option. Store and secure your files hassle-free."
    ],
    additionalFunTips: [
      "Need a study buddy? The AI Assistant is here to help, minus the awkward small talk. 😊",
      "Stressed about exams? Use the AI Assistant to generate notes—it’s like having a secret weapon for studying.",
      "Pomodoro hack: Work for 25 minutes, then take a short break. Or imagine you’re on a beach—it’s practically the same.",
      "Feeling overwhelmed? Break your study time into Pomodoro sessions. It’s like mini-vacations for your brain!",
      "Pro Tip: Let the AI Assistant handle the hard parts, so you can focus on acing your exams."
    ],
    founderTips: [
      "Building Edusify was tough, but hearing from users makes it all worth it. DM me if it’s helping you out! 🌟📩",
      "Want to know what it’s like to run a $3M app while still in college? DM me, and let’s chat about balancing dreams and studies. 😊📱",
      "Sometimes, I open my DMs just to connect with users. Got feedback or a cool story? Let me know—it’ll make my day! 🚀💬",
      "Fun fact: I built Edusify in just 2 weeks while teaching myself to code. DM me if you’re curious about the journey! 💻✨",
    "I built Edusify for fun, to be honest, and uploaded stories to impress my crush... now it's valued at $3 million! 😂 #DreamBig",
      "They say quiet students can’t do big things—I’d like to disagree. DM me if you’ve got a story of proving people wrong. 🌟📩",
      "Once upon a time, my professors doubted me. Now Edusify has more users than my college has students. DM me if you believe in chasing dreams despite the odds. 🚀📊",
      "Balancing life and Edusify wasn’t easy, but it taught me a lot about persistence. DM me if you need a pep talk from someone who’s been there. 💬✨",
      "Want to connect with someone who turned challenges into success? My DMs are open. Let’s share wins and stories! 🙌📩",
      "Dream big, even if no one believes in you. That’s how Edusify started. DM me if you’re chasing something incredible. 🚀✨",
      "Here’s a secret: My Parents believed in me when others didn’t. Family support can be game-changing. DM me if you’ve got your own inspiring story! 💙📩"
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
  
      if (currentTime - lastShownTime >= 600000) { // 10 minutes
        setTimeout(() => {
          setIsVisible(true);
          generateTip();
          localStorage.setItem('lastTipShown', currentTime);
        }, 500); // 2-second delay before showing the modal
      }
    }, 600000); // Check every 10 minutes
  
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

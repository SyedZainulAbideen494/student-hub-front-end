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
      "85% of Edusify users crushed their tasks today! The rest? Let’s just say they’re ‘researching’ on Netflix. Don’t be them.",
      "Top performers are 2 tasks ahead today. Can you catch up, or are you still deciding between coffee or chai?",
      "Pro Tip: The early bird gets the worm... and finishes tasks before noon. The late bird? It’s still figuring out breakfast.",
      "Almost 90% of users are slaying their to-do lists today. Don’t worry if you’re not one of them yet. Start now and flex later!",
      "Top students have knocked out 3 tasks already! Meanwhile, you’re still in bed, debating if cereal counts as a meal.",
      "Some users are 5 tasks ahead—are they humans or productivity robots? Either way, small steps can still get you there.",
      "Fun Fact: Productivity ninjas on Edusify finish tasks *before* anyone notices they started. Try it and stay ahead of the game.",
      "Think you’re busy? Someone out there is juggling tasks *and* a Netflix binge. Get your tasks done, then binge guilt-free!"
    ],
    quickTask: [
      "Got 10 minutes? Knock out a quick revision or tidy your notes. It’s the adult version of leveling up.",
      "Short break? Tackle that small task you’ve been dodging. Future You will throw a party in your honor.",
      "Your notes called—they’re begging for some organization. Got 5 minutes? Make them sparkle!",
      "You know that annoying little task? It’s just 5 minutes of effort. Do it now and feel ridiculously accomplished.",
      "Feeling scatterbrained? A quick review of your notes = instant mental reset. No vacuuming required!",
      "Tiny tasks are like cookies—easy to finish, and they add up. Munch on one now!",
      "Think you don’t have time? Even 10 minutes can turn chaos into calm. Start with one flashcard, end with glory.",
      "Pro Tip: Use mini-breaks to tackle micro-tasks. It’s like sneaking in veggies with your fries."
    ],
    interactiveTip: [
      "Stuck? Let the AI Assistant do the hard work while you sip coffee and look intellectual. ☕",
      "The AI Assistant: Your 24/7 study buddy who never takes a coffee break. Try it and feel the magic.",
      "Procrastinating? Hand over the reins to the AI Assistant. It’s like hiring a genius for free!",
      "The AI Assistant doesn’t judge your late-night cramming. Just tell it what you need, and voilà!",
      "Why struggle with notes when the AI Assistant can whip them up faster than you can say ‘pomodoro’?"
    ],
    featureDiscovery: [
      "PSA: Our Document Locker is like a Swiss bank for your files—secure, sleek, and no annoying passwords (unless you want one).",
      "Feeling scattered? The Calendar’s got your back. Add your dates and pretend you’ve always been this organized.",
      "Discover the Pomodoro Timer: It’s 25 minutes of hardcore focus and 5 minutes of TikTok. Perfect balance.",
      "New Feature Alert: Secure your docs like they’re national treasures. The Document Locker is here to save the day!",
      "The Pomodoro Timer is like a productivity cheat code. Use it, then tell everyone you’re a life-hacking genius."
    ],
    additionalFunTips: [
      "Looking for a no-drama study buddy? The AI Assistant is always in a good mood and never steals your fries.",
      "Exam stress? Don’t panic—use the AI to whip up notes while you stress-eat cookies.",
      "Pomodoro hack: Work like you’re on fire for 25 minutes, then chill like a beach bum for 5. Repeat until awesome.",
      "Feeling overwhelmed? Pomodoro breaks = guilt-free brain vacations. Try it and thank us later.",
      "Let the AI Assistant handle the hard parts while you focus on the important stuff—like picking the perfect playlist."
    ],
    founderTips: [
      "They laughed when I said I’d build an app in 2 weeks. Now they’re using it. Believe in your crazy ideas. 🚀",
      "Fun fact: Edusify started as a ‘let’s see if I can do this’ moment. Now it’s worth $3M. Dream big, then make it happen.",
      "Balancing Edusify and college is wild, but nothing beats hearing your feedback. Got a story? DM me—I’d love to hear it. 🌟",
      "Professors doubted me, but now Edusify has more users than my college has students. Keep proving doubters wrong. 💪",
      "Secret motivation: My dad believed in me when no one else did. Find your people—they’ll keep you going when it’s tough.",
      "Pro Tip: Quiet kids make loud impacts. Trust me, I was that kid. Go chase your wildest dreams. 🌟",
      "Edusify was partly built to impress my crush... awkward. But now it’s inspiring thousands. Start wherever you are. ❤️",
      "Balancing life and Edusify wasn’t easy, but persistence wins. DM me if you’re chasing something huge—I’ve got your back. 🚀",
      "Once a professor told me to ‘focus on academics.’ Now Edusify is bigger than that advice. Keep going despite the odds. ✨",
      "Every big thing starts small. For me, it was a laptop, zero skills, and lots of coffee. DM me your story—I’d love to know!"
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

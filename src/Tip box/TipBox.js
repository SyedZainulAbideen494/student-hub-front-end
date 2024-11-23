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
      "Almost 90% of Edusify users are on track today... The other 10% are probably watching cat videos. Which side are you on?",
      "Top students are already crushing it with 3 tasks done before noon. You still figuring out if cereal is breakfast or lunch?",
      "Pro Tip: Finish your tasks before your friends even realize you’re doing work. Become the stealth ninja of productivity!",
      "Some people are already 5 tasks ahead. But don’t worry, you’ve got time... and possibly a snack.",
      "Did you know? Top performers finish their work in record time. The rest of us just finish it... eventually. 😅"
    ],
    quickTask: [
      "Got 15 minutes? Revise a topic or organize your notes—it's either that or scrolling through TikTok!",
      "Short break? Review a topic or tackle a small task, or just... stare into the void. Your call.",
      "Short on time? Organize your notes in a few clicks. Or nap... but organizing might help you pass that exam.",
      "Got 15 minutes? Quick task time! Or scroll through memes... but let’s be real, your task can wait 15 minutes more.",
      "You know that task you’ve been ignoring? It’ll take 5 minutes. Do it. Or let it haunt you for the next 5 hours.",
      "Can’t focus? Try organizing your notes! It’s like decluttering your brain without having to clean your room.",
      "Quick task? Do it now, or your future self will be judging you while you procrastinate with your phone.",
      "No time to study? Well, you’ve got 10 minutes... that’s enough to start something. Or take a power nap. Your call."
    ],
    interactiveTip: [
      "Pro Tip: Don’t feel like writing notes? Let the AI Assistant do it while you sip coffee. ☕️",
      "Feeling lazy? AI Assistant's got your back. Just sit back and let the magic happen.",
      "AI Assistant + topic details = Instant Notes. It’s like having superpowers. 🦸‍♂️",
      "AI Assistant: It’s like hiring a personal assistant, but one who doesn’t need coffee breaks.",
      "You’ve got the AI Assistant now. Writing notes just got 100x easier. So... why not?"
    ],
    featureDiscovery: [
      "New Feature Alert: Keep your documents safe in our Document Locker. Your notes are too valuable to lose!",
      "Pomodoro timer: 25 minutes of work, followed by a 5-minute break. It's like a mini vacation every half hour! 🌴",
      "New Calendar feature: Because writing dates on your hand *really* isn’t working anymore.",
      "Discover the Pomodoro timer—25 minutes of pure focus, then 5 minutes of your favorite distraction. 🌞",
      "Need to keep your documents safe? Use Document Locker. It's like a vault for your study notes (without the heavy doors)."
    ],
    additionalFunTips: [
      "Need a study buddy? Get the AI Assistant to help! It’s like having a robot friend who actually knows what they're doing.",
      "Feeling overwhelmed? Try Pomodoro! Work hard, then take a break like you’re on vacation. 🌞",
      "Stressed about exams? Use AI Assistant to generate notes. It’s like a cheat code, but for real life.",
      "Pomodoro hack: Study for 25 minutes, then take a 5-minute break. Or use that time to pretend you’re on a tropical beach.",
      "AI Assistant: Your personal robot friend, available 24/7, no awkward conversations required."
    ],
    founderTips: [
      "Think Edusify is cool? Imagine the guy who built it! Spoiler: It’s me, and yes, you can totally DM me to tell me how awesome it is. It’ll make my day! 😎📩",
      "Ever wanted to chat with a 17-year-old CEO who still can’t figure out how to make maggi in 2 minutes? Well, my DMs are open! 😂 #TalkToMe",
      "Feeling inspired by Edusify? Slide into my DMs and tell me how it’s helping you! Bonus points if you include memes. 🙌📥",
      "Building an app at 17 is hard, but hearing from you makes it all worth it. Shoot me a DM—whether it’s appreciation, feedback, or just a 'Hey, your app rocks!' 🌟✉️",
      "Need someone to tell you that you're doing great? DM me, and I’ll remind you how amazing you are. And maybe we’ll talk about my app too. 😜📬",
      "If you think I’m doing a good job as a 17-year-old CEO, let me know in my DMs. If not... just pretend I’m still learning. 😂🤷‍♂️",
      "Want to know what it’s like to run a $3M app while still in college? DM me, and we’ll chat about the struggles of juggling homework and business calls. 😅📱",
      "Procrastinating on homework? Same, but I built Edusify instead. DM me, and we can procrastinate together while talking about my app. 😜📩",
      "Sometimes, I open my DMs just to see if someone wants to talk about how cool my app is. Be that someone! 🙌✨",
      "Not every CEO invites you to chat, but hey, I’m not every CEO. Slide into my DMs if you’ve got questions, compliments, or just want to say hi! 😊📥",
      "Fun fact: Every DM I get about Edusify motivates me to keep going. So, what are you waiting for? Let’s talk! 🚀💬",
      "Some CEOs wait for feedback forms, but I’m more of a 'DM me and let’s vibe' kind of guy. Try it out—you won’t regret it! 😎📨",
      "Think your life is hectic? Try balancing Edusify and college. Want to chat about it? My DMs are open for appreciation or motivational talks. 😂✨",
      "Confession: Getting DMs about Edusify makes me happier than good marks on a test. So, drop me one! 🌟📬",
      "Building Edusify was fun, but hearing from you is better. Hit me up in DMs, and let’s talk about how it’s making your life easier! 😊🚀",
      "Let’s make a deal: You DM me about how much you love Edusify, and I promise to reply with an epic thank-you. Deal? 🤝✨",
      "Got a story about how Edusify saved your grade or helped you focus? I’d love to hear it in my DMs. It’ll make my week! 🏆📩",
      "They say CEOs are too busy for DMs, but I’m here proving them wrong. Hit me up, and let’s chat about anything (bonus if it’s about my app). 😂📱",
      "Think I’m cooler than your other apps? Let me know in my DMs. I promise I’ll try to stay humble. 😜📬"
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

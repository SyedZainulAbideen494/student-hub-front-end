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
      "As a 17-year-old CEO, I’m not saying I know everything... but I can organize your notes better than your school planner! 😂",
      "I built Edusify in 2 weeks... because who needs sleep when you have a mission? 😅 Follow me on Insta for more behind-the-scenes madness! @_syed_zain_ul",
      "Your school might have fancy teachers, but Edusify has me... the CEO who still forgets his own homework sometimes! 😜",
      "Need some motivation? Well, I’m the 17-year-old who built an app in two weeks. If I can do it, you can definitely finish your homework! 💪",
      "Ever wonder what it's like to run an app at 17? Follow me on Insta and find out, along with some *not-so-serious* behind-the-scenes moments. @_syed_zain_ul",
      "Being a 17-year-old CEO means I have to balance studying, coding, and... pretending I know what I'm doing! 😂 Want to know how? Follow me on Insta: @_syed_zain_ul",
      "I built Edusify in 2 weeks, and guess what? I still can’t figure out where I left my homework. But hey, I can definitely help you organize yours! 😅",
      "Pro tip: You don’t need a superhero to get things done—just an app built by a 17-year-old CEO who sometimes forgets his own lunch. 🍕",
      "Running Edusify is like being a student and CEO at the same time—except with way more coffee and zero sleep. If I can do it, so can you! ☕️",
      "Edusify wasn’t built with magic... just a lot of caffeine and me trying to figure out how to code while studying. Let’s do this together! 🚀",
      "Biggest challenge? Getting users. I showed my app to my computer science professor, and he didn’t care. Now, I have more fame than my entire college! 💪 #NeverGiveUp",
      "I built Edusify for fun, to be honest, and uploaded stories to impress my crush... now it's valued at $3 million! 😂 #DreamBig",
      "My college didn’t care about my idea... now my app has more users than students in my college! Talk about irony. 😜",
      "Studying? Who needs it when you can just get good marks easily and build a multi-million dollar app instead? 🤷‍♂️",
      "My motivation? Making an impact, not chasing money. But hey, a little success never hurt anyone. 😅",
      "Being a student and a CEO at the same time is no joke. But if I can do it with no sleep, so can you! ☕️ #StartupLife",
      "I didn’t have to study much, thanks to my dad’s investment. But hey, Edusify was all me. 🙌",
      "Pro tip: If your idea is rejected at first, just run ads on Instagram until everyone notices. Works like a charm. 📲",
      "I’m not money-driven, but let’s be real: $3 million feels pretty good. 😎 #BuildingTheFuture",
      "Edusify wasn’t built with magic... just a lot of caffeine, late nights, and me pretending I had everything figured out. 🚀 #TrustTheProcess"
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
  
    const shuffledTipTypes = shuffleArray(availableTipTypes);
  
    const recentlyShownTips = JSON.parse(localStorage.getItem('recentlyShownTips')) || [];
  
    let selectedTipType;
    let selectedTipList;
    let shuffledTips;
    let selectedTip;
  
    for (let attempt = 0; attempt < 5; attempt++) {
      selectedTipType = shuffledTipTypes.pop();  // Pop the type to ensure randomness
  
      selectedTipList = tips[selectedTipType];
      shuffledTips = shuffleArray(selectedTipList);
  
      selectedTip = shuffledTips.find(tip => !recentlyShownTips.includes(tip));
  
      if (selectedTip) break;
    }
  
    if (!selectedTip) {
      recentlyShownTips.length = 0;
      selectedTipType = shuffledTipTypes[0];
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

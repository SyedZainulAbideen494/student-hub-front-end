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
      "Did you know? 85% of Edusify users finished their tasks today. The rest are probably binge-watching Netflix. Don’t be them!",
      "Top performers are ahead by 2 tasks today. Can you catch up, or are you too busy wondering what’s for dinner?",
      "Get inspired! The best students finish their tasks before lunch. The rest of us finish after the third cup of coffee. Which team are you on?"
    ],
    quickTask: [
      "Got 15 minutes to spare? Quick, revise a topic or organize your notes. It’s either that or scroll through TikTok.",
      "Short break? Use it wisely: review a topic or tackle a small task, or just... stare into the void. Your choice!",
      "Short on time? Organize your notes in a few clicks. Or take a nap—your call. But organizing *might* help you pass that exam."
    ],
    interactiveTip: [
      "Pro Tip: Don’t want to write notes? Let the AI Assistant do the heavy lifting while you sip your coffee. ☕️",
      "Pro Tip: Stuck in a lecture? Let the AI Assistant create notes for you. It’s like having a personal note-taker, but cooler.",
      "Feeling lazy? Let the AI Assistant take care of the notes. You focus on your snack break 🍿.",
      "AI Tip: Can’t write fast enough? Let our Assistant summarize your lecture in a snap—no pen required!",
      "Quick Tip: AI Assistant + topic details = Instant Notes. It’s basically a superpower you didn’t know you had.",
      "Pro Tip: If you’re tired of scribbling notes, let the AI Assistant work its magic. You’ll be amazed at the results!",
      "Tip: Don’t feel like writing? AI Assistant’s got your back. Generate your notes faster than you can say ‘study break’!",
      "Need a cheat code for notes? Let the AI Assistant generate them for you. It’s faster than your morning routine!",
      "Tip: AI Assistant is your study sidekick! Let it generate those notes while you chill. No judgment. 😉",
      "AI Assistant: Because who has time for writing when you can have notes created in an instant?",
      "AI Assistant here! Need a joke? What do you call a note-taking robot who tells jokes? A 'pun'ctuation expert. 😏",
      "Feeling overwhelmed? Don’t worry! Let me summarize that for you, and then we’ll talk about something fun, like your favorite meme!",
      "Tip: I can be a friend, give advice, and even tell you what’s for dinner (just kidding, I don't know that...yet)! 😅",
      "AI Assistant says: “Why did the student bring a ladder to class? To go to high school! 😆”",
      "Not only can I help with notes, but I can give you advice too! Having a rough day? Here's some wisdom: ‘Don’t stress, just press.’ 🧘‍♂️",
      "Pro Tip: Want to procrastinate productively? Let me organize your notes while you figure out what’s for lunch. 🍔",
      "Need a little motivation? I’m like a caffeine shot for your productivity. Let’s knock out those tasks together! ⚡",
      "AI Assistant to the rescue! If you ever feel like life’s a quiz and you’re missing the answers, I’ve got your back—just ask!",
      "Joke Time! What did the AI say to the student? ‘I’m here for the homework, but I’m pretty good at pop quizzes too!’ 🤖",
      "AI Assistant Advice: It’s okay to take a break! But don’t take too many, or you might end up binge-watching shows instead of studying.",
      "Did you know? I can even chat with you about your favorite topics. Just give me a prompt, and I’ll go on and on like a pro!",
      "Tip: Need to clear your head? I can help you organize your thoughts, or we can talk about how cute your pet is. Your call! 🐶"
    ],    
    featureDiscovery: [
      "New Feature Alert: Keep your documents safe in our Document Locker. Because sometimes, your notes are more valuable than your phone.",
      "Pomodoro timer: Work for 25 minutes, then break for 5. It's like a mini vacation every half-hour! 🌴",
      "New Calendar feature: Because writing important dates on your hand *really* isn’t working anymore."
    ],
    additionalFunTips: [
      "Need a study buddy? Get the AI Assistant to help! It’s like having a robot friend who actually knows what they’re doing.",
      "Feeling overwhelmed? Try the Pomodoro technique! Work hard, then take a break like you're on vacation. 🌞",
      "Ever wish your study sessions were more like a video game? Try the Pomodoro timer and level up your productivity!",
      "Stressed about exams? Try using the AI Assistant to generate notes. It’s like a cheat code, but for real life.",
      "Forgot about that assignment? We got you. Set a reminder with the Edusify Planner. Your future self will thank you—probably with pizza.",
      "Your brain called, and it said it needs a break. Use the Pomodoro timer to work hard, then reward yourself with 5 minutes of doing absolutely nothing.",
      "New feature alert: Document Locker. Because you’re not the only one who needs security. Keep those notes safe!"
    ]
  };

  useEffect(() => {
    // Show a tip randomly every time the component is mounted
    setIsVisible(true);
    generateTip();
  }, []);

  const generateTip = () => {
    // Randomly pick a tip type to display
    const availableTipTypes = Object.keys(tips);

    if (availableTipTypes.length === 0) return; // No tips available, stop showing

    // Shuffle the tip types to randomize their order
    const shuffledTipTypes = availableTipTypes.sort(() => Math.random() - 0.5);

    // Pick the first available type from shuffled list
    const selectedTipType = shuffledTipTypes[0];
    setTipType(selectedTipType);

    const selectedTipList = tips[selectedTipType];

    // Shuffle the selected tips within the chosen type
    const shuffledTips = selectedTipList.sort(() => Math.random() - 0.5);

    // Pick a random tip from the shuffled list
    const randomTipIndex = Math.floor(Math.random() * shuffledTips.length);
    setTipContent(shuffledTips[randomTipIndex]);
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
    // Check the tip type and navigate based on the message content
    if (tipType === 'interactiveTip') {
      // Navigate to AI Assistant page
      navigate('/ai');
    } else if (tipType === 'quickTask') {
      // Navigate to Planner page
      navigate('/planner');
    } else if (tipType === 'peerComparison') {
      // Navigate to Peer Comparison page
      navigate('/leaderboard');
    } else if (tipType === 'featureDiscovery') {
      console.log('Feature Discovery Tip:', tipContent); // Debugging the tip content
      if (tipContent.toLowerCase().includes("pomodoro")) {
        console.log('Navigating to Pomodoro');
        navigate('/pomodoro');
      } else if (tipContent.toLowerCase().includes("calendar")) {
        console.log('Navigating to Calendar');
        navigate('/calendar');
      } else if (tipContent.toLowerCase().includes("document locker")) {
        console.log('Navigating to Document Locker');
        navigate('/document-locker');
      } else {
        console.log('Navigating to Feature Discovery');
        navigate('/feature-discovery');
      }
    } else if (tipType === 'additionalFunTips') {
      // Handle any fun tips here
      navigate('/');
    }
  };

  if (!isVisible || !tipContent) return null;

  return (
    <div className="tip-box">
      <div className="tip-content">
        <button className="close-btn" onClick={handleClose}>X</button>
        <div className="tip-message">
          {tipContent}
        </div>
        <button className="got-it__btn__tip__box" onClick={handleGotIt}>
          Got it
        </button>
        <button className="action-btn__tip__box" onClick={handleButtonClick}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default TipBox;

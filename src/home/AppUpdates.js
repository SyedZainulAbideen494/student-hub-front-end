import React from 'react';
import Typing from 'react-typing-effect';
import './AppUpdates.css'; // Import CSS file for styling

const AppUpdates = () => {
  const updates = [
    "🧠 AI can remember previous messages in the same convo like a chat app, similar to other AI like ChatGPT.",
    "📝 You can generate flashcards and notes directly with AI.",
    "📊 New Page: Dashboard for better analytics and insights.",
    "🐛 Bugs fixed in the AI functionalities.",
    "🎨 New UI for the Calendar for improved usability.",
    "👥 New UI for Groups for enhanced collaboration.",
    "Enhanced Animations: Enjoy improved page animations on the Calendar page for a smoother user experience!",
    "Introducing the Dashboard: We’ve added a new page, Dashboard, to give you better insights and analytics at a glance.",
    "We Value Your Feedback: Share your thoughts with us! Visit the Help page and scroll down to the feedback section to let us know how we’re doing."
  ];

  return (
    <div className="app-updates">
      <h2>Latest Updates</h2>
      <Typing
        text={updates}
        speed={50} // Speed of typing effect (ms)
        eraseSpeed={50} // Speed of erasing effect (ms)
        displayText=" " // Character used for spacing
        eraseDelay={2000} // Delay before starting to erase
        typingDelay={1000} // Delay before starting to type next update
      />
    </div>
  );
};

export default AppUpdates;

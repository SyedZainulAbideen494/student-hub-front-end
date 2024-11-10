import React, { useEffect, useState } from "react";
import './TipBox.css'; // Ensure the CSS styles are still appropriate
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

const TipBox = () => {
  const [streakInfo, setStreakInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const lastShownTime = localStorage.getItem('lastStreakShown');
    const currentTime = Date.now();

    if (!lastShownTime || currentTime - lastShownTime >= 3 * 60 * 60 * 1000) {
      fetchStreakData();
      setIsVisible(true);
      localStorage.setItem('lastStreakShown', currentTime); // Update last shown time
    }
  }, []);

  const fetchStreakData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    try {
      const response = await axios.post(API_ROUTES.getStreaks, { token });
      const { streakCount: count, hasCompletedToday } = response.data;
      setStreakCount(count);
      setStreakInfo({ streakCount: count, hasCompletedToday });
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setStreakInfo({ error: 'Failed to load streak data.' });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleGotIt = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 500); // Close after 0.5 seconds
  };

  const streakMessage = () => {
    if (streakCount < 7) return "You're off to a solid start! Keep going!";
    if (streakCount >= 8 && streakCount <= 15) return "Great work! Keep up the momentum!";
    if (streakCount >= 16 && streakCount <= 30) return "Awesome! You're on fire!";
    return "Unstoppable! You've earned mastery status! Keep pushing!";
  };

  const fireEmoji = () => {
    if (streakCount < 7) return "🔥"; // Grey fire
    if (streakCount >= 8 && streakCount <= 15) return "🔥"; // Orange fire
    if (streakCount > 15) return "🔥"; // Purple fire
  };

  const fireColor = () => {
    if (streakCount < 7) return "#B0B0B0"; // Grey fire
    if (streakCount >= 8 && streakCount <= 15) return "#FF6A00"; // Orange fire
    if (streakCount > 15) return "#9B4DFF"; // Purple fire
  };

  if (!isVisible || !streakInfo) return null;

  return (
    <div className="tip-box">
      <div className="tip-arrow"></div>
      <div className="tip-content">
        <h3 className="tip-heading">Streak</h3>
        <div className="streak-counter">
          <span className="streak-number">{streakCount}</span>
          <span className="fire-emoji" style={{ color: fireColor() }}>
            {fireEmoji()}
          </span>
        </div>
        <p className="streak-message">{streakMessage()}</p>
        <p style={{
  fontSize: '12px',
  color: '#555',
  fontWeight: '600',
  textAlign: 'center',
  marginTop: '8px',
  lineHeight: '1.4',
  letterSpacing: '0.5px'
}}>
  Keep adding and completing tasks daily to maintain your streak!
</p>


        <button className="close-btn" onClick={handleClose}>X</button>
        <button 
          className={`got-it__btn__tip__box ${streakCount > 30 ? 'untappable' : ''}`} 
          onClick={streakCount <= 30 ? handleGotIt : null}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default TipBox;

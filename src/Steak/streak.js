import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Streaks.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const Streaks = () => {
  const [streakData, setStreakData] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const fetchStreaks = async () => {
      const token = localStorage.getItem('token');
      if (!token) return console.error('No token found!');

      try {
        const response = await axios.post(API_ROUTES.getStreaks, { token });
        setStreakData(response.data);
      } catch (error) {
        console.error('Error fetching streak data:', error);
        setStreakData({ error: 'Failed to load streak data.' });
      }
    };
    fetchStreaks();
  }, []);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="streaks__Page__container">
      <div className="streaks__Page__header">
        <button className="streaks__Page__back-btn" onClick={() => window.history.back()}>←</button>
        <h2 className="streaks__Page__header-title">Streaks</h2>
        <button className="streaks__Page__info-btn" onClick={toggleInstructions}>?</button>
      </div>
      {showInstructions && (
        <div className="streaks__Page__instructions-modal">
          <div className="streaks__Page__modal-content">
            <h3 className="streaks__Page__modal-title">How to Gain Streaks</h3>
            <ul className="streaks__Page__modal-list">
              <li>Complete your daily tasks consistently.</li>
              <li>Log in every day to keep your streak going.</li>
              <li>Stay engaged with the app each week to maintain your streak!</li>
            </ul>
            <button className="streaks__Page__close-btn" onClick={toggleInstructions}>Got it</button>
          </div>
        </div>
      )}
      {streakData ? (
        streakData.error ? (
          <p className="streaks__Page__error">{streakData.error}</p>
        ) : (
          <div className="streaks__Page__main">
            <div className="streaks__Page__icon">🔥</div>
            <h1 className="streaks__Page__count">{streakData.streakCount} days streak</h1>
            <div className="streaks__Page__week-container">
              {streakData.streakWeekData && streakData.streakWeekData.map((completed, index) => (
                <div key={index} className={`streaks__Page__day ${completed ? 'active' : ''}`}>
                  {daysOfWeek[index]}
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <p className="streaks__Page__loading">Loading streak data...</p>
      )}
    </div>
  );
};

export default Streaks;

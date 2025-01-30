import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import './PomodoroSettings.css';
import { API_ROUTES } from '../../app_modules/apiRoutes';
import axios from 'axios';


const PomodoroSettings = ({ theme }) => {
  const navigate = useNavigate();
  const [timerLength, setTimerLength] = useState(() => parseInt(localStorage.getItem('timerLength')) || 1500);
  const [breakLength, setBreakLength] = useState(() => parseInt(localStorage.getItem('breakLength')) || 300);
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAIRecommendation] = useState(null); // Store AI recommendations
  const [isPremium, setIsPremium] = useState(null);

  // Update localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('timerLength', timerLength);
    localStorage.setItem('breakLength', breakLength);
  }, [timerLength, breakLength]);

  // Fetch AI recommendations on button click
  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.aiPomdoroRecomendation, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.studyTime && data?.breakTime) {
        setAIRecommendation({
          studyTime: data.studyTime,
          breakTime: data.breakTime,
        });
      } else {
        console.warn('AI recommendation returned invalid data:', data);
      }
    } catch (error) {
      console.error('Error fetching AI recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply AI recommendation
  const applyAIRecommendation = () => {
    if (aiRecommendation) {
      const studyTimeInSeconds = aiRecommendation.studyTime * 60;
      const breakTimeInSeconds = aiRecommendation.breakTime * 60;

      setTimerLength(studyTimeInSeconds);
      setBreakLength(breakTimeInSeconds);

      localStorage.setItem('timerLength', studyTimeInSeconds);
      localStorage.setItem('breakLength', breakTimeInSeconds);
    }
  };

  // Handlers for manual input changes
  const handleTimerLengthChange = (e) => setTimerLength(e.target.value * 60);
  const handleBreakLengthChange = (e) => setBreakLength(e.target.value * 60);

  // Increment/Decrement Handlers
  const incrementTimer = () => setTimerLength((prev) => prev + 60);
  const decrementTimer = () => setTimerLength((prev) => (prev > 60 ? prev - 60 : prev));
  const incrementBreak = () => setBreakLength((prev) => prev + 60);
  const decrementBreak = () => setBreakLength((prev) => (prev > 60 ? prev - 60 : prev));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  const saveSettings = () => navigate('/pomodoro');

  return (
    <div className={`container__settings__pomodoro__page ${theme === 'dark' ? 'dark__settings__pomodoro__page' : ''}`}>
      {/* Header */}
      <div className="header__settings__pomodoro__page">
        <button className="back-button__settings__pomodoro__page" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h3 className="title__settings__pomodoro__page">Settings</h3>
      </div>

      {/* Settings Card */}
      <div className="card__settings__pomodoro__page">
        {/* Timer Length Input */}
        <div className="input-group__settings__pomodoro__page">
          <label htmlFor="timerLength" className="label__settings__pomodoro__page">Study Time (minutes):</label>
          <div className="input-wrapper">
            <button className="increment-decrement-button" onClick={decrementTimer}>-</button>
            <input
              type="number"
              id="timerLength"
              value={timerLength / 60}
              onChange={handleTimerLengthChange}
              className="input__settings__pomodoro__page"
            />
            <button className="increment-decrement-button" onClick={incrementTimer}>+</button>
          </div>
        </div>

        {/* Break Length Input */}
        <div className="input-group__settings__pomodoro__page">
          <label htmlFor="breakLength" className="label__settings__pomodoro__page">Break Time (minutes):</label>
          <div className="input-wrapper">
            <button className="increment-decrement-button" onClick={decrementBreak}>-</button>
            <input
              type="number"
              id="breakLength"
              value={breakLength / 60}
              onChange={handleBreakLengthChange}
              className="input__settings__pomodoro__page"
            />
            <button className="increment-decrement-button" onClick={incrementBreak}>+</button>
          </div>
        </div>

        {/* Save Button */}
        <button className="save-button__settings__pomodoro__page" onClick={saveSettings}>
          Save
        </button>
       
        {isPremium ? (
     <button
     className="ai-recommendation-button"
     onClick={fetchAIRecommendations}
     disabled={loading}
   >
     {loading ? 'Generating...' : 'AI Recommendation'}
   </button>
    ) : (
      <button
      className="ai-recommendation-button"
      onClick={fetchAIRecommendations}
      disabled
    >
           <FaLock className="lock-icon" /> AI Recommendation
    </button>
    )}
      </div>

    </div>
  );
};

export default PomodoroSettings;

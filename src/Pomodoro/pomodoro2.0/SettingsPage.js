import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PomodoroSettings.css';

const PomodoroSettings = ({ theme }) => {
  const [timerLength, setTimerLength] = useState(() => {
    return parseInt(localStorage.getItem('timerLength')) || 1500;
  });

  const [breakLength, setBreakLength] = useState(() => {
    return parseInt(localStorage.getItem('breakLength')) || 300;
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('timerLength', timerLength);
    localStorage.setItem('breakLength', breakLength);
  }, [timerLength, breakLength]);

  const handleTimerLengthChange = (e) => {
    setTimerLength(e.target.value * 60);
  };

  const handleBreakLengthChange = (e) => {
    setBreakLength(e.target.value * 60);
  };

  const incrementTimer = () => {
    setTimerLength(prev => prev + 60); // Increment by 1 minute (60 seconds)
  };

  const decrementTimer = () => {
    setTimerLength(prev => (prev > 60 ? prev - 60 : prev)); // Decrement by 1 minute (60 seconds) but not less than 1 minute
  };

  const incrementBreak = () => {
    setBreakLength(prev => prev + 60); // Increment by 1 minute (60 seconds)
  };

  const decrementBreak = () => {
    setBreakLength(prev => (prev > 60 ? prev - 60 : prev)); // Decrement by 1 minute (60 seconds) but not less than 1 minute
  };

  const saveSettings = () => {
    navigate('/pomodoro');
  };

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
            <button
              className="increment-decrement-button"
              onClick={decrementTimer}
            >
              -
            </button>
            <input
              type="number"
              id="timerLength"
              value={timerLength / 60}
              onChange={handleTimerLengthChange}
              className="input__settings__pomodoro__page"
            />
            <button
              className="increment-decrement-button"
              onClick={incrementTimer}
            >
              +
            </button>
          </div>
        </div>

        {/* Break Length Input */}
        <div className="input-group__settings__pomodoro__page">
          <label htmlFor="breakLength" className="label__settings__pomodoro__page">Break Time (minutes):</label>
          <div className="input-wrapper">
            <button
              className="increment-decrement-button"
              onClick={decrementBreak}
            >
              -
            </button>
            <input
              type="number"
              id="breakLength"
              value={breakLength / 60}
              onChange={handleBreakLengthChange}
              className="input__settings__pomodoro__page"
            />
            <button
              className="increment-decrement-button"
              onClick={incrementBreak}
            >
              +
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button className="save-button__settings__pomodoro__page" onClick={saveSettings}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PomodoroSettings;

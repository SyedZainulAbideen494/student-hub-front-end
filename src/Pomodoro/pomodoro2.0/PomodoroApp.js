import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsFillPlayFill, BsFillPauseFill, BsFillStopFill, BsFillBarChartFill, BsFillGearFill,BsFillArrowLeftCircleFill } from 'react-icons/bs'; // Import new icons
import './pomodoro2.0.css'; // Importing the CSS file for light/dark theme
import PomodoroSettings from './SettingsPage'; // Import the settings component
import FooterNav from '../../app_modules/footernav';
import { FaAngleLeft } from 'react-icons/fa';
import { API_ROUTES } from '../../app_modules/apiRoutes';

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PomodoroApp = () => {
  const [isStudyTime, setIsStudyTime] = useState(true); // Track whether it's study or break time
  const [timer, setTimer] = useState(1500); // Default to 25 minutes for study time
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // New state for pause functionality
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [timerLength, setTimerLength] = useState(parseInt(localStorage.getItem('timerLength')) || 1500); // Load saved timer length for study
  const [breakLength, setBreakLength] = useState(parseInt(localStorage.getItem('breakLength')) || 300); // Load saved break length
  const [sound] = useState(new Audio('https://audio-previews.elements.envatousercontent.com/files/148785970/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22RZFWLXE-bell-hop-bell.mp3%22')); // Bell sound
  const [wakeLock, setWakeLock] = useState(null); // Track the wake lock state

 
  const navigate = useNavigate();

  useEffect(() => {
    const savedTimerLength = parseInt(localStorage.getItem('timerLength')) || 1500; // Load saved timer length
    setTimer(savedTimerLength); // Initialize timer with the saved length
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (timer === 0 && isRunning && !isPaused) {
      sound.play();
      if (isStudyTime) {
        setIsStudyTime(false); // Switch to break time
        setTimer(breakLength); // Set timer to break length
      } else {
        setIsStudyTime(true); // Switch back to study time
        setTimer(timerLength); // Set timer to study length
      }
      setIsRunning(false); // Stop the timer
      endSession(); // Automatically call endSession when the timer finishes
    }

    return () => clearInterval(interval);
  }, [isRunning, timer, sound, isStudyTime, timerLength, breakLength, isPaused]);

  const startSession = async () => {
    try {
      const sessionType = isStudyTime ? 'study' : 'break';
      const response = await axios.post(API_ROUTES.apiStartPomodoro, {
        token,
        session_type: sessionType,
      });
      setSessionId(response.data.session_id);
      setStartTime(response.data.start_time);
      setIsRunning(true);
      setIsPaused(false); 
      setTimer(isStudyTime ? timerLength : breakLength);

      // Request wake lock
      if ('wakeLock' in navigator) {
        try {
          const lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);
        } catch (err) {
          console.error('Error requesting wake lock:', err);
        }
      }
    } catch (error) {
      console.error('Error starting session:', error.response.data.message);
    }
  };

 
  
  const pauseSession = () => {
    setIsPaused(true);
    // Release wake lock on pause
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  
    // Clear session data from localStorage when paused
    localStorage.removeItem('pomodoroTimer');
  };

  const resumeSession = async () => {
    setIsPaused(false);
    // Request wake lock again if resumed
    if ('wakeLock' in navigator) {
      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
      } catch (err) {
        console.error('Error requesting wake lock:', err);
      }
    }
  };
  
  const endSession = async () => {
    try {
      const sessionType = isStudyTime ? 'study' : 'break';
      const response = await axios.post(API_ROUTES.apiStopPomodoro, {
        session_id: sessionId,
        token,
        session_type: sessionType,
      });
      setEndTime(response.data.end_time);
      setSessionId(null);
      setIsRunning(false);
      setIsPaused(false); 
  
      // Clear session data from localStorage
      localStorage.removeItem('pomodoroTimer');
      
      // Release wake lock on session end
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
      }
  
      sound.play();
    } catch (error) {
      console.error('Error ending session:', error.response.data.message);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSettingsUpdate = (newTimerLength, newBreakLength) => {
    setTimerLength(newTimerLength);
    setBreakLength(newBreakLength);
    setTimer(newTimerLength); // Update the timer immediately after settings change
    localStorage.setItem('timerLength', newTimerLength);
    localStorage.setItem('breakLength', newBreakLength);
  };

  useEffect(() => {
    if (isRunning) {
      localStorage.setItem('pomodoroTimer', JSON.stringify({
        timer,
        isRunning,
        isStudyTime,
        startTime: startTime || new Date().toISOString(),
      }));
    }
  }, [timer, isRunning, isStudyTime, startTime]);

  
  useEffect(() => {
    const savedTimerData = JSON.parse(localStorage.getItem('pomodoroTimer'));
    if (savedTimerData) {
      const { timer, isRunning, isStudyTime, startTime } = savedTimerData;
      const elapsed = Math.floor((new Date() - new Date(startTime)) / 1000);
      const remainingTime = Math.max(timer - elapsed, 0);
      setTimer(remainingTime);
      setIsRunning(isRunning);
      setIsStudyTime(isStudyTime);
  
      if (remainingTime === 0 && isRunning) {
        setIsRunning(false);
      }
    }
  }, []);


  return (
    <div className={`home__pomodoro__new ${theme}__Pomodoro__new`}>
    {/* Theme Toggle */}
   
  
    <div className="top-bar__Pomodoro__new">
  {/* Back Button */}
  {!isRunning && (
          <button className="back-btn__Pomodoro__new" onClick={() => navigate('/')}>
            <BsFillArrowLeftCircleFill />
          </button>
        )}


  <h3 className="session-type__Pomodoro__new">{isStudyTime ? 'Study Time' : 'Break Time'}</h3>
  {!isRunning && (
          <button className="settings-btn__Pomodoro__new" onClick={() => navigate('/pomodoro/settings')}>
            <BsFillGearFill />
          </button>
        )}
</div>

  
    {/* Timer Display */}
    <div className="timer__pomodoro__new">
      <div className="circular-timer__Pomodoro__new">
      <svg className="circle__Pomodoro__new" width="200" height="200">
  <defs>
    <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#d88cff" />       {/* Pinkish-Purple Glow */}
      <stop offset="50%" stopColor="#9389ff" />       {/* Soft Lavender */}
      <stop offset="100%" stopColor="#6be6ff" />      {/* Electric Blue */}
    </linearGradient>
  </defs>
  <circle className="circle-bg__Pomodoro__new" cx="100" cy="100" r="90" strokeWidth="10" />
  <circle
    className="circle-progress__Pomodoro__new"
    cx="100"
    cy="100"
    r="90"
    strokeWidth="10"
    style={{
      strokeDasharray: `${(timer / (isStudyTime ? timerLength : breakLength)) * 565}px 565px`,
      transition: 'stroke-dasharray 1s ease-out',
      stroke: 'url(#pomodoroGradient)', // Apply gradient here
    }}
  />
</svg>


        <p className="timer-number__Pomodoro__new">{formatTime(timer)}</p>
      </div>
    </div>
  
    {/* Button Group */}
    <div className="button__group__Pomodoro__new">
      {!isRunning ? (
        <>
         <label className="switch__dark__Light__pomodoro" style={{marginTop: '4px'}}>
      <span className="sun__dark__Light__pomodoro">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="#ffd43b">
            <circle r="5" cy="12" cx="12"></circle>
            <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
          </g>
        </svg>
      </span>
      <span className="moon__dark__Light__pomodoro">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
        </svg>
      </span>
      <input 
        type="checkbox" 
        className="input__dark__Light__pomodoro" 
        checked={theme === 'dark'}
        onChange={toggleTheme} 
      />
      <span className="slider__dark__Light__pomodoro"></span>
    </label>
        <button onClick={startSession} className="start-session__Pomodoro__new">
          <BsFillPlayFill /> Start Session
        </button>
        <button className="start-session__Pomodoro__new" onClick={() => navigate('/pomodoro/stats')}><BsFillBarChartFill/> Stats</button>
        </>
      ) : isPaused ? (
        <button onClick={resumeSession} className="start-session__Pomodoro__new">
          <BsFillPlayFill /> Resume Session
        </button>
      ) : (
        <>
          <button onClick={pauseSession} className="end-session__Pomodoro__new">
            <BsFillPauseFill /> Pause Session
          </button>
          <button onClick={endSession} className="end-session__Pomodoro__new">
            <BsFillStopFill /> End Session
          </button>
        </>
      )}
    </div>
  
  </div>
  
  );
};

export default PomodoroApp;
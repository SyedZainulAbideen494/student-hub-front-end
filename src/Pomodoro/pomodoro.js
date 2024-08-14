import React, { useState, useEffect } from 'react';
import './pomodoro.css';
import FooterNav from '../app_modules/footernav';

// Helper function to format time
const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Pomodoro = () => {
    const [isWork, setIsWork] = useState(true);
    const [workTime, setWorkTime] = useState(parseInt(localStorage.getItem('workTime')) || 25);
    const [breakTime, setBreakTime] = useState(parseInt(localStorage.getItem('breakTime')) || 5);
    const [time, setTime] = useState(parseInt(localStorage.getItem('time')) || workTime * 60);
    const [isRunning, setIsRunning] = useState(JSON.parse(localStorage.getItem('isRunning')) || false);
    const [showModal, setShowModal] = useState(false);

    // Load statistics from localStorage
    const [totalStudyTime, setTotalStudyTime] = useState(parseInt(localStorage.getItem('totalStudyTime')) || 0);
    const [totalBreakTime, setTotalBreakTime] = useState(parseInt(localStorage.getItem('totalBreakTime')) || 0);
    const [sessionCount, setSessionCount] = useState(parseInt(localStorage.getItem('sessionCount')) || 0);
    const [breakCount, setBreakCount] = useState(parseInt(localStorage.getItem('breakCount')) || 0);
    const [streakDays, setStreakDays] = useState(parseInt(localStorage.getItem('streakDays')) || 0);
    const [longestStreak, setLongestStreak] = useState(parseInt(localStorage.getItem('longestStreak')) || 0);
    const [lastSessionDate, setLastSessionDate] = useState(localStorage.getItem('lastSessionDate'));

    // Check and update streaks
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (lastSessionDate === today) {
            // No update needed if today is the same as lastSessionDate
            return;
        }
        
        if (lastSessionDate) {
            const prevDate = new Date(lastSessionDate);
            const currDate = new Date(today);
            const diffDays = Math.ceil((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Increment streak if user used Pomodoro on consecutive days
                setStreakDays((prevStreak) => prevStreak + 1);
            } else {
                // Reset streak if skipped day
                setStreakDays(0);
            }
            
            // Update longest streak if current streak is the longest
            setLongestStreak((prevLongest) => Math.max(prevLongest, streakDays));
        } else {
            // Initialize streak if no lastSessionDate
            setStreakDays(1);
        }
        
        setLastSessionDate(today);
        localStorage.setItem('lastSessionDate', today);
        localStorage.setItem('streakDays', streakDays);
        localStorage.setItem('longestStreak', longestStreak);
    }, [lastSessionDate, streakDays]);

    useEffect(() => {
        // Save state and statistics to localStorage
        localStorage.setItem('workTime', workTime);
        localStorage.setItem('breakTime', breakTime);
        localStorage.setItem('time', time);
        localStorage.setItem('isRunning', JSON.stringify(isRunning));
        localStorage.setItem('totalStudyTime', totalStudyTime);
        localStorage.setItem('totalBreakTime', totalBreakTime);
        localStorage.setItem('sessionCount', sessionCount);
        localStorage.setItem('breakCount', breakCount);
        localStorage.setItem('streakDays', streakDays);
        localStorage.setItem('longestStreak', longestStreak);
        localStorage.setItem('lastSessionDate', lastSessionDate);
    }, [workTime, breakTime, time, isRunning, totalStudyTime, totalBreakTime, sessionCount, breakCount, streakDays, longestStreak, lastSessionDate]);

    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
                if (isWork) {
                    setTotalStudyTime((prevTime) => prevTime + 1);
                } else {
                    setTotalBreakTime((prevTime) => prevTime + 1);
                }
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
            setShowModal(true);
            if (isWork) {
                setSessionCount((prevCount) => prevCount + 1);
            }
            setBreakCount((prevCount) => prevCount + 1);

            // Switch between work and break
            if (isWork) {
                setIsWork(false);
                setTime(breakTime * 60);
            } else {
                setIsWork(true);
                setTime(workTime * 60);
            }
        }
        return () => clearInterval(timer);
    }, [isRunning, time, isWork, workTime, breakTime]);

    useEffect(() => {
        // Check if the timer was running on mount and adjust time
        const savedTime = parseInt(localStorage.getItem('time'));
        const savedIsRunning = JSON.parse(localStorage.getItem('isRunning'));

        if (savedIsRunning && savedTime > 0) {
            const now = Date.now();
            const timeElapsed = Math.floor((now - parseInt(localStorage.getItem('startTime'))) / 1000);
            setTime(savedTime - timeElapsed);
        }
        setIsRunning(savedIsRunning);
    }, []);

    const handleStartPause = () => {
        if (!isRunning) {
            // Store start time
            localStorage.setItem('startTime', Date.now());
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(isWork ? workTime * 60 : breakTime * 60);
        localStorage.removeItem('startTime'); // Clear start time
    };

    const handleWorkTimeChange = (e) => {
        const value = Math.max(1, e.target.value);
        setWorkTime(value);
        if (isWork) {
            setTime(value * 60);
        }
    };

    const handleBreakTimeChange = (e) => {
        const value = Math.max(1, e.target.value);
        setBreakTime(value);
        if (!isWork) {
            setTime(value * 60);
        }
    };

    // Motivational quotes based on achievements
    const getMotivationalQuote = () => {
        if (streakDays >= 7) {
            return "Amazing! You've reached a 1-week streak! Keep up the great work!";
        } else if (streakDays >= 3) {
            return `Great job! You've reached a ${streakDays}-day streak!`;
        } else if (streakDays > 0) {
            return `Nice! You've maintained a ${streakDays}-day streak.`;
        } else {
            return "Start a new streak today and stay consistent!";
        }
    };

    return (
        <div className="pomodoro-container">
            <h2>{isWork ? 'Study Time' : 'Break Time'}</h2>
            <div className="timer">
                {formatTime(time)}
            </div>
            
            <div className="controls-pomodoro">
                <button onClick={handleStartPause}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                {isRunning && (
                    <button onClick={handleReset}>
                        Stop
                    </button>
                )}
            </div>
            {!isRunning && (
                <div className="settings-pomodoro">
                    <label>
                        Work Time (minutes):
                        <input
                            type="number"
                            value={workTime}
                            onChange={handleWorkTimeChange}
                            min="1"
                        />
                    </label>
                    <label>
                        Break Time (minutes):
                        <input
                            type="number"
                            value={breakTime}
                            onChange={handleBreakTimeChange}
                            min="1"
                        />
                    </label>
                    <div className="statistics">
                        <h3>Statistics</h3>
                        <div className="stat-item">
                            <span className="stat-label">Total Study Time:</span>
                            <span className="stat-value">{formatTime(totalStudyTime)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Break Time:</span>
                            <span className="stat-value">{formatTime(totalBreakTime)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Session Count:</span>
                            <span className="stat-value">{sessionCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Break Count:</span>
                            <span className="stat-value">{breakCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Current Streak:</span>
                            <span className="stat-value">{streakDays} day(s)</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Longest Streak:</span>
                            <span className="stat-value">{longestStreak} day(s)</span>
                        </div>
                        <p>{getMotivationalQuote()}</p>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="modal-pomodoro">
                    <div className='modal-content-pomodoro'>
                    <h3>{isWork ? 'Break Over!' : 'Good Job!'}</h3>
                    
                    <button onClick={() => setShowModal(false)}>OK</button>
                    </div>
                </div>
            )}
            <FooterNav />
        </div>
    );
};

export default Pomodoro;
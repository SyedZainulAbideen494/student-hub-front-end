import React, { useState, useEffect } from 'react';
import './pomodoro.css'; // Create a CSS file for styling
import FooterNav from '../app_modules/footernav';

const Pomodoro = () => {
    const [isWork, setIsWork] = useState(true);
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [time, setTime] = useState(workTime * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    useEffect(() => {
        if (time === 0) {
            setIsWork(!isWork);
            setShowModal(true);
            setTime(isWork ? breakTime * 60 : workTime * 60);
        }
    }, [time, isWork, workTime, breakTime]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(isWork ? workTime * 60 : breakTime * 60);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleWorkTimeChange = (e) => {
        setWorkTime(e.target.value);
        if (isWork) {
            setTime(e.target.value * 60);
        }
    };

    const handleBreakTimeChange = (e) => {
        setBreakTime(e.target.value);
        if (!isWork) {
            setTime(e.target.value * 60);
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="pomodoro-container">
            <h2>{isWork ? 'Work Time' : 'Break Time'}</h2>
            <div className="timer">
                {formatTime(time)}
            </div>
            <div className="controls">
                <button onClick={handleStartPause}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={handleReset}>
                    Reset
                </button>
            </div>
            <div className="settings">
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
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isWork ? 'Time for a Break!' : 'Back to Work!'}</h3>
                        <button onClick={handleModalClose}>Close</button>
                    </div>
                </div>
            )}
            <FooterNav />
        </div>
    );
};

export default Pomodoro;
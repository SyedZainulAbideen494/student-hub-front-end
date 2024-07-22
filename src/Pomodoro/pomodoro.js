import React, { useState, useEffect } from 'react';
import './pomodoro.css';
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
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
            setShowModal(true);
        }
        return () => clearInterval(timer);
    }, [isRunning, time]);

    useEffect(() => {
        if (showModal) {
            const timeout = setTimeout(() => {
                setShowModal(false);
                setIsWork((prevIsWork) => !prevIsWork);
                setTime(isWork ? breakTime * 60 : workTime * 60);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [showModal, isWork, breakTime, workTime]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(isWork ? workTime * 60 : breakTime * 60);
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

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                <button onClick={handleReset}>
                    Reset
                </button>
            </div>
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
            </div>
            {showModal && (
                <div className="modal-pomodoro">
                    <div className="modal-content-pomodoro">
                        <h3>{isWork ? 'Time for a Break!' : 'Back to Study!'}</h3>
                    </div>
                </div>
            )}
            <FooterNav />
        </div>
    );
};

export default Pomodoro;
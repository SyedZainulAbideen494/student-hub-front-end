// src/tutorials/PomodoroPageTutorial.js

import React, { useState } from 'react';
import './PomodoroPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to the Pomodoro Timer Page.",
    "At the top, you can see the timer and a 'Start' button.",
    "Below, you can set your study time and break time.",
    "You can also see your session statistics below the timer.",
    "Save your stats as an image to share and 'flex' with your friends.",
    "When you start the timer, two buttons will appear: 'Stop' and 'Reset'.",
    "Once your timer finishes, you'll hear a ring sound.",
    "You're ready to focus and track your study sessions!",
];

const PomodoroPageTutorial = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextClick = () => {
        if (currentStep < tutorialMessages.length - 1) {
            setCurrentStep(currentStep + 1); // Go to the next step
        } else {
            onComplete(); // Call onComplete when reaching the end
        }
    };

    return (
        <div className="tutorial-overlay__pomodoro__modal">
            <div className="tutorial-content__pomodoro__modal">
                <h3>{tutorialMessages[currentStep]}</h3>
                <button onClick={handleNextClick}>
                    {currentStep < tutorialMessages.length - 1 ? 'Next' : 'Got it!'}
                </button>
            </div>
        </div>
    );
};

export default PomodoroPageTutorial;

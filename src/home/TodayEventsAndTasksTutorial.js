// src/tutorials/TodayEventsAndTasksTutorial.js

import React, { useState } from 'react';
import './TodayEventsAndTasksTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "This is your dashboard.",
    "You can view your Today's Events and Tasks here.",
    "Click 'Go to Planner' to navigate to the planner page.",
    "Click 'Go to Calendar' to navigate to the calendar page.",
    "You're all set to get started!",
];

const TodayEventsAndTasksTutorial = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextClick = () => {
        if (currentStep < tutorialMessages.length - 1) {
            setCurrentStep(currentStep + 1); // Go to the next step
        } else {
            onComplete(); // Call onComplete when reaching the end
        }
    };

    return (
        <div className="tutorial-overlay__tutorial__msg__modal">
            <div className="tutorial-content__tutorial__msg__modal">
                <h3>{tutorialMessages[currentStep]}</h3>
                <button onClick={handleNextClick}>
                    {currentStep < tutorialMessages.length - 1 ? 'Next' : 'Got it!'}
                </button>
            </div>
        </div>
    );
};

export default TodayEventsAndTasksTutorial;

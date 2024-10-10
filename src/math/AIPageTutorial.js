// src/tutorials/AIPageTutorial.js

import React, { useState } from 'react';
import './AIPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "This is Edusify AI powered by Gemini.",
    "Here you can enter prompts and get instant answers.",
    "You can create notes of the AI-generated answers.",
    "Save them by clicking 'Add to Notes'.",
    "You're all set to start using Edusify AI!",
];

const AIPageTutorial = ({ onComplete }) => {
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

export default AIPageTutorial;

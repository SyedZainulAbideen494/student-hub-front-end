// src/tutorials/PlannerPageTutorial.js

import React, { useState } from 'react';
import './PlannerPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to your Planner Page.",
    "Here, you can add tasks to your to-do list.",
    "Fill in the title, description, due date, and priority of your task.",
    "Click 'Add Task' to save your task.",
    "You'll receive email reminders three times a day starting three days before your task's due date.",
    "You can view your task statistics at the top of the page.",
    "You're ready to start organizing your tasks!",
];

const PlannerPageTutorial = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextClick = () => {
        if (currentStep < tutorialMessages.length - 1) {
            setCurrentStep(currentStep + 1); // Go to the next step
        } else {
            onComplete(); // Call onComplete when reaching the end
        }
    };

    return (
        <div className="tutorial-overlay__planner__modal">
            <div className="tutorial-content__planner__modal">
                <h3>{tutorialMessages[currentStep]}</h3>
                <button onClick={handleNextClick}>
                    {currentStep < tutorialMessages.length - 1 ? 'Next' : 'Got it!'}
                </button>
            </div>
        </div>
    );
};

export default PlannerPageTutorial;

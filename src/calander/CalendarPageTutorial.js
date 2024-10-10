// src/tutorials/CalendarPageTutorial.js

import React, { useState } from 'react';
import './CalendarPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to your Calendar Page.",
    "Here, you can add important dates and events.",
    "Click the 'Add Event' button to create a new event.",
    "Enter the title of your event.",
    "Select the date when the event will take place.",
    "Once you've added your event, you'll receive reminders three times a day, starting three days before the event's due date.",
    "You're ready to start organizing your important dates!",
];

const CalendarPageTutorial = ({ onComplete }) => {
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

export default CalendarPageTutorial;

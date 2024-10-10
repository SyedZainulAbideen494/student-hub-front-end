// src/tutorials/GroupsPageTutorial.js

import React, { useState } from 'react';
import './GroupsPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to the Groups Page!",
    "Here, you can create your own groups.",
    "To create a group, click the 'Create' button.",
    "Enter the name and description of your group.",
    "Once created, you can view your group in the 'Joined' section.",
    "To see invitations to other groups, click on the 'Invitations' tab.",
    "To invite people to your group, click on the group name on the group page.",
    "Enter the phone number of the user they used on Edusify to send the invitation.",
    "If they are not an Edusify user, they can't be invited",
    "You're all set to start connecting with others through groups!",
];

const GroupsPageTutorial = ({ onComplete }) => {
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

export default GroupsPageTutorial;

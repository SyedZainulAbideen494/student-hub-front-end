// src/tutorials/NotesPageTutorial.js

import React, { useState } from 'react';
import './NotesPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to the Notes Page!",
    "Here, you can view all your notes.",
    "To create a new note, click the 'Create +' button.",
    "You'll be taken to the Create Notes Page.",
    "On this page, you can add a title, description, images, and content.",
    "Customize your content with different fonts, text colors, and background colors.",
    "You can also add videos, links, and more.",
    "Generate information using AI and import it into your content.",
    "Once you're done, you can download your notes as a PDF.",
    "You can also see the number of downloads and share your notes with others.",
    "You're all set to create and manage your notes!",
];

const NotesPageTutorial = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextClick = () => {
        if (currentStep < tutorialMessages.length - 1) {
            setCurrentStep(currentStep + 1); // Go to the next step
        } else {
            onComplete(); // Call onComplete when reaching the end
        }
    };

    return (
        <div className="tutorial-overlay__notes__modal">
            <div className="tutorial-content__notes__modal">
                <h3>{tutorialMessages[currentStep]}</h3>
                <button onClick={handleNextClick}>
                    {currentStep < tutorialMessages.length - 1 ? 'Next' : 'Got it!'}
                </button>
            </div>
        </div>
    );
};

export default NotesPageTutorial;

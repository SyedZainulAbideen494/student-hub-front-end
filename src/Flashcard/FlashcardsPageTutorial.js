// src/tutorials/FlashcardsPageTutorial.js

import React, { useState } from 'react';
import './FlashcardsPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to the Flashcards Page!",
    "Here, you can view all your flashcard sets.",
    "To add a new set, click the 'Create' button in the top right corner.",
    "Enter the details for your set, including the set name, subject, and topic.",
    "After adding the details, click 'Create Set' to finalize.",
    "You can add flashcards to your set by clicking the '+' button at the bottom right.",
    "Choose to generate flashcards using AI or add them manually.",
    "If you need to delete a card, simply click the delete option next to it.",
    "Click 'View' to see all the flashcards in your set.",
    "Swipe left if you don't know the flashcard, or swipe right if you do.",
    "To see the answer, click the 'Show Answer' button.",
    "Once you've finished, visit the 'Stats' section to see your progress on the flashcard set.",
    "You're all set to start learning with your flashcards!",
];

const FlashcardsPageTutorial = ({ onComplete }) => {
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

export default FlashcardsPageTutorial;

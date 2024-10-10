// src/tutorials/SearchPageTutorial.js

import React, { useState } from 'react';
import './SearchPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to the Search Page.",
    "Here, you can search for your friends.",
    "Enter your friend's name in the search bar",
    "You will see a list of matching profiles.",
    "Click on a profile to view more details.",
    "From the profile, you can choose to follow your friend.",
    "You're now ready to connect with your friends!",
];

const SearchPageTutorial = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextClick = () => {
        if (currentStep < tutorialMessages.length - 1) {
            setCurrentStep(currentStep + 1); // Go to the next step
        } else {
            onComplete(); // Call onComplete when reaching the end
        }
    };

    return (
        <div className="tutorial-overlay__search__modal">
            <div className="tutorial-content__search__modal">
                <h3>{tutorialMessages[currentStep]}</h3>
                <button onClick={handleNextClick}>
                    {currentStep < tutorialMessages.length - 1 ? 'Next' : 'Got it!'}
                </button>
            </div>
        </div>
    );
};

export default SearchPageTutorial;

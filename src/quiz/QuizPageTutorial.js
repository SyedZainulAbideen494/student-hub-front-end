// src/tutorials/QuizPageTutorial.js

import React, { useState } from 'react';
import './QuizPageTutorial.css'; // Import the CSS file

const tutorialMessages = [
    "Welcome to the Quiz Page.",
    "Here, you can create quizzes to test your knowledge.",
    "Click the 'Create' button to start a new quiz.",
    "Add a title and a description for your quiz.",
    "Enter your questions and provide possible answers.",
    "Check the box next to the correct answer.",
    "Once done, click 'Share' to share your quiz with friends.",
    "You can also view and attend quizzes created by your friends.",
    "Check your results after completing a quiz.",
    "You're ready to start quizzing your friends!",
];

const QuizPageTutorial = ({ onComplete }) => {
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

export default QuizPageTutorial;

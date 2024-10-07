import React from 'react';
import { useNavigate } from 'react-router-dom';
import './quizGuidePage.css'; // Make sure to create this CSS file for styling

const QuizGuidePage = () => {
    const navigate = useNavigate(); // Using React Router's useNavigate

    return (
        <div className="guide-page__quiz__guide__page">
            <header className="guide-header__quiz__guide__page">
                <button className="back-btn__quiz__guide__page" onClick={() => navigate(-1)}>
                    <svg
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M15 18l-6-6 6-6" fill="currentColor" />
                    </svg>
                </button>
                <h1 className="guide-title__quiz__guide__page">Quiz Guide</h1>
            </header>
            <div className="guide-content__quiz__guide__page">
                <p>
                    To use the quiz feature, you must first create a quiz by adding questions and answers. For each question, select one correct answer as it is a multiple-choice quiz (MCQ). After creating the quiz, you can share it with your friends to view their results.
                </p>
                <p>
                    Additionally, you can access quizzes created by your friends and participate in their quizzes.
                </p>
            </div>
        </div>
    );
};

export default QuizGuidePage;

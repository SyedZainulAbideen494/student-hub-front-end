import React from 'react';
import './viewQuizModal.css'; // Make sure to create the necessary CSS

const ViewQuizModal = ({ quizResults, onClose }) => {
    return (
        <div className="results-modal-overlay">
            <div className="results-modal">
                <p onClick={onClose}>x</p>
                <h2>Quiz Results</h2>
                <ul className="results-list">
                    {quizResults.map((result, index) => (
                        <li key={index} className="result-item">
                            <span className="result-quiz-title">{result.user_name}</span><br/>
                            <span className="result-date">Completed At: {result.completed_at}</span><br/>
                            <span className="result-score">Score: {result.score}</span>
                        </li>
                    ))}
                </ul>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ViewQuizModal;

import React from 'react';
import './viewQuizModal.css'; // Make sure to create the necessary CSS

const ViewQuizModal = ({ quizResults, onClose }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const seconds = (`0${date.getSeconds()}`).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    return (
        <div className="results-modal-overlay">
            <div className="results-modal">
                <p onClick={onClose}>x</p>
                <h2>Quiz Results</h2>
                <ul className="results-list">
                    {quizResults.map((result, index) => (
                        <li key={index} className="result-item">
                            <span className="result-quiz-title">{result.user_name}</span><br/>
                            <span className="result-date">Completed At: {formatDate(result.completed_at)}</span><br/>
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

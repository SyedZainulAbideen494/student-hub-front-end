import React from 'react';
import './resultsModal.css'; // Add your modal-specific CSS here

const ResultsModal = ({ results, onClose }) => {
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };


    return (
        <div className="results-modal-overlay">
            <div className="results-modal">
            <p onClick={onClose}>x</p>
                <h2>Your Quiz Results</h2>
                <ul className="results-list">
                    {results.length > 0 ? (
                        results.map(result => (
                            <li key={result.quizId} className="result-item">
                                <span className="result-quiz-title">{result.quizTitle}</span><br/>
                                <span className="result-date">Taken On: {formatDate(result.takenAt)}</span><br/>
                                <span className="result-score">Score: {result.score}</span>
                            </li>
                        ))
                    ) : (
                        <p>No results available.</p>
                    )}
                </ul>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ResultsModal;

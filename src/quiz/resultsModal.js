import React from 'react';
import './resultsModal.css'; // Add your modal-specific CSS here

const ResultsModal = ({ results, onClose }) => {
    return (
        <div className="results-modal-overlay">
            <div className="results-modal">
                <h2>Your Quiz Results</h2>
                <ul className="results-list">
                    {results.length > 0 ? (
                        results.map(result => (
                            <li key={result.quizId} className="result-item">
                                <span className="result-quiz-title">{result.quizTitle}</span><br/>
                                <span className="result-date">Taken On: {result.takenAt}</span><br/>
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

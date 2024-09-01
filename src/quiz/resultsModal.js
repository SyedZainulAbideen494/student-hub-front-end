import React from 'react';
import './resultsModal.css'; // Add your modal-specific CSS here
import { FaTimes, FaInfoCircle, FaStar, FaTrophy, FaQuestionCircle } from 'react-icons/fa'; // Additional icons

const ResultsModal = ({ results, onClose }) => {
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const getHighestScore = () => {
        if (results.length === 0) return {};
        return results.reduce((prev, current) => (prev.score > current.score ? prev : current));
    };

    const getLowestScore = () => {
        if (results.length === 0) return {};
        return results.reduce((prev, current) => (prev.score < current.score ? prev : current));
    };

    const generateAiTip = () => {
        const highest = getHighestScore();
        const lowest = getLowestScore();
        const improvement = highest.score - lowest.score;
        
        if (improvement > 20) return 'Great job! Your scores have improved significantly. Keep up the good work!';
        if (improvement > 0) return 'Good effort! Try to identify areas for improvement to boost your scores further.';
        return 'No significant change in scores. Consider reviewing your study strategies and practices.';
    };

    return (
        <div className="results-modal-overlay">
            <div className="results-modal">
                <div className="modal-header">
                    <h2>Your Quiz Results</h2>
                    <FaTimes className="close-icon" onClick={onClose} />
                </div>
                <div className="results-content">
                    <div className="card-container">
                        <div className="card high-score-card">
                            <FaStar className="card-icon" />
                            <h3>Highest Score</h3>
                            <p>Quiz: {getHighestScore().quizTitle}</p>
                            <p>Date: {formatDate(getHighestScore().takenAt)}</p>
                            <p>Score: {getHighestScore().score}</p>
                        </div>
                        <div className="card low-score-card">
 
                            <h3>Lowest Score</h3>
                            <p>Quiz: {getLowestScore().quizTitle}</p>
                            <p>Date: {formatDate(getLowestScore().takenAt)}</p>
                            <p>Score: {getLowestScore().score}</p>
                        </div>
                    </div>
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
                    <div className="ai-tip">
                        <FaQuestionCircle className="info-icon" />
                        <p>{generateAiTip()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsModal;
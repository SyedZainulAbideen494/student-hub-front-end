import React, { useState } from 'react';
import './viewQuizModal.css'; // Ensure the necessary CSS is updated
import { FaSortAmountDown, FaSortAmountUp, FaFilter } from 'react-icons/fa';

const ViewQuizModal = ({ quizResults, onClose }) => {
    const [sortedResults, setSortedResults] = useState(quizResults);
    const [sortOrder, setSortOrder] = useState('desc');
    const [filter, setFilter] = useState('');

    // Format date function
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

    // Sorting function
    const handleSort = (order) => {
        setSortOrder(order);
        const sorted = [...quizResults].sort((a, b) => 
            order === 'asc' ? a.score - b.score : b.score - a.score
        );
        setSortedResults(sorted);
    };

    // Filtering function
    const handleFilter = (e) => {
        setFilter(e.target.value);
        const filtered = quizResults.filter(result => 
            result.user_name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setSortedResults(filtered);
    };

    // Get highest and lowest scores
    const highestScore = Math.max(...quizResults.map(result => result.score));
    const lowestScore = Math.min(...quizResults.map(result => result.score));
    const highestResult = quizResults.find(result => result.score === highestScore);
    const lowestResult = quizResults.find(result => result.score === lowestScore);

    return (
        <div className="results-modal-overlay-quiz-results-modal-indivdual">
            <div className="results-modal-quiz-results-modal-indivdual">
                <div className="modal-header-quiz-results-modal-indivdual">
                    <h2>Quiz Results</h2>
                    <p onClick={onClose} className="close-icon-quiz-results-modal-indivdual">x</p>
                </div>
                <div className="filters-quiz-results-modal-indivdual">
                    <input
                        type="text"
                        placeholder="Filter by User Name"
                        value={filter}
                        onChange={handleFilter}
                    />
                </div>
                <div className="score-summary-quiz-results-modal-indivdual">
                    <div className="score-card">
                        <h3>Highest Score</h3>
                        <span>Name: {highestResult.user_name}</span>
                        <span>Score: {highestScore}</span>
                        <span>Taken At: {formatDate(highestResult.completed_at)}</span>
                    </div>
                    <div className="score-card">
                        <h3>Lowest Score</h3>
                        <span>Name: {lowestResult.user_name}</span>
                        <span>Score: {lowestScore}</span>
                        <span>Taken At: {formatDate(lowestResult.completed_at)}</span>
                    </div>
                </div>
                <ul className="results-list-quiz-results-modal-indivdual">
                    {sortedResults.map((result, index) => (
                        <li key={index} className="result-item-quiz-results-modal-indivdual">
                            <span className="result-quiz-title-quiz-results-modal-indivdual">{result.user_name}</span><br/>
                            <span className="result-date-quiz-results-modal-indivdual">Completed At: {formatDate(result.completed_at)}</span><br/>
                            <span className="result-score-quiz-results-modal-indivdual">Score: {result.score}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ViewQuizModal;
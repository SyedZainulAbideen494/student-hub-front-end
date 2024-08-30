import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import CountUp from 'react-countup';
import axios from 'axios';
import './SubmitQuiz.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const SubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const [countUpFinished, setCountUpFinished] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch previous results from the backend
    axios.post(API_ROUTES.quizResultsPageAllresults, { token })
      .then(response => {
        setPreviousResults(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching previous results:', error);
      });
  }, [token]);

  const handleCountUpEnd = () => {
    setCountUpFinished(true);
  };

  return (
    <div className="submit-page-quiz-complete">
      <header className="header-quiz-complete">
        <button className="back-button-quiz-complete" onClick={() => navigate('/quiz/home')}>&larr;</button>
        <h1>Quiz Result</h1>
      </header>
      <div className="card-quiz-complete">
        {countUpFinished && score > 70 && <Confetti />}
        <p className="message-quiz-complete">
          {score > 70 ? 'Awesome job!' : 'Keep practicing!'}
        </p>
        <div className="score-container-quiz-complete">
          <CountUp
            start={0}
            end={score}
            duration={3}
            onEnd={handleCountUpEnd}
            className="score-text-quiz-complete"
          />
          %
        </div>
      </div>
      <div className="previous-results-quiz-complete">
        <h2>Previous Results</h2>
        {previousResults.map(result => (
          <div key={result.quiz_id} className="result-item-quiz-complete">
            <div className="result-header-quiz-complete">
              <div className="quiz-name-quiz-complete">{result.quiz_title}</div>
              <div className="score-quiz-complete">{result.score}%</div>
            </div>
            <div className="completed-at-quiz-complete">
              Completed At: {new Date(result.completed_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitPage;
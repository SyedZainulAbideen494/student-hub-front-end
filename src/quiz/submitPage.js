import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import CountUp from 'react-countup';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useSpring, animated } from 'react-spring';
import './SubmitQuiz.css';

const tips = [
  "Great job! Keep practicing to improve even more.",
  "Awesome work! Try to maintain this streak.",
  "Excellent score! You're on the right track.",
  "Good effort! Check out more quizzes to challenge yourself.",
  "Well done! Remember, practice makes perfect."
];

const getRandomTip = () => tips[Math.floor(Math.random() * tips.length)];

const SubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const quizId = location.state?.quizId;
  const [countUpFinished, setCountUpFinished] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);

  const token = localStorage.getItem('token');

  const [scoreAnimationProps, setScoreAnimationProps] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.8)',
  }));

  useEffect(() => {
    // Sound effect on score completion
    const finishSound = new Audio('/sounds/game-bonus-144751.mp3')
    finishSound.play();

    // Animation trigger for score and feedback
    setScoreAnimationProps({ opacity: 1, transform: 'scale(1)' });

    axios.post(API_ROUTES.quizResultsPageAllresults, { token })
      .then(response => {
        setPreviousResults(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching previous results:', error);
      });
  }, [token, setScoreAnimationProps]);

  const handleCountUpEnd = () => {
    setCountUpFinished(true);
  };

  const getMessage = () => {
    if (score > 90) return 'Exceptional!';
    if (score > 70) return 'Awesome job!';
    if (score > 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div className="submit-page-quiz-complete">
      <header className="header-quiz-complete">
        <button className="back-button-quiz-complete" onClick={() => navigate('/quiz/home')}>&larr;</button>
        <h1>Quiz Result</h1>
      </header>
      <div className="card-quiz-complete">
        {countUpFinished && score > 70 && <Confetti />}
        <p className="message-quiz-complete">{getMessage()}</p>
        
        {/* Animated Score */}
        <animated.div style={scoreAnimationProps} className="score-container-quiz-complete">
          <CountUp
            start={0}
            end={score}
            duration={3}
            onEnd={handleCountUpEnd}
            className="score-text-quiz-complete"
          />
          %
        </animated.div>

        <p className="tip-quiz-complete">{getRandomTip()}</p>
        <button
          className="answers-button-quiz-complete"
          onClick={() => navigate(`/quiz/answers/${quizId}`)} // Navigate to answers page with quiz ID
        >
          View Answers
        </button>
      </div>

      <div className="previous-results-quiz-complete">
        <h2>Previous Results</h2>
        {previousResults.length > 0 ? (
          previousResults.map(result => (
            <div key={result.quiz_id} className="result-item-quiz-complete">
              <div className="result-header-quiz-complete">
                <div className="quiz-name-quiz-complete">{result.quiz_title}</div>
                <div className="score-quiz-complete">{result.score}%</div>
              </div>
              <div className="completed-at-quiz-complete">
                Completed At: {new Date(result.completed_at).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p>No previous results available.</p>
        )}
      </div>
    </div>
  );
};

export default SubmitPage;

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
  const userAnswers = location.state?.userAnswers || {};
  const correctAnswers = location.state?.correctAnswers || {};
  const [questions, setQuestions] = useState([]);
  const [countUpFinished, setCountUpFinished] = useState(false);

  const [scoreAnimationProps, setScoreAnimationProps] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.8)',
  }));

  useEffect(() => {
    axios.get(`${API_ROUTES.getQuiz}/${quizId}`)
      .then((response) => {
        setQuestions(response.data.questions);
      })
      .catch((error) => {
        console.error('Error fetching quiz questions:', error);
      });

    // Trigger animation for the score display
    setScoreAnimationProps({ opacity: 1, transform: 'scale(1)' });

    if (score > 70) {
      // Play success sound for high scores
      const finishSound = new Audio('/sounds/game-bonus-144751.mp3');
      finishSound.play();
    }
  }, [quizId, score, setScoreAnimationProps]);

  const handleCountUpEnd = () => {
    setCountUpFinished(true);
  };

  const renderAnswerComparison = () => {
    return questions.map((question) => {
      const userAnswerId = userAnswers[question.id];
      const correctAnswer = correctAnswers[question.id];
      const isCorrect = userAnswerId === correctAnswer?.id;
  
      return (
        <div
          key={question.id}
          className={`render__Quiz__Result__Question__Container ${
            isCorrect ? 'render__Quiz__Result__Correct' : 'render__Quiz__Result__Incorrect'
          }`}
        >
          <p className="render__Quiz__Result__Question__Text">{question.question_text}</p>
          <p className="render__Quiz__Result__User__Answer">
            Your Answer:
            <span
              className={`${
                isCorrect
                  ? 'render__Quiz__Result__Correct__Answer'
                  : 'render__Quiz__Result__Incorrect__Answer'
              }`}
            >
              {question.answers.find((ans) => ans.id === userAnswerId)?.answer_text || 'Not Answered'}
            </span>
          </p>
          {!isCorrect && correctAnswer && (
            <p className="render__Quiz__Result__Correct__Answer__Container">
              Correct Answer:
              <span className="render__Quiz__Result__Correct__Answer__Highlight">
                {correctAnswer.text}
              </span>
            </p>
          )}
        </div>
      );
    });
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

        {/* Animated Score Display */}
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
          onClick={() => navigate(`/quiz/answers/${quizId}`)}
        >
          Answers
        </button>
      </div>

      {/* Answer Comparison Section */}
      <div className="answer-comparison-container">
        <h2>Answer Comparison</h2>
        {questions.length > 0 ? renderAnswerComparison() : <p>Loading answers...</p>}
      </div>
    </div>
  );
};

export default SubmitPage;

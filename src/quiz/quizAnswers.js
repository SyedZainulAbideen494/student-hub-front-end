import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizAnswersPage.css'; // CSS file for styling
import { API_ROUTES } from '../app_modules/apiRoutes';

const QuizAnswersPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizAnswers = async () => {
      try {
        const response = await axios.get(`${API_ROUTES.getQuizAnswers}/${params.id}`);
        console.log('Fetched quiz data:', response.data);
        setQuiz(response.data);
      } catch (error) {
        setError('Failed to load quiz answers');
        console.error('Error fetching quiz answers:', error);
      }
    };

    fetchQuizAnswers();
  }, [params.id]);

  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="quiz-answers-page__quiz__Answer__page">
    {/* Header */}
    <header className="quiz-header__quiz__Answer__page">
      <button className="back-button__quiz__Answer__page" onClick={() => navigate(-1)}>
        ← 
      </button>
      <h1 className="quiz-title__quiz__Answer__page">{quiz.title}</h1>
    </header>

    <p className="quiz-description__quiz__Answer__page">{quiz.description}</p>

    {quiz.questions.map((question, index) => (
      <section key={index} className="question-section__quiz__Answer__page">
        <h2 className="question-title__quiz__Answer__page">Question {index + 1}: {question.question_text}</h2>
        <ul className="answer-list__quiz__Answer__page">
          {question.answers.map((answer, answerIndex) => (
            <li
              key={answerIndex}
              className={`answer-item__quiz__Answer__page ${answer.is_correct ? 'correct__quiz__Answer__page' : 'incorrect__quiz__Answer__page'}`}
            >
              {answer.answer_text} {answer.is_correct ? '(Correct)' : '(Incorrect)'}
            </li>
          ))}
        </ul>
        {/* Display explanation below all answers */}
        <div className="explanation-section__quiz__Answer__page">
          <p className="explanation-text__quiz__Answer__page">
            {question.answers.length > 0 && question.answers[0].explanation ? (
              <em>Explanation: {question.answers[0].explanation}</em>
            ) : (
              <em>No explanation available.</em>
            )}
          </p>
        </div>
      </section>
    ))}
  </div>
  );
};

export default QuizAnswersPage;

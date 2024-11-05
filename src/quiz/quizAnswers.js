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
        // Use params.quizId to ensure you are fetching the correct quiz
        const response = await axios.get(`${API_ROUTES.getQuizAnswers}/${params.id}`); // Ensure the parameter matches
        console.log('Fetched quiz data:', response.data); // Log fetched data for debugging
        setQuiz(response.data);
      } catch (error) {
        setError('Failed to load quiz answers');
        console.error('Error fetching quiz answers:', error);
      }
    };

    fetchQuizAnswers();
  }, [params.quizId]);

  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="quiz-answers-page__quiz__ans__page">
      {/* Header */}
      <header className="quiz-header__quiz__ans__page">
        <button className="back-button__quiz__ans__page" onClick={() => navigate(-1)}>
          ← 
        </button>
        <h1>{quiz.title}</h1>
      </header>

      <p className="quiz-description__quiz__ans__page">{quiz.description}</p>

      {quiz.questions.map((question, index) => (
        <section key={index} className="question-section__quiz__ans__page">
          <h2>Question {index + 1}: {question.question_text}</h2>
          <ul className="answer-list__quiz__ans__page">
            {question.answers.map((answer, answerIndex) => (
              <li
                key={answerIndex}
                className={`answer-item__quiz__ans__page ${answer.is_correct ? 'correct__quiz__ans__page' : 'incorrect__quiz__ans__page'}`}
              >
                {answer.answer_text} {answer.is_correct ? '(Correct)' : '(Incorrect)'}
              </li>
            ))}
          </ul>
          {/* Display explanation below all answers */}
          <div className="explanation-section">
            {question.answers.length > 0 && question.answers[0].explanation ? (
              <p className="explanation-text"><em>Explanation: {question.answers[0].explanation}</em></p>
            ) : (
              <p className="explanation-text"><em>No explanation available.</em></p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default QuizAnswersPage;

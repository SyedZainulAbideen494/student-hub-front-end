import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './GenerateQuiz.css'; // Import the new CSS file

const GenerateQuiz = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const generateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(API_ROUTES.generateAiQuiz, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, topic, token }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      navigate(`/quiz/${data.quizId}`);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-quiz-container__quiz__ai__gen">
      <header className="header__quiz__ai__gen">
        <button className="back-button__quiz__ai__gen" onClick={() => navigate(-1)}>
          ←
        </button>
      </header>
      <h1 className="title__quiz__ai__gen">Generate Quiz</h1>
      <form onSubmit={generateQuiz} className="generate-quiz-form__quiz__ai__gen">
        <label className="label__quiz__ai__gen">
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input__quiz__ai__gen"
            required
          />
        </label>
        <label className="label__quiz__ai__gen">
          Topic (name):
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input__quiz__ai__gen"
            required
          />
        </label>
        <div className="centered-button-container">
        <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  onClick={generateQuiz}
  disabled={loading}
>
  <div className={`sparkle__set__page__buttons ${loading ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {loading ? 'Generating...' : '  Generate Quiz'}
    </span>
  </div>
</button>
</div>
      </form>
      {error && <p className="error-message__quiz__ai__gen">Error: {error}</p>}
    </div>
  );
};

export default GenerateQuiz;

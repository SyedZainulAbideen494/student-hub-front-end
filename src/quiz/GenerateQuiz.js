import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './GenerateQuiz.css'; // Import the new CSS file
import axios from 'axios';
import { FaSearch, FaShareAlt, FaEye, FaTrash, FaPlus, FaPlay } from 'react-icons/fa';

const GenerateQuiz = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);


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
        throw new Error('Failed to generate quiz, please try again');
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

  useEffect(() => {
    const fetchQuizzes = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(API_ROUTES.getUserQuizzes, { token });
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    fetchQuizzes();
}, []);

const filteredQuizzes = quizzes.filter(quiz =>
  quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const handleQuizAnswers = (quizId) => {
  navigate(`/quiz/answers/${quizId}`); // Navigate to the quiz answers page with the quiz ID
};

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store the selected file
  };

  const generateQuizFromPDF = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Extract the file from the form
    const file = selectedFile;

    // Validation check for missing fields
    if (!file || !subject || !topic) {
      alert('Please upload a PDF, and provide both a subject and a topic before generating the quiz.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('subject', subject);
    formData.append('topic', topic);
    formData.append('token', token);

    try {
      const response = await fetch(API_ROUTES.generateQuizFromPDF, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz from PDF, please try again');
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
    <div>
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

    <form onSubmit={generateQuizFromPDF} className="generate-quiz-form">
      <p>Or Generate from PDF</p>
      <label className="file-input-label">
        <input
          type="file"
          accept="application/pdf"
          required
          className="file-input"
          onChange={handleFileChange}
        />
        <span>Choose File</span>
      </label>

      {/* Display selected file name */}
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      <div className="centered-button-container">
        <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  disabled={loading}
  type='submit'
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
      {loading ? 'Generating...' : '  Generate From PDF'}
    </span>
  </div>
</button>
</div>
    </form>
      {error && <p className="error-message__quiz__ai__gen">Error: {error}</p>}
    </div>
          {quizzes.length === 0 ? (
            <div className="no_quiz_found_container" style={{marginTop:'20px'}}>
            <div className="no-quizzes-message">
                <p>No quizzes found. Create your first quiz!</p>
            </div>
            <div className="card_no-quizzes"></div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', width: '100%' }}>
  <h2 className="quizzes-heading" style={{ marginTop: '20px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
    Your Quizzes
  </h2>
  <ul className="quizzes-list-home-page-quiz-page" style={{ marginTop: '20px', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
    {filteredQuizzes.map(quiz => (
      <li key={quiz.id} className="quiz-item-home-page-quiz-page">
        <div className="quiz-header">
          <span className="quiz-title-home-page-quiz-page" onClick={() => navigate(`/quiz/${quiz.id}`)}>
            {quiz.title}
          </span><br /><br />
          <span className="quiz-date-home-page-quiz-page">Created At: {formatDate(quiz.created_at)}</span>
        </div><br />
        <div className="quiz-actions-quiz-page">
          <button className="delete-button-home-page-quiz-page" onClick={() => navigate(`/quiz/${quiz.id}`)}>
            <FaPlay />
          </button>
          <button 
                    className="view-answers-button-home-page-quiz-page" 
                    onClick={() => handleQuizAnswers(quiz.id)} 
                    aria-label="View Quiz Answers"
                >
                    <div className="view-answers-content">
                        <FaEye />
                        <span> View Answers</span>
                    </div>
                </button>
        </div>
      </li>
    ))}
  </ul>
</div>

      )}
      </div>
  );
};

export default GenerateQuiz;

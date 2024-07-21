import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import ShareQuizModal from './shareQuizModal';
import ResultsModal from './resultsModal';
import './quiz.css';
import ViewQuizModal from './viewQuizModal'; // Import the ViewQuizModal component

const QuizHomePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showViewQuizModal, setShowViewQuizModal] = useState(false); // State for view quiz modal
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [results, setResults] = useState([]);
    const [quizResults, setQuizResults] = useState([]); // State for storing quiz results
    const navigate = useNavigate();

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

    const handleCreateQuiz = () => {
        navigate('/quiz/create');
    };

    const handleShareClick = (quiz) => {
        setSelectedQuiz(quiz);
        setShowModal(true);
    };

    const handleResultsClick = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(API_ROUTES.getUserResults, { token });
            setResults(response.data);
            setShowResultsModal(true);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const handleViewQuizClick = async (quizId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(API_ROUTES.getQuizResults, { token, quizId });
            setQuizResults(response.data);
            setShowViewQuizModal(true);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedQuiz(null);
    };

    const handleCloseResultsModal = () => {
        setShowResultsModal(false);
    };

    const handleCloseViewQuizModal = () => {
        setShowViewQuizModal(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="quiz-home-page">
        <div className="button-group">
            <button onClick={handleCreateQuiz} className="create-quiz-button-home-page">Create Quiz</button>
            <button onClick={handleResultsClick} className="results-button-home-page">My Results</button>
        </div>
        <h2 className="quizzes-title-home-page" style={{marginBottom: '40px', marginTop: '40px'}}>Your Quizzes</h2>
        <ul className="quizzes-list-home-page">
            {quizzes.map(quiz => (
                <li key={quiz.id} className="quiz-item-home-page">
                    <div className="quiz-header">
                        <span className="quiz-title-home-page" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                            {quiz.title}
                        </span>
                        <span className="quiz-date-home-page">Created At: {formatDate(quiz.created_at)}</span>
                    </div>
                    <div className="quiz-actions">
                        <button className="share-button-home-page" onClick={() => handleShareClick(quiz)}>
                            Share
                        </button>
                        <button className="view-results-button-home-page" onClick={() => handleViewQuizClick(quiz.id)}>
                            View Results
                        </button>
                    </div>
                </li>
            ))}
        </ul>
        {showModal && (
            <ShareQuizModal
                quizId={selectedQuiz.id}
                onClose={handleCloseModal}
            />
        )}
        {showResultsModal && (
            <ResultsModal
                results={results}
                onClose={handleCloseResultsModal}
            />
        )}
        {showViewQuizModal && (
            <ViewQuizModal
                quizResults={quizResults}
                onClose={handleCloseViewQuizModal}
            />
        )}
        <FooterNav />
    </div>
    );
};

export default QuizHomePage;
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
            <button onClick={handleCreateQuiz} className="create-quiz-button" style={{marginRight: '40px'}}>Create Quiz</button>
            <button onClick={handleResultsClick} className="create-quiz-button">My Results</button>
            <h2 className="quizzes-title">Your Quizzes</h2>
            <ul className="quizzes-list">
                {quizzes.map(quiz => (
                    <li key={quiz.id} className="quiz-item">
                        <span className="quiz-title" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                            {quiz.title}
                        </span><br/><br/>
                        <span className="quiz-date">Created At: {formatDate(quiz.created_at)}</span><br/><br/>
                        <button className="share-button" onClick={() => handleShareClick(quiz)}>
                            Share
                        </button>
                        <button className="share-button" onClick={() => handleViewQuizClick(quiz.id)}>
                            View Results
                        </button>
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
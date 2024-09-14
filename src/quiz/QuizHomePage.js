import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import ShareQuizModal from './shareQuizModal';
import ResultsModal from './resultsModal';
import ViewQuizModal from './viewQuizModal';
import { FaSearch, FaShareAlt, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import DeleteConfirmationModal from './confrimDeleteModal';
import './quiz.css';

const QuizHomePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showViewQuizModal, setShowViewQuizModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [results, setResults] = useState([]);
    const [quizResults, setQuizResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);

    const handleDeleteClick = (quizId) => {
        setQuizToDelete(quizId);
        setShowDeleteConfirmationModal(true);
    };

    const handleDeleteConfirm = async (quizId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(API_ROUTES.deleteQuiz, { token, quizId });
            setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
        setShowDeleteConfirmationModal(false);
    };
    
    const handleCloseDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(false);
        setQuizToDelete(null);
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

    const handleCreateQuiz = () => {
        navigate('/quiz/create');
    };

// In QuizHomePage
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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

    return (
        <div className="quiz-home-page-quiz-page">
            <div className="quiz-header-container-quiz-page">
                <div className="search-bar-quiz-page">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ border: 'none' }}
                    />
                </div>
                <div className="quiz-header-buttons-quiz-page">
                    <button onClick={handleCreateQuiz} className="create-quiz-button-home-page-quiz-page">
                        Create Quiz
                    </button>
                    <button onClick={handleResultsClick} className="results-button-home-page-quiz-page">
                        My Results
                    </button>
                </div>
            </div>
            <h2 className="quizzes-title-home-page-quiz-page">Your Quizzes</h2>
            {quizzes.length === 0 ? (
                <div className="no-quizzes-message">
                    <p>No quizzes found. Create your first quiz!</p>
                    <button onClick={handleCreateQuiz} className="create-first-quiz-button">
                        <FaPlus /> Create Quiz
                    </button>
                </div>
            ) : (
                <ul className="quizzes-list-home-page-quiz-page">
                    {filteredQuizzes.map(quiz => (
                        <li key={quiz.id} className="quiz-item-home-page-quiz-page">
                            <div className="quiz-header">
                                <span className="quiz-title-home-page-quiz-page" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                                    {quiz.title}
                                </span><br /><br />
                                <span className="quiz-date-home-page-quiz-page">Created At: {formatDate(quiz.created_at)}</span>
                            </div><br />
                            <div className="quiz-actions-quiz-page">
                                <button className="share-button-home-page-quiz-page" onClick={() => handleShareClick(quiz)}>
                                    <FaShareAlt />
                                </button>
                                <button className="view-results-button-home-page-quiz-page" onClick={() => handleViewQuizClick(quiz.id)}>
                                    <FaEye /> View Results
                                </button>
                                <button className="delete-button-home-page-quiz-page" onClick={() => handleDeleteClick(quiz.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showModal && <ShareQuizModal quiz={selectedQuiz} onClose={handleCloseModal} />}
            {showResultsModal && <ResultsModal results={results} onClose={handleCloseResultsModal} />}
            {showViewQuizModal && <ViewQuizModal quizResults={quizResults} onClose={handleCloseViewQuizModal} />}
            {showDeleteConfirmationModal && <DeleteConfirmationModal quizId={quizToDelete} onConfirm={handleDeleteConfirm} onClose={handleCloseDeleteConfirmationModal} />}
            <FooterNav />
        </div>
    );
};

export default QuizHomePage;
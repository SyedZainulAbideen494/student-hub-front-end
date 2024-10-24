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
import QuizPageTutorial from './QuizPageTutorial';


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
    const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility

    useEffect(() => {
        // Check local storage for tutorial completion status
        const completed = localStorage.getItem('quizPageTutorialComplete');
        if (completed) {
            setShowTutorial(false); // Set showTutorial to false if found
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false); // Hide tutorial when complete
        localStorage.setItem('quizPageTutorialComplete', 'true'); // Store completion status in local storage
    };


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

    const handleGuideClick = () => {
        navigate('/quiz/guide')
    }

    return (
        <div className="quiz-home-page-quiz-page">
             {showTutorial && <QuizPageTutorial onComplete={handleTutorialComplete} />}
            <div className="quiz-header-container-quiz-page">
<div className='search-bar-container'>
                <form className="form__search__bar__quiz__page">
      <button>
          <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
              <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
      </button>
      <input 
                     className="input__search__bar__quiz__page"  
                     type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ border: 'none' }}/>
      <button className="reset__search__bar__quiz__page" type="reset">
          <svg className='svg__search__bar__quiz__page' xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
      </button>
  </form>
  </div>

                <div className="quiz-header-buttons-quiz-page">
    <button className='quiz-create-btn-home-page' onClick={handleCreateQuiz}>
        <span className='quiz-create-btn-home-page-span'>
            <svg
                height="20"
                width="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path>
            </svg>
            Create
        </span>
    </button>

    <button className='quiz-create-btn-home-page' onClick={handleResultsClick}>
        <span className='quiz-create-btn-home-page-span'>
            <svg
                height="20"
                width="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 9h2v10H5V9zm6-4h2v14h-2V5zm6 8h2v6h-2v-6z" fill="currentColor"></path>
            </svg>
            My Results
        </span>
    </button>

    <button className='quiz-create-btn-home-page' onClick={handleGuideClick}>
    <span className='quiz-create-btn-home-page-span'>
        <svg
            height="20"
            width="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h16V4H4zm6 2h4v2h-4V6zm0 4h4v2h-4v-2zm-6 6h12v2H4v-2z" fill="currentColor"></path>
        </svg>
        Guide
    </span>
</button>

</div>


            </div>
            {quizzes.length === 0 ? (
                  <div className="no_quiz_found_container">
                  <div className="no-quizzes-message">
                      <p>No quizzes found. Create your first quiz!</p>
                  </div>
                  <div className="card_no-quizzes"></div>
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
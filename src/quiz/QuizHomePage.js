import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import ShareQuizModal from './shareQuizModal'; // Import your new ShareModal component
import './quiz.css';

const QuizHomePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
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

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedQuiz(null);
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
            <button onClick={handleCreateQuiz} className="create-quiz-button">Create Quiz</button>
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
                    </li>
                ))}
            </ul>
            {showModal && (
                <ShareQuizModal
                    quizId={selectedQuiz.id}
                    onClose={handleCloseModal}
                />
            )}
            <FooterNav />
        </div>
    );
};

export default QuizHomePage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import './quiz.css';

const QuizHomePage = () => {
    const [quizzes, setQuizzes] = useState([]);
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
                    <li key={quiz.id} className="quiz-item" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                        <span className="quiz-title">{quiz.title}</span>
                        <span className="quiz-date">Date: {formatDate(quiz.created_at)}</span>
                    </li>
                ))}
            </ul>
            <FooterNav />
        </div>
    );
};

export default QuizHomePage;
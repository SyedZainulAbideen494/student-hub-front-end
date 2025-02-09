import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './QuizPage.css';

const QuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null); // Timer state
    const [timeUp, setTimeUp] = useState(false); // To track if time is up
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // Load audio file
    const submitSound = new Audio('/sounds/level-up-191997.mp3'); 

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/sign-up');
                return;
            }
            try {
                const response = await axios.post(API_ROUTES.userSessionAut, { token });
                if (!response.data.valid) {
                    navigate('/sign-up');
                }
            } catch (error) {
                console.error('Error during token validation:', error);
                navigate('/sign-up');
            }
        };

        setTimeout(validateToken, 500);
    }, [navigate]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getQuiz}/${id}`);
                setQuiz(response.data.quiz);
                setQuestions(response.data.questions);

                // If it's a competitive quiz, start the timer
                if (response.data.quiz.is_competive === '1') {
                    setTimeLeft(45 * 60); // 40 minutes in seconds
                }
                console.log(response.data.quiz.is_competive)
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        fetchQuiz();
    }, [id]);

    // Timer logic
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 1) {
                    clearInterval(timerInterval);
                    handleSubmitQuiz(); // Auto-submit when time runs out
                    setTimeUp(true); // Mark time as up
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswerChange = (qId, aId) => {
        setAnswers({ ...answers, [qId]: aId });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            submitSound.play(); 
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (timeUp) return; // Prevent multiple submissions
    
        try {
            const token = localStorage.getItem('token');
    
            // Fetch quiz details to check if it's competitive and get its type
            const quizResponse = await axios.get(`${API_ROUTES.getQuiz}/${id}`);
            const { is_competive, type } = quizResponse.data.quiz;
    
            const answersArray = Object.entries(answers).map(([questionId, answerId]) => ({
                questionId: parseInt(questionId, 10),
                answerId: parseInt(answerId, 10),
            }));
    
            let submitApiUrl = API_ROUTES.submitQuiz; // Default for non-competitive quizzes
    
            if (is_competive === '1') {
                submitApiUrl = API_ROUTES.submitCompetitiveQuiz; // Single API for all competitive quizzes
            }
    
            // Submit answers to the API
            const response = await axios.post(submitApiUrl, {
                token,
                quizId: parseInt(id, 10),
                type, // Send exam type for proper grading
                answers: answersArray,
            });
    
            const score = response.data.score;
            const correctAnswers = response.data.correctAnswers;
    
            // Navigate to results page with score & correct answers
            navigate('/quiz/submit', {
                state: { score, quizId: id, userAnswers: answers, correctAnswers }
            });
        } catch (error) {
            console.error('Error submitting quiz:', error.response || error.message);
            alert('An error occurred while submitting the quiz. Please try again later.');
        }
    };
    

    return (
        <div className="quiz-page-attend">
            {quiz && (
                <>
                    <div className="quiz-header-attend">
                        <button onClick={() => navigate('/quiz/home')} className="back-arrow-attend">
                            ←
                        </button>
                        <h2 className="quiz-title-attend">{quiz.title}</h2>
                        <p className="quiz-progress">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                        {quiz.is_competive === '1' && (
                            <div className="quiz-timer">
                                Time Left: {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>

                    {timeUp ? (
                        <div className="time-up-message">
                            <h2>Time's Up!</h2>
                            <p>Your quiz has been auto-submitted.</p>
                        </div>
                    ) : (
                        <div className="quiz-container-attend">
                            <div className="question-container-attend">
                                <p className="question-text-attend">{questions[currentQuestionIndex]?.question_text}</p>
                                {questions[currentQuestionIndex]?.answers.map((answer) => (
                                    <div key={answer.id} className="answer-container-attend">
                                        <input
                                            type="radio"
                                            name={`question${questions[currentQuestionIndex].id}`}
                                            value={answer.id}
                                            checked={answers[questions[currentQuestionIndex].id] === answer.id}
                                            onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, answer.id)}
                                            className="answer-radio-attend"
                                        />
                                        <span className="answer-text-attend">{answer.answer_text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="quiz-footer-attend">
                                {currentQuestionIndex > 0 && (
                                    <button onClick={handlePrevious} className="navigation-button-attend">
                                        Previous Question
                                    </button>
                                )}
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="navigation-button-attend"
                                        disabled={!answers[questions[currentQuestionIndex].id]}
                                    >
                                        Submit Answer
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmitQuiz}
                                        className="navigation-button-attend"
                                        disabled={!answers[questions[currentQuestionIndex].id]}
                                    >
                                        Submit Quiz
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default QuizPage;

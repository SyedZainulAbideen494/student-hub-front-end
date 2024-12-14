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
    const navigate = useNavigate();
    const nav = useNavigate()
    const token = localStorage.getItem('token');
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
          const token = localStorage.getItem('token');
          console.log('Token from local storage:', token); // Debugging
    
          // If no token, redirect to login
          if (!token) {
            console.log('No token found, redirecting to sign-up.');
            nav('/sign-up');
            return;
          }
    
          try {
            const response = await axios.post(API_ROUTES.userSessionAut, { token });
            console.log('Token validation response:', response.data); // Debugging
            if (!response.data.valid) {
              console.log('Invalid token, redirecting to sign-up.');
              nav('/sign-up');
            }
          } catch (error) {
            console.error('Error during token validation:', error);
            nav('/sign-up');
          }
        };
    
        // Delay the validation by 5 seconds
        const timeoutId = setTimeout(() => {
          validateToken();
        }, 500);
    
        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId);
    }, [nav]);


    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getQuiz}/${id}`);
                setQuiz(response.data.quiz);
                setQuestions(response.data.questions);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        fetchQuiz();
    }, [id]);

    const handleAnswerChange = (qId, aId) => {
        setAnswers({ ...answers, [qId]: aId });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            const token = localStorage.getItem('token');
            const answersArray = Object.entries(answers).map(([questionId, answerId]) => ({
                questionId: parseInt(questionId, 10),
                answerId: parseInt(answerId, 10),
            }));
    
            const response = await axios.post(`${API_ROUTES.submitQuiz}`, {
                token,
                quizId: parseInt(id, 10),
                answers: answersArray,
            });
    
            const score = response.data.score;
            setScore(score);
            navigate('/quiz/submit', { state: { score, quizId: id } }); // Pass quiz ID here
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
                    </div>

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
                </>
            )}
        </div>
    );
};

export default QuizPage;
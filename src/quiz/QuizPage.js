import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './quiz.css'

const QuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const navigate = useNavigate();

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

 
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Convert answers object to an array of objects with answerId and questionId properties
            const answersArray = Object.entries(answers).map(([questionId, answerId]) => ({
                questionId: parseInt(questionId, 10),
                answerId: parseInt(answerId, 10)
            }));
            
            const response = await axios.post(`${API_ROUTES.submitQuiz}`, {
                token,
                quizId: parseInt(id, 10),
                answers: answersArray
            });
      
            const score = response.data.score;
            setScore(score);
      
            if (score > 70) {
                navigate('/quiz/submit', { state: { score } });
            } else {
                navigate('/quiz/submit', { state: { score } });
            }
        } catch (error) {
            console.error('Error submitting quiz:', error.response || error.message);
            alert('An error occurred while submitting the quiz. Please try again later.');
        }
    };

    return (
        <div className="quiz-page">
        {quiz && (
            <div className="quiz-container">
                <h2 className="quiz-title">{quiz.title}</h2>
                <p className="quiz-description">{quiz.description}</p>
                {questions.map((question) => (
                    <div key={question.id} className="question-container">
                        <p className="question-text">{question.question_text}</p>
                        {question.answers.map((answer) => (
                            <div key={answer.id} className="answer-container">
                                <input
                                    type="radio"
                                    name={`question${question.id}`}
                                    value={answer.id}
                                    onChange={() => handleAnswerChange(question.id, answer.id)}
                                    className="answer-radio"
                                />
                                <span className="answer-text">{answer.answer_text}</span>
                            </div>
                        ))}
                    </div>
                ))}
                <button onClick={handleSubmit} className="submit-button">Submit Quiz</button>
            </div>
        )}
    </div>
    );
};

export default QuizPage;
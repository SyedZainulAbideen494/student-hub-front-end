import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './quiz.css'
import FooterNav from '../app_modules/footernav';

const CreateQuizPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ text: '', answers: [{ text: '', is_correct: false }] }]);
    const navigate = useNavigate();

    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', answers: [{ text: '', is_correct: false }] }]);
    };

    const handleAddAnswer = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].answers.push({ text: '', is_correct: false });
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].text = event.target.value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers[aIndex].text = event.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectChange = (qIndex, aIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.forEach((answer, index) => {
            answer.is_correct = index === aIndex;
        });
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        await axios.post(API_ROUTES.createQuiz, { token, title, description, questions });
        navigate('/quiz/home');
    };

    return (
        <div className="create-quiz-page">
        <h2 className="create-quiz-title">Create Quiz</h2>
        <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="quiz-title-input"
        />
        <textarea
            placeholder="Quiz Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="quiz-description-textarea"
        />
        {questions.map((question, qIndex) => (
            <div key={qIndex} className="question-section">
                <input
                    type="text"
                    placeholder="Question"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    className="question-input"
                />
                {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="answer-section">
                        <input
                            type="text"
                            placeholder="Answer"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                            className="answer-input"
                        />
                        <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={answer.is_correct}
                            onChange={() => handleCorrectChange(qIndex, aIndex)}
                            className="correct-answer-radio"
                        />
                    </div>
                ))}
                <button onClick={() => handleAddAnswer(qIndex)} className="add-answer-button">Add Answer</button>
            </div>
        ))}
        <button onClick={handleAddQuestion} className="add-question-button">Add Question</button>
        <button onClick={handleSubmit} className="submit-quiz-button">Create Quiz</button>
        <FooterNav/>
    </div>
    );
};

export default CreateQuizPage;
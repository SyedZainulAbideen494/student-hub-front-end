import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './createQuiz.css';
import FooterNav from '../app_modules/footernav';
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const CreateQuizPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ text: '', answers: [{ text: '', is_correct: false }] }]);
    const [showInstructions, setShowInstructions] = useState(false);
    const navigate = useNavigate();

    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', answers: [{ text: '', is_correct: false }] }]);
    };

    const handleAddAnswer = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].answers.push({ text: '', is_correct: false });
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleRemoveAnswer = (qIndex, aIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
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
    // Basic validation
    if (!title.trim() || !description.trim()) {
        alert("Please enter both a title and a description for the quiz.");
        return;
    }

    // Validate questions
    for (const question of questions) {
        if (!question.text.trim()) {
            alert("Please provide text for all questions.");
            return;
        }

        if (question.answers.length === 0 || question.answers.every(answer => !answer.text.trim())) {
            alert("Each question must have at least one answer.");
            return;
        }

        if (!question.answers.some(answer => answer.is_correct)) {
            alert("Each question must have at least one correct answer.");
            return;
        }
    }

    // Proceed with quiz creation if all validations pass
    try {
        const token = localStorage.getItem('token');
        await axios.post(API_ROUTES.createQuiz, { token, title, description, questions });
        navigate('/quiz/home');
    } catch (error) {
        console.error("There was an error creating the quiz:", error);
    }
};

    return (
        <div className="create-quiz-page">
            <div className="instructions-container">
                <button onClick={() => setShowInstructions(!showInstructions)} className="instructions-toggle-btn">
                    {showInstructions ? 'Hide Instructions' : 'View Instructions'}
                </button>
                {showInstructions && (
                    <div className="instructions-modal">
                        <h3>Instructions</h3>
                        <p>1. Enter the title and description of your quiz.</p>
                        <p>2. Add questions and provide answers for each question.</p>
                        <p>3. Mark the correct answer for each question.</p>
                        <p>4. Click "Create Quiz" to save your quiz.</p>
                        <button onClick={() => setShowInstructions(false)} className="close-modal-btn">
                            <FaTimes /> Close
                        </button>
                    </div>
                )}
            </div>
            <div className="quiz-form">
                <h2 className="form-title">Create Quiz</h2>
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                />
                <textarea
                    placeholder="Quiz Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
                />
                <TransitionGroup>
                    {questions.map((question, qIndex) => (
                        <CSSTransition key={qIndex} timeout={300} classNames="fade">
                            <div className="question-card">
                                <input
                                    type="text"
                                    placeholder="Question"
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                    className="question-input"
                                />
                                <div className="actions">
                                    <button onClick={() => handleRemoveQuestion(qIndex)} className="remove-question-btn">
                                        <FaTrash />
                                    </button>
                                    <button onClick={() => handleAddAnswer(qIndex)} className="add-answer-btn">
                                        <FaPlus /> add answer 
                                    </button>
                                </div>
                                <TransitionGroup>
                                    {question.answers.map((answer, aIndex) => (
                                        <CSSTransition key={aIndex} timeout={300} classNames="fade">
                                            <div className="answer-card">
                                                <input
                                                    type="text"
                                                    placeholder="Answer"
                                                    value={answer.text}
                                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                                                    className="answer-input"
                                                />
                                                <label className="correct-answer-label">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIndex}`}
                                                        checked={answer.is_correct}
                                                        onChange={() => handleCorrectChange(qIndex, aIndex)}
                                                        className="correct-answer-radio"
                                                    />
                                                    <div className="icon-container">
                                                        {answer.is_correct ? <FaCheckCircle className="icon correct" /> : <FaTimesCircle className="icon incorrect" />}
                                                    </div>
                                                </label>
                                                <button onClick={() => handleRemoveAnswer(qIndex, aIndex)} className="remove-answer-btn">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </div>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                <div className="form-actions">
                    <button onClick={handleAddQuestion} className="add-question-btn">
                        <FaPlus /> Add Question
                    </button>
                    <button onClick={handleSubmit} className="submit-quiz-btn">Create Quiz</button>
                </div>
            </div>
            <FooterNav />
        </div>
    );
};

export default CreateQuizPage;
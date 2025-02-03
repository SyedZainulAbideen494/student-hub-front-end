import React, { useState, useEffect } from 'react';

const TestAttempt = ({ test, submitTest }) => {
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60); // Convert minutes to seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        // Prepare all the questions and answers to be submitted
        const fullAnswers = test.questions.map((q) => ({
            questionId: q.questionId,
            userAnswer: answers[q.questionId] || '' // Use empty string if no answer provided
        }));
    
        submitTest(fullAnswers);
    };
    

    return (
        <div>
            <h2>Test in Progress</h2>
            <p>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            
            {test.questions.map((q, index) => (
                <div key={q.questionId}>
                    <p><strong>Q{index + 1}:</strong> {q.question}</p>

                    {q.type === 'mcq' ? (
                        q.options.map((option) => (
                            <label key={option}>
                                <input
                                    type="radio"
                                    name={`question_${q.questionId}`}
                                    value={option}
                                    onChange={() => handleAnswerChange(q.questionId, option)}
                                />
                                {option}
                            </label>
                        ))
                    ) : (
                        <textarea
                            rows="3"
                            placeholder="Type your answer..."
                            onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <button onClick={handleSubmit}>Submit Test</button>
        </div>
    );
};

export default TestAttempt;

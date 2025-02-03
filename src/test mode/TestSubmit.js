import React, { useState } from 'react';

const TestSubmit = ({ testId, answers }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const submitTest = async () => {
        setLoading(true);

        const response = await fetch('http://localhost:8080/api/test/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testId, answers, token })
        });

        const data = await response.json();
        setResult(data);
        setLoading(false);
    };

    return (
        <div>
            <h2>Submit Test</h2>
            <button onClick={submitTest} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Test'}
            </button>

            {result && (
                <div>
                    <h3>Score: {result.score}%</h3>
                    <h3>AI Feedback</h3>
                    {result.analysis.map((item, index) => (
                        <div key={index}>
                            <p><strong>Q:</strong> {item.question}</p>
                            <p><strong>Your Answer:</strong> {item.userAnswer}</p>
                            <p><strong>Feedback:</strong> {item.feedback}</p>
                            <p><strong>Tip:</strong> {item.improvementTip}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestSubmit;

import React, { useState } from 'react';

const TestGeneration = ({ setTest }) => {
    const [subject, setSubject] = useState('');
    const [chapters, setChapters] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState('medium');
    const [timeLimit, setTimeLimit] = useState(30); // in minutes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const generateTest = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/test/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, chapters, numQuestions, difficulty, timeLimit, token })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setTest({ testId: data.testId, questions: data.testQuestions, timeLimit });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Generate a Test</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>Subject:</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />

            <label>Chapters:</label>
            <input type="text" value={chapters} onChange={(e) => setChapters(e.target.value)} />

            <label>No. of Questions (Max 25):</label>
            <input type="number" value={numQuestions} min="1" max="25" onChange={(e) => setNumQuestions(e.target.value)} />

            <label>Difficulty:</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <label>Time Limit (minutes):</label>
            <input type="number" value={timeLimit} min="5" max="120" onChange={(e) => setTimeLimit(e.target.value)} />

            <button onClick={generateTest} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Test'}
            </button>
        </div>
    );
};

export default TestGeneration;

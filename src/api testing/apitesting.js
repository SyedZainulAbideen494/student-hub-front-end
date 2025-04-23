import React, { useState } from 'react';
import axios from 'axios';

const QuizGeneratorAPi = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setQuiz([]);

    try {
      const response = await fetch('https://srv594954.hstgr.cloud/api/quiz-from-topic-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: 'edusify_live_sk-62kh6ygya8j', // 🔐 Replace this with your real API key
          subject,
          topic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuiz(data.quiz);
      } else {
        setError(data.error || 'Unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to fetch quiz. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1>🧠 Edusify Quiz Generator</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Enter Subject (e.g., Biology)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Topic (e.g., Photosynthesis)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button onClick={generateQuiz} disabled={loading || !subject || !topic}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {quiz.length > 0 && (
        <div className="quiz">
          {quiz.map((q, index) => (
            <div key={index} className="question">
              <h3>{index + 1}. {q.question}</h3>
              <ul>
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={opt === q.correct_answer ? 'correct' : ''}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizGeneratorAPi;

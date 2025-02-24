import React, { useState } from 'react';
import axios from 'axios';

function FeynmanTechnique() {
  const [step, setStep] = useState(1); // Track the current step
  const [topic, setTopic] = useState('');
  const [userExplanation, setUserExplanation] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [questions, setQuestions] = useState([]);
  const [simplicityScore, setSimplicityScore] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

// Handle form submission for each step
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  
    try {
      if (step === 1) {
        // Step 1: Send topic and user explanation to backend and get AI explanation
        if (!topic || !userExplanation) {
          return setError("Please provide both topic and your explanation.");
        }
  
        const { data } = await axios.post(
          'http://localhost:8080/api/feynman',
          { topic, userExplanation }, // Send both topic and userExplanation
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setAiExplanation(data.simpleExplanation); // Store AI's explanation
        setStep(2); // Move to next step after receiving AI explanation
  
      } else if (step === 2) {
        // Step 2: Send the user's explanation and AI explanation for feedback
        if (!userExplanation || !aiExplanation) {
          return setError("Please provide your explanation and receive the AI explanation before moving on.");
        }
  
        const { data } = await axios.post(
          'http://localhost:8080/api/feynman-feedback',
          { userExplanation, aiExplanation }, // Send both user and AI explanation
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setFeedback(data.feedback);
        setQuestions(data.questions);
        setStep(3); // Move to next step after feedback
  
      } else if (step === 3) {
        // Step 3: Send the refined explanation to get simplicity score
        if (!userExplanation) {
          return setError("Please provide a refined explanation to get the simplicity score.");
        }
  
        const { data } = await axios.post(
          'http://localhost:8080/api/feynman-score',
          { userExplanation }, // Send user explanation for simplicity score
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setSimplicityScore(data.simplicityScore);
        setStep(4); // Move to next step after receiving score
      }
  
    } catch (err) {
      setError('Error processing your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2>Feynman Technique</h2>

      {error && <p>{error}</p>}

      {step === 1 && (
  <form onSubmit={handleSubmit}>
    <label>
      Topic:
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
      />
    </label>
    <br />
    <label>
      Your Explanation:
      <textarea
        value={userExplanation}
        onChange={(e) => setUserExplanation(e.target.value)}
        required
      />
    </label>
    <br />
    <button type="submit" disabled={loading}>
      {loading ? 'Processing...' : 'Next Step'}
    </button>
  </form>
)}


      {step === 2 && (
        <div>
          <h3>AI Explanation:</h3>
          <p>{aiExplanation}</p>
          <label>
            Rewrite the explanation:
            <textarea
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
              required
            />
          </label>
          <br />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Next Step'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Feedback on Your Explanation:</h3>
          <p>{feedback}</p>
          <h3>Questions to Test Your Knowledge:</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
          <label>
            Refine your explanation:
            <textarea
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
              required
            />
          </label>
          <br />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Next Step'}
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3>Simplicity Score:</h3>
          <p>{simplicityScore}</p>
          <button onClick={() => setStep(1)}>Start Over</button>
        </div>
      )}
    </div>
  );
}

export default FeynmanTechnique;

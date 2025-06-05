import React, { useState, useEffect } from 'react';
import './ExamMode.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const ExamMode = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
    const [isPremium, setIsPremium] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleStart = async () => {
    if (!subject || !topic) return;
  
    setLoading(true);
    setError('');
  
    // Immediately navigate to the loader page
    navigate('/exam-mode/loader');
  
    try {
      const token = localStorage.getItem('token');
  
      const res = await axios.post(API_ROUTES.examModeGenerate, {
        subject,
        topic,
        token
      });
  
      // After generation, redirect to results page
      navigate(`/exam-mode/${res.data.examPredictorId}`, { state: res.data });
  
    } catch (err) {
      console.error('Error starting Exam Mode:', err);
      setError('Failed to start Exam Mode. Please try again.');
      // Optional: navigate back if needed
      navigate('/exam-mode');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMypack =() => {
    navigate('/exam-mode/packs')
  }

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
          .then(response => setIsPremium(response.data.premium))
          .catch(() => setIsPremium(false));
      } else {
        setIsPremium(false);
      }
    }, []);

  return (
    <div className="container__Exam__mode__page__main">
 
        <div className="inputSection__Exam__mode__page__main animate__Exam__mode__page__main">
        <h1 className="title__Exam__mode__page__main">
  Enter Exam Mode
</h1>
<span className="betaBadge__Exam__mode__page__main">Beta</span>

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input__Exam__mode__page__main"
          />
          <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input__Exam__mode__page__main"
          />

<button
  onClick={handleStart}
  className="button__Exam__mode__page__main"
  disabled={loading || isPremium === false}
  style={{
    opacity: isPremium === false ? 0.5 : 1,
    cursor: isPremium === false ? 'not-allowed' : 'pointer'
  }}
>
  {loading
    ? 'Generating...'
    : isPremium === false
      ? 'Premium Required'
      : 'Start Exam'}
</button>

          <button
            className="button__Exam__mode__page__main"
            disabled={loading}
            onClick={handleMypack}
          >
            My Packs
          </button>
          {loading && (
            <div className="loader__Exam__mode__page__main">
              <div className="spinner"></div>
              <p>Generating AI-powered content...</p>
            </div>
          )}

          {error && <p className="error__Exam__mode__page__main">{error}</p>}
        </div>

      <FooterNav/>
    </div>
  );
};

export default ExamMode;

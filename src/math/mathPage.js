import React, { useState } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaKeyboard, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Math Solver Component
const MathSolver = ({ query, setQuery, handleCalculate, handleVoiceCommand }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const performCalculate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_ROUTES.solveMath, { query });
      console.log('API Response:', response.data);
      setResults(response.data.results);
    } catch (error) {
      console.error('Calculation Error:', error);
      setResults([{ title: 'Error', content: 'Unable to calculate' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSymbolClick = (symbol) => {
    setQuery(prevQuery => prevQuery + symbol);
    setShowKeyboard(false);
  };

  return (
    <div className="mathsolver-container">
      {loading ? (
        <MathLoader />
      ) : (
        <div className="chat-ui">
          <div className="chat-messages">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="chat-message">
                  <div className="chat-bubble">
                    <h2 className="chat-result-title">{result.title}</h2>
                    <pre className="chat-result-content">{result.content || 'No content available'}</pre>
                    {result.images && result.images.length > 0 ? (
                      result.images.map((src, i) => (
                        <img key={i} className="chat-result-image" src={src} alt={`result-image-${i}`} />
                      ))
                    ) : (
                      <p className="chat-no-images">No images available</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              /* From Uiverse.io by xXJollyHAKERXx */ 
<div className="spinner">
    <div className="spinner1"></div>
</div>
            )}
          </div>
          <div className="chat-input-container">
            <div className="input-group">
              <input
                type="text"
                className="chat-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter calculation"
              />
              <button className="chat-mic-btn" onClick={handleVoiceCommand}>
                <FaMicrophone />
              </button>
              <button className="chat-keyboard-btn" onClick={() => setShowKeyboard(!showKeyboard)}>
                <FaKeyboard />
              </button>
              {showKeyboard && (
                <div className="keyboard-modal">
                  <button className="keyboard-btn" onClick={() => handleSymbolClick('√')}>√</button>
                  <button className="keyboard-btn" onClick={() => handleSymbolClick('^')}>^</button>
                  <button className="keyboard-btn" onClick={() => handleSymbolClick('π')}>π</button>
                  <button className="keyboard-btn" onClick={() => handleSymbolClick('e')}>e</button>
                  <button className="keyboard-btn" onClick={() => handleSymbolClick('(')}>(</button>
                  <button className="keyboard-btn" onClick={() => handleSymbolClick(')')}>)</button>
                </div>
              )}
            </div>
            <button className="chat-send-btn" onClick={performCalculate}>
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component with Voice Command
const MathPage = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleCalculate = async () => {
    try {
      const response = await axios.post(API_ROUTES.solveMath, { query });
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Calculation Error:', error);
    }
  };

  const handleVoiceCommand = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setQuery(command);
        handleCalculate();
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert('Speech Recognition not supported');
    }
  };

  return (
    <div className="math-page">
      <div className="math-page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft />
        </button>
        <h3 className="math-page-heading">Math Solver</h3>
      </div>
      <MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />
    </div>
  );
};

export default MathPage;

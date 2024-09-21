import React, { useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaMicrophone, FaPaperPlane, FaKeyboard, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import LoadingSpinner from '../app_modules/LoadingSpinner';

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
        <LoadingSpinner />
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
<div className="container__math__solver__animated">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
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
                placeholder="Enter question"
              />
              <button className="chat-keyboard-btn" onClick={handleVoiceCommand}>
              <FaMicrophone />
              </button>
              {showKeyboard && (
                 <div className="keyboard-modal">
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('GDP')}>GDP</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Inflation')}>Inflation</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Supply')}>Supply</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Demand')}>Demand</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Revenue')}>Revenue</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Cost')}>Cost</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Profit')}>Profit</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Assets')}>Assets</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Liabilities')}>Liabilities</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Equity')}>Equity</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('ROI')}>ROI</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Interest')}>Interest</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Depreciation')}>Depreciation</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Balance Sheet')}>Balance Sheet</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Income Statement')}>Income Statement</button>
                 <button className="keyboard-btn" onClick={() => handleSymbolClick('Cash Flow')}>Cash Flow</button>
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
const CommerceHelper = () => {
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
        <h3 className="math-page-heading">Commerce Helper</h3>
      </div>
      <MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />
    </div>
  );
};

export default CommerceHelper;





import React, { useState } from 'react';
import axios from 'axios';
import './mathPage.css';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaCalculator, FaMicrophone } from 'react-icons/fa';

const SimpleCalculator = () => {
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value) => {
    const replaceSymbols = {
      '÷': '/',
      '×': '*'
    };
    const newValue = replaceSymbols[value] || value;
    setExpression((prev) => prev + newValue);
  };

  const handleCalculate = () => {
    try {
      const result = eval(expression); // Be cautious with eval in production code
      setExpression(result.toString());
    } catch (error) {
      setExpression('Error');
    }
  };

  return (
    <div className="simple-calculator">
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="0"
        className="calculator-display"
      />
      <div className="calculator-keyboard">
        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map((key) => (
          <button
            key={key}
            onClick={() => {
              if (key === '=') {
                handleCalculate();
              } else if (key === 'C') {
                setExpression('');
              } else {
                handleButtonClick(key);
              }
            }}
            className={`calculator-key ${key === '=' ? 'equals' : ''} ${key === 'C' ? 'clear' : ''}`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

// Math Solver Component
const MathSolver = ({ query, setQuery, handleCalculate }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="mathsolver-container">
      <header className="mathsolver-header">
        <h1 className="mathsolver-title">Math Helper</h1>
        <div className="mathsolver-input-container">
          <input
            type="text"
            className="mathsolver-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter calculation"
          />
          <button className="mathsolver-button" onClick={performCalculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>
        <div className="mathsolver-keyboard">
          {['√', '^', 'π', 'e', '(', ')'].map((key) => (
            <div key={key} className="mathsolver-key" onClick={() => setQuery((prev) => prev + key)}>
              {key}
            </div>
          ))}
        </div>
        {loading ? (
          <MathLoader />
        ) : (
          <div className="mathsolver-results">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="mathsolver-result">
                  <h2 className="mathsolver-result-title">{result.title}</h2>
                  <pre className="mathsolver-result-content">{result.content || 'No content available'}</pre>
                  {result.images && result.images.length > 0 ? (
                    result.images.map((src, i) => (
                      <img key={i} className="mathsolver-result-image" src={src} alt={`result-image-${i}`} />
                    ))
                  ) : (
                    <p className="mathsolver-no-images">No images available</p>
                  )}
                </div>
              ))
            ) : (
              <p className="mathsolver-no-results">No results to display</p>
            )}
          </div>
        )}
        <FooterNav />
      </header>
    </div>
  );
};

// Main Component with Toggle and Voice Command
const MathPage = () => {
  const [showSolver, setShowSolver] = useState(true);
  const [query, setQuery] = useState('');
  const [expression, setExpression] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setShowSolver((prev) => !prev);
  };

  const calculate = (expression) => {
    try {
      const result = eval(expression); // Dangerous in real apps, consider using a safer eval alternative
      return result;
    } catch (error) {
      return 'Error';
    }
  };

  const handleCalculate = async () => {
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

  const handleVoiceCommand = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        if (showSolver) {
          setQuery(command);
          handleCalculate();
        } else {
          setExpression(command);
          calculate(command);
        }
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
        <button onClick={toggleMode} className="switch-mode-btn-math-page">
          {showSolver ? 'Switch to Simple Calculator' : 'Switch to Math Solver'}
          <FaCalculator className="icon" />
        </button>
        <button onClick={handleVoiceCommand} className="switch-mode-btn-math-page">
          {isListening ? 'Listening...' : 'Start Voice Command'}
          <FaMicrophone className="icon" />
        </button>
      </div>
      {showSolver ? (
        <MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} />
      ) : (
        <SimpleCalculator calculate={calculate} />
      )}
    </div>
  );
};

export default MathPage;
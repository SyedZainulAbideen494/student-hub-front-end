import React, { useState } from 'react';
import axios from 'axios';
import './CommerceHelper.css';
import FooterNav from '../app_modules/footernav';

const CommerceHelper = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const fetchAnswer = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:8080/api/commerce', {
        query
      });
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = (results) => {
    if (!results || results.length === 0) {
      return <p>No data available</p>;
    }

    return (
      <div className="result-container">
        {results.map((result, index) => (
          <div key={index} className="result-card">
            <div className="result-title">{result.title}</div>
            <div className="result-content">{result.content}</div>
          </div>
        ))}
      </div>
    );
  };

  const handleKeyPress = (key) => {
    setQuery((prevQuery) => prevQuery + key);
  };

  const keyboardKeys = [
    ['GDP', 'Inflation', 'Supply', 'Demand', 'Revenue', 'Cost', 'Profit', 'Assets', 'Liabilities'],
    ['Equity', 'ROI', 'Interest', 'Depreciation', 'Balance Sheet', 'Income Statement', 'Cash Flow'],
  ];

  return (
    <div className="commerce-helper-container">
      <header className="page-header">
        <h1>Commerce Helper Tool</h1>
        <p>Get answers to your commerce-related queries with ease.</p>
      </header>
      <main>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="query-input"
        />
        <button onClick={fetchAnswer} className="fetch-button">
          Get Answer
        </button>
        <div className="keyboard-container">
          {keyboardKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key, keyIndex) => (
                <button
                  key={keyIndex}
                  onClick={() => handleKeyPress(key)}
                  className="keyboard-button"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
        {showInstructions && (
          <div className="instructions-container">
            <div className="instructions">
              <h2>Usage Instructions</h2>
              <p>To use this tool:</p>
              <ul>
                <li>Enter your query in the input field.</li>
                <li>Use the keyboard to type common commerce terms.</li>
                <li>Click "Get Answer" to see the result.</li>
              </ul>
              <button onClick={() => setShowInstructions(false)} className="hide-instructions-button">
                Hide Instructions
              </button>
            </div>
          </div>
        )}
        {!showInstructions && (
          <button onClick={() => setShowInstructions(true)} className="show-instructions-button">
            Show Instructions
          </button>
        )}
        {loading && (
          <div className="loader-modal">
            <div className="loader-content">
              <div className="loader"></div>
              <div className="loader-text">Loading...</div>
            </div>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {result && renderResults(result)}
      </main>
      <FooterNav />
    </div>
  );
};


export default CommerceHelper;
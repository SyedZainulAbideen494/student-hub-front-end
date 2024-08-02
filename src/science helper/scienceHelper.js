import React, { useState } from 'react';
import axios from 'axios';
import './ScienceQA.css';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const ScienceQA = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const fetchAnswer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_ROUTES.scienceProblem, {
        params: { input: query }
      });
      setResult(response.data);
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const renderPods = (pods) => {
    if (!pods || !Array.isArray(pods)) {
      return <p>No data available</p>;
    }

    return (
      <div className="card-container">
        {pods.map((pod, index) => (
          <div key={index} className="card">
            <div className="card-header">{pod.title}</div>
            <div className="card-content">
              <div className="card-details">
                {pod.subpods && pod.subpods.map((subpod, subIndex) => (
                  <div key={subIndex} className="subpod-container">
                    {subpod.img && subpod.img.src ? (
                      <img
                        src={subpod.img.src}
                        alt={pod.title}
                        className="card-image"
                      />
                    ) : (
                      <p className="card-text">{subpod.plaintext}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleKeyPress = (key) => {
    setQuery((prevQuery) => prevQuery + key);
  };

  const keyboardKeys = [
    ['H', 'O', 'N', 'C', 'Cl', 'Br', 'I', '+', '-', '*', '/', '(', ')'],
    ['2', '3', '4', '5', '6', '7', '8', '9', '10', '^', '√', 'log', 'e', 'π'],
    ['C₂H₆', 'O₂', '→']
  ];

  return (
    <div className="science-qa-container">
      <header className="page-header">
        <h1>Science Q&A Tool</h1>
        <p>Get answers to your science-related queries with ease.</p>
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
                <li>Use the keyboard to type chemical formulas, physics equations, or biology terms.</li>
                <li>Click "Get Answer" to see the result.</li>
              </ul>
              <h3>Chemistry</h3>
              <ul>
                <li>For chemical formulas, type the element symbols and subscripts directly (e.g., H₂O for water).</li>
                <li>Use the keyboard to insert common symbols and formulas (e.g., C₂H₆ for ethane).</li>
              </ul>
              <h3>Physics</h3>
              <ul>
                <li>For physics equations, type mathematical operators and constants (e.g., E = mc²).</li>
                <li>Use the keyboard for special constants and operators (e.g., π, e).</li>
              </ul>
              <h3>Biology</h3>
              <ul>
                <li>For biology queries, enter scientific names, processes, or terms (e.g., Photosynthesis).</li>
                <li>Use standard text input for descriptions or terms.</li>
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
        {result && renderPods(result.pods)}
      </main>
      <FooterNav />
    </div>
  );
};

export default ScienceQA;
import React, { useState } from 'react';
import axios from 'axios';
import './ScienceQA.css';
import FooterNav from '../app_modules/footernav';

const ScienceQA = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnswer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8080/wolfram', {
        params: { input: query }
      });

      console.log(response.data); // Log the response for debugging
      setResult(response.data); // Store the entire result
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

    return pods.map((pod, index) => (
      <div key={index} className="pod-container">
        <h3 className="pod-title">{pod.title}</h3>
        {pod.subpods && pod.subpods.map((subpod, subIndex) => (
          <div key={subIndex} className="subpod-container">
            {subpod.img && subpod.img.src ? (
              <img
                src={subpod.img.src}
                alt={pod.title}
                className="subpod-image"
              />
            ) : (
              <p className="subpod-text">{subpod.plaintext}</p>
            )}
          </div>
        ))}
      </div>
    ));
  };

  const handleKeyPress = (key) => {
    setQuery((prevQuery) => prevQuery + key);
  };

  const keyboardKeys = [
    ['H', 'O', 'N', 'C', 'Cl', 'Br', 'I', '+', '-', '*', '/', '(', ')'],
    ['2', '3', '4', '5', '6', '7', '8', '9', '10', '^', '√', 'log', 'e', 'π']
  ];

  return (
    <div className="science-qa-container">
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
      {loading && (
        <div className="loader-modal">
          <div className="loader-content">
            <div className="loader"></div>
            <div className="loader-text">E = mc^2 | H2O | F = ma</div>
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {result && renderPods(result.pods)}
      <FooterNav/>
    </div>
  );
};

export default ScienceQA;
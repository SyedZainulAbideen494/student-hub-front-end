import React, { useState } from 'react';
import axios from 'axios';
import './mathPage.css';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';

const MathSolver = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleCalculate = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(API_ROUTES.solveMath, { query });
      console.log('API Response:', response.data); // Log the API response
      setResults(response.data.results);
    } catch (error) {
      console.error('Calculation Error:', error); // Log any errors
      setResults([{ title: 'Error', content: 'Unable to calculate' }]);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleKeyPress = (symbol) => {
    setQuery(prev => prev + symbol);
  };

  return (
    <div className="mathsolver-container">
      <header className="mathsolver-header">
        <h1 className="mathsolver-title">Calculator</h1>
        <div className="mathsolver-input-container">
          <input
            type="text"
            className="mathsolver-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter calculation"
          />
          <button className="mathsolver-button" onClick={handleCalculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>
        <div className="mathsolver-keyboard">
          {['√', '^', 'π', 'e', '(', ')'].map((key) => (
            <div key={key} className="mathsolver-key" onClick={() => handleKeyPress(key)}>
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
}

export default MathSolver;
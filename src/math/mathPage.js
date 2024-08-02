import React, { useState } from 'react';
import axios from 'axios';
import './mathPage.css';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const MathSolver = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleCalculate = async () => {
    try {
      const response = await axios.post(API_ROUTES.solveMath, { query });
      console.log('API Response:', response.data); // Log the API response
      setResults(response.data.results);
    } catch (error) {
      console.error('Calculation Error:', error); // Log any errors
      setResults([{ title: 'Error', content: 'Unable to calculate' }]);
    }
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
          <button className="mathsolver-button" onClick={handleCalculate}>Calculate</button>
        </div>
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
        <FooterNav/>
      </header>
    </div>
  );
}

export default MathSolver;
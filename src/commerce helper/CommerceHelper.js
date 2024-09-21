import React, { useState } from 'react';
import './CommerceHelper.css';
import axios from 'axios';
import { IoIosArrowBack, IoIosKeypad } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { IoMdCloseCircle, IoMdClose } from 'react-icons/io';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../app_modules/LoadingSpinner';
const CommerceHelper = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const nav = useNavigate()

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

  const handleClear = () => {
    setQuery('');
  };

  const handleButtonClick = (value) => {
    setQuery((prev) => prev + value);
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

  const keyboardKeys = [
    ['GDP', 'Inflation', 'Supply', 'Demand', 'Revenue', 'Cost', 'Profit', 'Assets', 'Liabilities'],
    ['Equity', 'ROI', 'Interest', 'Depreciation', 'Balance Sheet', 'Income Statement', 'Cash Flow'],
  ];

  
  const handleBackClick = () => {
    nav('/')
  }

  return (
    <div className="science-qa-container__scienceHelper">
      <header className="page-header__scienceHelper">
        <button className="back-button__scienceHelper" onClick={handleBackClick}>
          <IoIosArrowBack size={24} />
        </button>
        <h1>Commerce Helper</h1>
      </header>
      <main className="chat-container__scienceHelper">
        <div className="result-container__scienceHelper">
          {loading && (
            <div className="loader-modal__scienceHelper">
              <div className="loader-content__scienceHelper">
                <div className="loader__scienceHelper"></div>
                <div className="loader-text__scienceHelper"><LoadingSpinner/></div>
              </div>
            </div>
          )}
          {error && <p className="error-message__scienceHelper">{error}</p>}
          {result && renderPods(result.pods)}
        </div>
      </main>
      <footer className="input-container__scienceHelper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="query-input__scienceHelper"
        />
        <button onClick={() => setShowKeyboard(!showKeyboard)} className="keyboard-icon__scienceHelper">
          <IoIosKeypad size={20} />
        </button>
        <button onClick={fetchAnswer} className="send-button__scienceHelper">
          <FiSend size={20} />
        </button>
      </footer>
      {showKeyboard && (
        <div className="keyboard-container__scienceHelper">
          <div className="keyboard-header__scienceHelper">
            <button onClick={() => setShowKeyboard(false)} className="close-keyboard__scienceHelper">
              <IoMdClose size={24} />
            </button>
          </div>
          {keyboardKeys.map((row, index) => (
            <div key={index} className="keyboard-row__scienceHelper">
              {row.map((key, keyIndex) => (
                <button
                  key={keyIndex}
                  onClick={() => handleButtonClick(key)}
                  className="keyboard-button__scienceHelper"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommerceHelper;




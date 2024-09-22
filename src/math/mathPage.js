import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaKeyboard, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Math Solver Component
const MathSolver = ({ query, setQuery, handleVoiceCommand }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');

  useEffect(() => {
    const message = 'Hi there! What can I assist you with today?';
    const typingSpeed = 50; // Adjust typing speed (in milliseconds)

    setTypingMessage(''); // Clear the message initially

    const typeMessage = (msg, i) => {
        if (i < msg.length) {
            setTypingMessage(msg.slice(0, i + 1)); // Update state to show the typed message
            setTimeout(() => typeMessage(msg, i + 1), typingSpeed); // Call recursively
        }
    };

    typeMessage(message, 0); // Start typing the message

    return () => setTypingMessage(''); // Cleanup on unmount
}, []); // Empty dependency array to run only once on mount

  const performCalculate = async () => {
    if (!query) return; // Prevent calculation with empty query

    setLoading(true);
    try {
      const response = await axios.post(API_ROUTES.solveMath, { query });
      console.log('API Response:', response.data);

      // Convert **text** to <strong>text</strong>
      let formattedContent = response.data.response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/## (.*?)\n/g, '<h2>$1</h2>') // Convert ## to <h2>
        .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>'); // Convert - to <li>

      // Wrap list items in <ul>
      const hasListItems = /<li>.*?<\/li>/g.test(formattedContent);
      if (hasListItems) {
        formattedContent = `<ul>${formattedContent.match(/<li>.*?<\/li>/g).join('')}</ul>`;
      }

      setResults([{ title: 'Result', content: formattedContent || 'No content available' }]);
    } catch (error) {
      console.error('Calculation Error:', error);
      setResults([{ title: 'Error', content: 'Unable to calculate' }]);
    } finally {
      setLoading(false);
    }
};


  useEffect(() => {
      // Animate chat messages
      const chatMessages = document.querySelectorAll('.chat-message');
      chatMessages.forEach((message, index) => {
          message.classList.add('chat-message-enter');
          setTimeout(() => {
              message.classList.add('chat-message-enter-active');
          }, index * 100); // Stagger animations for each message
      });
  }, [results]);

  const handleSymbolClick = (symbol) => {
      setQuery(prevQuery => prevQuery + symbol);
      setShowKeyboard(false);
  };

  return  (
    <div className="mathsolver-container">
      {loading ? (
         <div className="typing-loader">
         <span className="typing-dot"></span>
         <span className="typing-dot"></span>
         <span className="typing-dot"></span>
         <span className="typing-dot"></span>
       </div>
      ) : (
        <div className="chat-ui">
          <div className="chat-messages">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="chat-message">
                  <div className="chat-bubble">
                    <h2 className="chat-result-title">{result.title}</h2>
                    <div className="chat-result-content" dangerouslySetInnerHTML={{ __html: result.content }} />
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="container__math__solver__animated">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="chat-message">
                  <div className="chat-bubble">
                    <div className="chat-result-content">{typingMessage}</div>
                  </div>
                </div>
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
                placeholder="Enter Question"
              />
              <button className="chat-keyboard-btn" onClick={handleVoiceCommand}>
                <FaMicrophone />
              </button>
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
        <h3 className="math-page-heading">AI Helper</h3>
      </div>
      <MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />
    </div>
  );
};

export default MathPage;

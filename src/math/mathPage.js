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


const formatContent = (content) => {
  // Convert triple backticks to <pre><code> for code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  // Convert ## to <h2> and remove the ## characters
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");

  // Convert **text** to <strong> and remove the ** characters
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='large-text'>$1</strong>");

  // Convert *text* to <strong> and remove the * characters
  content = content.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  // Convert lists (lines starting with *) to <ul> and <li>
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>"); // Find list items

  // Wrap all <li> elements in a single <ul>
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>"); // Wrap in <ul>

  // Convert tables with | to <table>, <tr>, <th>, <td>
  content = content.replace(/(\|.*?\|)(\n|$)/g, (match) => {
    const rows = match.split('\n').filter(row => row.trim());
    const tableRows = rows.map(row => {
      const cells = row.split('|').filter(cell => cell.trim());
      const rowContent = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${rowContent}</tr>`;
    }).join('');
    return `<table>${tableRows}</table>`;
  });

  return content;
};




const performCalculate = async () => {
  if (!query) return; // Prevent calculation with empty query

  setLoading(true);
  try {
    const response = await axios.post(API_ROUTES.solveMath, { query });
    console.log('API Response:', response.data);

    // Format content dynamically
    let formattedContent = formatContent(response.data.response);

    setResults([{ title: 'Result', content: formattedContent || 'No content available' }]);
  } catch (error) {
    console.error('Calculation Error:', error);
    setResults([{ title: 'Error', content: "We're sorry, something went wrong. Please try asking a different question or come back later." }]);
  } finally {
    setLoading(false);
    setQuery(''); // Clear the input after calculation
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
                      {/* Add this below the chat messages */}
                      <div className="chat-info">
  <small>Note: This chat does not remember previous conversations. Please enter the entire question each time.</small>
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
        <div className="powered-by-gemini">
        Powered by <span className="gemini-logo">Gemini</span>
      </div>
      </div>
      <MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />
    </div>
  );
};

export default MathPage;

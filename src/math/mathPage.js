import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaKeyboard, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FeedbackForm from '../help/FeedbackForm';


const formatContent = (content) => {
  // Convert triple backticks to <pre><code> for code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  // Convert ## to <h2> and remove the ## characters
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");

  // Convert **text** to <strong> and remove the ** characters
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='large-text'>$1</strong>");

  // Convert *text* to <em> and remove the * characters
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert lists (lines starting with *) to <ul> and <li>
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>"); // Find list items

  // Wrap all <li> elements in a single <ul>
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>"); // Wrap in <ul>

  // Convert tables with | to <table>, <tr>, <th>, <td>
  content = content.replace(/((?:\|.*?\|(?:\r?\n|$))+)/g, (match) => {
    const rows = match.split('\n').filter(row => row.trim());
    const tableRows = rows.map((row, index) => {
      const cells = row.split('|').filter(cell => cell.trim());
      if (index === 0) {
        // First row is header
        const headerContent = cells.map(cell => `<th>${cell.trim()}</th>`).join('');
        return `<tr>${headerContent}</tr>`;
      }
      const rowContent = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${rowContent}</tr>`;
    }).join('');
    return `<table>${tableRows}</table>`;
  });

  return content;
};

const MathSolver = ({ handleVoiceCommand }) => {
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'user',
      parts: [{ text: 'Hello' }],
    },
    {
      role: 'model',
      parts: [{ text: 'Great to meet you. What would you like to know?' }],
    },
  ]);
  const navigate = useNavigate()


  // Handle sending messages
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: message }] }];
    setChatHistory(newHistory);
    setLoading(true);

    try {
      const response = await axios.post(API_ROUTES.aiGemini, {
        message,
        chatHistory: newHistory,
      });

      // Format the AI response
      const formattedResponse = formatContent(response.data.response);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: formattedResponse }] }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const message = 'Hi there! What can I assist you with today?';
    const typingSpeed = 50; // Adjust typing speed (in milliseconds)

    const typeMessage = (msg, i) => {
      if (i < msg.length) {
        setTypingMessage(msg.slice(0, i + 1)); // Update state to show the typed message
        setTimeout(() => typeMessage(msg, i + 1), typingSpeed); // Call recursively
      }
    };

    typeMessage(message, 0); // Start typing the message

    return () => setTypingMessage(''); // Cleanup on unmount
  }, []); // Empty dependency array to run only once on mount

  const messagesEndRef = useRef(null); // Create a ref for scrolling

  // Scroll to the bottom of the chat whenever chatHistory changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);


    // New function to handle flashcard creation
    const handleCreateFlashcard = (content) => {
      navigate('/notes/create', { state: { editorContent: content } });
    };


  return (
    <div className="mathsolver-container">
      <div className="chat-ui">
        <div className="chat-messages">
          {chatHistory.map((result, index) => (
            <div key={index} className={`chat-message ${result.role}`}>
              <div className="chat-bubble">
                <span className="chat-role">{result.role === 'user' ? 'You' : 'AI'}:</span>
                <div
                  className="chat-result-content"
                  dangerouslySetInnerHTML={{ __html: result.parts.map(part => part.text).join('') }}
                />
                    {result.role === 'model' && index > 1 && ( // Check index > 1 to hide button on the first AI response
        <div className="create-flashcard-btn_ai__page__container">
          <button
            className="create-flashcard-btn_ai__page"
            onClick={() => handleCreateFlashcard(result.parts[0].text)} // Pass the content
          >
            Create Flashcard
          </button>
        </div>
      )}
              </div>
            </div>
          ))}
          {/* Show loader as a message bubble when loading */}
          {loading && (
            <div className="chat-message loader-bubble">
              <div className="chat-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />

        </div>
        <div className="chat-input-container">
          <div className="input-group">
            <input
              type="text"
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter Question"
            />
          
          </div>
          <button className="chat-send-btn" onClick={handleSendMessage}>
            <FaArrowRight />
          </button>
        </div>
      </div>
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

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FeedbackForm from '../help/FeedbackForm';
import { TypeAnimation } from 'react-type-animation';

// Voice recognition setup (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const formatContent = (content) => {
  // Same formatting logic
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='large-text'>$1</strong>");
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>");
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
  content = content.replace(/((?:\|.*?\|(?:\r?\n|$))+)/g, (match) => {
    const rows = match.split('\n').filter(row => row.trim());
    const tableRows = rows.map((row, index) => {
      const cells = row.split('|').filter(cell => cell.trim());
      if (index === 0) {
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
    { role: 'user', parts: [{ text: 'Hello' }] },
    { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
  ]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [listening, setListening] = useState(false); // State for voice recognition
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!conversationStarted) setConversationStarted(true);
  
    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: message }] }];
    setChatHistory(newHistory);
    setLoading(true);
  
    try {
      const response = await axios.post(API_ROUTES.aiGemini, { message, chatHistory: newHistory });
      const formattedResponse = formatContent(response.data.response);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: formattedResponse }] }]);
      setMessage('');
    } catch (error) {
      // Display the error message from the server
      const errorMessage = 'Oops! Something went wrong. Please try again later. If the problem continues, consider rephrasing your question, as it may contain sensitive content.';

      setChatHistory([...newHistory, { role: 'model', parts: [{ text: errorMessage }] }]);
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateFlashcard = (content) => {
    navigate('/notes/create', { state: { editorContent: content } });
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const voiceMessage = event.results[0][0].transcript;
        setMessage(voiceMessage);
        handleSendMessage(); // Automatically send the voice command as a message
      };

      recognition.onend = () => setListening(false);
    }
  }, []);

  const defaultPage = (
    <div className="container__default__ai__PageWrapper">
      <div className="default-message chat-bubble">
        <TypeAnimation
          sequence={[
            'Hi there!', // Text to type out
            1000,        // Pause for 1 second
            'How can I assist you today?', // Next text to type out
            1000         // Pause for 1 second at the end
          ]}
          wrapper="span"
          cursor={true}
          repeat={0}   // Set repeat to 0 so it doesn't loop
          speed={50}   // Adjust typing speed (in ms per character)
          deletionSpeed={50} // Adjust deletion speed if needed
          style={{ display: 'inline-block' }}
        />
      </div>
      <div className="container__default__ai__Page">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
  
  

  return (
    <div className="mathsolver-container">
      <div className="chat-ui">
        <div className="chat-messages">
          {!conversationStarted ? (
            defaultPage
          ) : (
            chatHistory.slice(2).map((result, index) => (
              <div key={index} className={`chat-message ${result.role}`}>
                <div className="chat-bubble">
                  <span className="chat-role">{result.role === 'user' ? 'You' : 'AI'}:</span>
                  <div
                    className="chat-result-content"
                    dangerouslySetInnerHTML={{ __html: result.parts.map((part) => part.text).join('') }}
                  />
                  {result.role === 'model' && (
                    <div className="create-flashcard-btn_ai__page__container">
                      <button
                        className="create-flashcard-btn_ai__page"
                        onClick={() => handleCreateFlashcard(result.parts[0].text)}
                      >
                        Create Note
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
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

        {/* Chat input */}
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
          {message.trim() ? (
            <button className="chat-send-btn" onClick={handleSendMessage}>
              <FaArrowRight />
            </button>
          ) : (
            <button className="chat-send-btn" onClick={listening ? stopListening : startListening}>
              <FaMicrophone className={listening ? 'listening' : ''} />
            </button>
          )}
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
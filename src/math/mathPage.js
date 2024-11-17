import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaArrowRight, FaArrowLeft, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FeedbackForm from '../help/FeedbackForm';
import { TypeAnimation } from 'react-type-animation';
import AIPageTutorial from './AIPageTutorial';
import Loader from './mathLoader';
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
  const [tutorialComplete, setTutorialComplete] = useState(false); // State to control tutorial visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  useEffect(() => {
      // Check local storage for tutorial completion status
      const completed = localStorage.getItem('AIPageTutorialComplete');
      if (completed) {
          setTutorialComplete(true); // Set tutorialComplete to true if found
      }
  }, []);

  const handleTutorialComplete = () => {
      setTutorialComplete(true); // Hide tutorial when complete
      localStorage.setItem('AIPageTutorialComplete', 'true'); // Store completion status in local storage
  };

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
    
    const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage
  
    try {
      const response = await axios.post(API_ROUTES.aiGemini, { message, chatHistory: newHistory, token });
      const formattedResponse = formatContent(response.data.response);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: formattedResponse }] }]);
      setMessage('');
    } catch (error) {
      const errorMessage = (
        <>
          Oops! Something went wrong. Please try again later Reasons - too long text or repetivie message, please try rephrasing your question.
          <button className="report-problem-btn" onClick={() => setShowFeedbackModal(true)}>
            Report Problem
          </button>
        </>
      );
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.post(API_ROUTES.feedbackEduisfy, { feedback, token }); // Send token with feedback
      setSuccessMessage('Feedback submitted successfully!'); // Set success message
      setFeedback(''); // Clear the feedback after submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clickChatHistory = () => {
    navigate('/ai/chat/history')
  }


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
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Avoid submitting on Shift + Enter for multiline input
      e.preventDefault(); // Prevent form submission (default behavior)
      handleSendMessage(); // Trigger the message send when pressing Enter
    }
  };
  
  useEffect(() => {
    // Clear old chat history key upon login
    const handleLogin = () => {
      localStorage.removeItem('chatHistory'); // Remove old key
      localStorage.removeItem('ai_chat_history')
    };
  
    // Call handleLogin when user logs in (adjust this to your app's login event logic)
    handleLogin();
  
    const completed = localStorage.getItem('AIPageTutorialComplete');
    if (completed) {
      setTutorialComplete(true);
    }
  
    const storedChatHistory = JSON.parse(localStorage.getItem('new_ai_chat_history')) || [];
    if (storedChatHistory.length > 0) {
      setChatHistory(storedChatHistory);
      setConversationStarted(true);
    } else {
      setChatHistory([
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
      ]);
    }
  }, []);
  
  // Sync updated chat history with the new key in localStorage
  useEffect(() => {
    if (conversationStarted) {
      localStorage.setItem('new_ai_chat_history', JSON.stringify(chatHistory));
    }
  }, [chatHistory, conversationStarted]);
  
  const handleClearHistory = () => {
    localStorage.removeItem('new_ai_chat_history');
    setChatHistory([
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
    ]);
    setConversationStarted(false);
  };
  

  return (
    <div className="mathsolver-container">
           {!tutorialComplete && <AIPageTutorial onComplete={handleTutorialComplete} />}
           <div className="math-page-header">
  <button className="back-btn" onClick={() => navigate('/')}>
    <FaArrowLeft />
  </button>

  <div className="powered-by-gemini">
    Powered by <span className="gemini-logo">Gemini</span>
  </div>

  <button className={`settings-btn ${isSettingsModalOpen ? 'active' : ''}`} onClick={toggleSettingsModal}>
    <FaCog />
  </button>

  {isSettingsModalOpen && (
    <div className="settings-modal">
      <button className="modal-btn" onClick={handleClearHistory}>
        Clear Messages
      </button>
      <button className="modal-btn" onClick={clickChatHistory}>
        Chat History
      </button>
    </div>
  )}
</div>

      <div className="chat-ui">
      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="feedback-modal-content">
            <h2>Report a Problem</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe the issue"
                required
              />
               <div class="feedback-modal-buttons">


              <button type="submit" disabled={loadingFeedback}>
                {loadingFeedback ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowFeedbackModal(false)} type='button'>Close</button>
              {successMessage && <p>{successMessage}</p>}
              </div>
            </form>
            
          </div>
        </div>
      )}
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
                        Add To Notes
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
                <Loader/>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="messageBox__ai__loader__light">
  <div className="input-group__ai__loader__light">
    <input
      id="messageInput__ai__loader__light"
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Ask Gemini"
      onKeyDown={handleKeyDown} // Trigger the handleKeyDown function
      required
    />
  </div>

  {message.trim() ? (
    <button className="chat-send-btn__ai__loader__light" onClick={handleSendMessage}>
      <svg viewBox="0 0 664 663" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          fill="none"
        ></path>
        <path
          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          stroke="#333333" // Darker stroke for SVG icon
          strokeWidth="33.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  ) : (
    <button className="chat-send-btn__ai__loader__light" onClick={listening ? stopListening : startListening}>
      <FaMicrophone style={{color: 'white'}}/>
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
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

      // Toggle feedback form visibility
      const toggleFeedbackForm = () => {
          setShowFeedbackForm(prev => !prev);
      };


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
     
      <MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />

    </div>
  );
};

export default MathPage;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaArrowRight, FaArrowLeft, FaCog, FaMap } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import FeedbackForm from '../help/FeedbackForm';
import { TypeAnimation } from 'react-type-animation';
import AIPageTutorial from './AIPageTutorial';
import Loader from './mathLoader';
import AiLoaderSpeaking from './AiLoaderSpeaking';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import Modal from 'react-modal';
import { FaBook, FaPen, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import UpgradeModal from '../premium/UpgradeModal';
// Voice recognition setup (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;



const formatContent = (content) => {
  // Format code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
  
  // Format large headers
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");
  
  // Format bold text (replace "**text**" with "<strong>text</strong>")
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Format italic text (replace "*text*" with "<em>text</em>")
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // Format list items
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>");
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
  
  // Format tables
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

  // Format LaTeX/math expressions (inline math syntax: $math$ -> MathJax syntax)
  content = content.replace(/\$(.*?)\$/g, (_, math) => `\\(${math}\\)`);

  // Ensure all remaining asterisks are removed
  content = content.replace(/\*/g, "");

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
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isMagicModalOpen, setIsMagicModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [flashcardData, setFlashcardData] = useState({ name: '', subject: '' });
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [QuizData, setQuizData] = useState({ name: '', subject: '' });
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
const [magicModalContent, setMagicModalContent] = useState('');
const [image, setImage] = useState(null); // Only one image state
const [result, setResult] = useState(null);
const [imageprev, setImageprev] = useState(null); // Only one image state
const [pdfFile, setPdfFile] = useState(null);
const [isPremium, setIsPremium] = useState(null);
const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Add state
const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
const [isMindMapModalOpen, setIsMindMapModalOpen] = useState(false);
const [mindmapData, setMindMapData] = useState({ name: "", subject: ""});
const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
const [TasksData, setTasksData] = useState({ name: "", subject: ""});
const [activeToggle, setActiveToggle] = useState("");
const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
const [NotesData, setNotesData] = useState({ name: "", subject: ""});
const [generatedImages, setGeneratedImages] = useState([]); // Stores image responses
const [imageChatHistory, setImageChatHistory] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoadingUser(false);
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchProfileData();
  }, []);
  
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
  
    const newHistory = [...chatHistory, { role: "user", parts: [{ text: message }] }];
    setChatHistory(newHistory);
    setLoading(true);
  
    const token = localStorage.getItem("token");
  
    try {
      // Check conversation limit for non-premium users
      if (!isPremium) {
        try {
          const convoResponse = await axios.post(API_ROUTES.checkConvoCountAi, { token });
  
          if (convoResponse.data.convoCount >= 5) {
            setChatHistory([
              ...newHistory,
              {
                role: "model",
                parts: [{ text: "You've reached the daily limit. Upgrade to Premium for unlimited image generation!" }],
              },
            ]);
            setLoading(false);
            navigate("/subscription");
            return;
          }
        } catch (error) {
          console.error("Error checking conversation count:", error);
        }
      }
  
      // Call AI image generation API
      const response = await axios.post(API_ROUTES.generateImage, { message, token });
  
      const formattedResultText = formatContent(response.data.text);
      const imageData = response.data.image;
  
      const updatedChatHistory = [
        ...newHistory,
        { role: "model", parts: [{ text: formattedResultText }] }, // AI text response
      ];
  
      // If image is generated, store it separately in state & localStorage
      if (imageData) {
        const updatedImageHistory = [...imageChatHistory, { image: imageData }];
  
        setImageChatHistory(updatedImageHistory);
        localStorage.setItem("imageChatHistory", JSON.stringify(updatedImageHistory));
  
        updatedChatHistory.push({ role: "model", parts: [{ image: imageData }] });
      }
  
      setChatHistory(updatedChatHistory);
      localStorage.setItem("new_ai_chat_history", JSON.stringify(updatedChatHistory));
  
      setMessage("");
    } catch (error) {
      console.error("Error generating image:", error);
      setChatHistory([
        ...newHistory,
        { role: "model", parts: [{ text: "Something went wrong while generating the image. Please try again later." }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
          .then(response => setIsPremium(response.data.premium))
          .catch(() => setIsPremium(false));
      } else {
        setIsPremium(false);
      }
    }, []);
  
 
  
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



  const clickChatHistory = () => {
    navigate('/ai/chat/history')
  }

  const defaultPage = (
    <div className="container__default__ai__PageWrapper">
      {/* Gradient Greeting */}
      <div className="greeting-message">
        <h1>
          <span className="gradient-text">
            {profile ? `Hello,` : 'Hello,'}
          </span>
          <br />
          <span className="gradient-text">
            {profile
              ? `${profile.unique_id.length > 16 
                  ? profile.unique_id.slice(0, 16) + '...' 
                  : profile.unique_id}`
              : 'User'}
          </span>
          <br />
        </h1>
      </div>
    </div>
  );
  
  
  const handleKeyDown = (e) => {
    if (loading) return; // Prevent action if loading is true
  
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  

  

  
  const handleClearHistory = () => {
    localStorage.removeItem("imageChatHistory");
  
    setChatHistory([
      { role: "user", parts: [{ text: "Hello" }] },
      { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
    ]);
  
    setImageChatHistory([]);
    setConversationStarted(false);
  };
  

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }, [chatHistory, imageChatHistory]); // Run whenever chat history or images update
  

const swicthChatbot = () => {
  navigate('/ai')
}

const SparkleIcon = () => (
  <svg height="24" width="24" fill="#9b4d96" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
  </svg>
);

  return (
    <div className="mathsolver-container">
           {!tutorialComplete && <AIPageTutorial onComplete={handleTutorialComplete} />}


           <div className="math-page-header">
  <button className="back-btn" onClick={() => navigate('/')}>
    <FaArrowLeft />
  </button>

  <div style={{ fontSize: "10px", color: "#666", textAlign: "center", padding: "4px 0" }}>

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
 
      <button className="modal-btn" onClick={swicthChatbot}>
        Chat box
      </button>

    </div>
  )}
</div>

      <div className="chat-ui">
     
        <div className="chat-messages" style={{marginBottom: '60px'}}>
          {!conversationStarted ? (
            defaultPage
          ) : (
            chatHistory.slice(2).map((result, index) => (
              <div key={index} className={`chat-message ${result.role}`}>
                <div className="chat-bubble">
                  <span className="chat-role">{result.role === 'user' ? 'You' : 'AI'}:</span>
                  <MathJaxContext>
                    <div
                      className="chat-result-content"
                      dangerouslySetInnerHTML={{ __html: result.parts.map((part) => part.text).join('') }}
                    />
                  </MathJaxContext>
{result.role === "model" && (
  <div>
    {/* Display generated image if available */}
    {result.parts.some((part) => part.image) && (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
        <img
          src={`data:image/png;base64,${result.parts.find((part) => part.image)?.image}`}
          alt="Generated"
          style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "12px" }}
        />

        {/* Download Button */}
        <a
          href={`data:image/png;base64,${result.parts.find((part) => part.image)?.image}`}
          download="generated-image.png"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            borderRadius: "50px",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            textDecoration: "none",
            width: "45px",
            height: "45px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>
    )}
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

        
        <div className="messageBox__ai__loader__light">
  <div className="input-group__ai__loader__light">
    <input
      id="messageInput__ai__loader__light"
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Describe an image"
      onKeyDown={handleKeyDown} // Trigger the handleKeyDown function
      required
    />
  </div>



  {message.trim() || image || pdfFile ? (
    <button
      className="chat-send-btn__ai__loader__light"
      onClick={handleSendMessage}
      disabled={loading}
    >
      {loading ? (
        <div style={{ width: "24px", height: "24px" }}>
          <AiLoaderSpeaking />
        </div>
      ) : (
        <svg viewBox="0 0 664 663" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            fill="none"
          ></path>
          <path
            d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            stroke="#333333"
            strokeWidth="33.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      )}
    </button>
  ) : (
    <button
      className="chat-send-btn__ai__loader__light"
      onClick={listening ? stopListening : startListening}
    >
      <FaMicrophone style={{ color: "white" }} />
    </button>
  )}
  {/* Toggle Buttons Container */}
<div className="toggle-buttons-container__ai">

</div>

</div>
<div style={{textAlign: 'center'}}>
<small className="disclaimer-text">Edusify can make mistakes. Check important info.</small>
</div>
      </div>
  
<UpgradeModal 
  message="This feature is available for Premium users only. Upgrade to Premium for unlimited access and additional features!" 
  isOpen={isUpgradeModalOpen} 
  onClose={() => setIsUpgradeModalOpen(false)} 
/>


    </div>
  );
};


// Main Component with Voice Command
const MathPageImageGen = () => {
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
     
      {}<MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />

    </div>
  );
};

export default MathPageImageGen;
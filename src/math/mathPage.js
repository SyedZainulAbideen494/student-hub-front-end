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
const [thinkingMode, setThinkingMode] = useState(false); // Toggle state
const [selectedMode, setSelectedMode] = useState("Edusify E1");
const [dropdownOpen, setDropdownOpen] = useState(false);

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
    if (!message.trim() && !image && !pdfFile) return; // Ensure message, image, or PDF is provided
  
    if (!conversationStarted) setConversationStarted(true);
  
    const newHistory = [...chatHistory, { role: "user", parts: [{ text: message || " " }] }];
    setChatHistory(newHistory);
    setLoading(true);
  
    const token = localStorage.getItem("token");
  
    try {
      // If user is NOT premium, check today's conversation count
      if (!isPremium) {
        try {
          const convoResponse = await axios.post(API_ROUTES.checkConvoCountAi, { token });
      
          if (convoResponse.data.convoCount >= 2) {
            setChatHistory([
              ...newHistory,
              { role: "model", parts: [{ text: "You've reached the daily limit. Upgrade to Premium for unlimited chats!" }] },
            ]);

            return;
          }
        } catch (error) {
          console.error("Error checking conversation count:", error);
        }
      }
      
      let formattedResultText = "";
      let followUpMessage = message;
  
      if (pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("prompt", message || "Analyze this PDF deeply and extract all key concepts, summarized explanations, important definitions, examples, formulas, and diagrams (if any). Identify the intended audience, structure the content into sections, and highlight exam-relevant insights, real-world applications, and any patterns in how the information is presented. If this is study material, suggest how a student can best use it for revision or preparation. Avoid simply describing the document — instead, aim to provide a clear, useful breakdown of what can be learned from it and provide details and answers from it.");
        formData.append("token", token);
  
        const response = await axios.post(API_ROUTES.aiPdfProcessing, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        formattedResultText = formatContent(response.data.result);
        followUpMessage = message || "Here's the extracted information from your PDF.";
        setPdfFile(null);
      } else if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("prompt", message || "Analyze this image and provide details and answers from it.");
        formData.append("token", token);
  
        const response = await axios.post(API_ROUTES.aiImgProcessing, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        formattedResultText = formatContent(response.data.result);
        followUpMessage = message || "Here's what I found in the image.";
        setImage(null);
      } else {
        if (!message.trim()) throw new Error("Message cannot be empty.");
  
        const response = await axios.post(API_ROUTES.aiGemini, {
          message,
          chatHistory: newHistory,
          token,
          thinkingMode, // Send this flag to backend
        });
    
        formattedResultText = formatContent(response.data.response);
        followUpMessage = "";
      }
  
      setChatHistory([...newHistory, { role: "model", parts: [{ text: formattedResultText }] }]);
      setMessage(""); // Clear the input after success

    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory([...newHistory, { role: "model", parts: [{ text: "Something went wrong. Please try again later." }] }]);
    } finally {
      setLoading(false);
    }
  };
  
  

  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
    
      // Check if the message has already been shown
      if (!localStorage.getItem('betaMessageShown')) {
        alert('This feature is currently in beta and may not be fully accurate.');
        localStorage.setItem('betaMessageShown', 'true'); // Store the flag in local storage
      }
    
      if (file && file.type.startsWith("image/")) {
        setImage(file);
        setImageprev(URL.createObjectURL(file)); // Set the image preview
      } else {
        setError("Please upload a valid image file.");
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
  
  const handleCreateNotes = (content) => {
    // Only pass serializable content, not the event object
    navigate('/notes/create', { state: { editorContent: content } });
  };


  const checkMagicUsage = async () => {
    try {
      const response = await fetch(API_ROUTES.magicUseage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('token') }), // Send token in request body
      });
  
      const data = await response.json();
      return data.canUseMagic; // Returns true if the user can use Magic, otherwise false
    } catch (error) {
      console.error('Error checking magic usage:', error);
      return false; // Assume the user cannot use Magic if an error occurs
    }
  };
  

  const handleMagicButtonClick = async (content) => {
    setMagicModalContent(content); // Store content of the clicked chat message
  
    // Always open the Magic Modal
    setIsMagicModalOpen(true);
  };
  
  const handleGenerateFlashcards = async (content) => {
    setIsMagicModalOpen(false);
  
    if (!isPremium) {
      const canUseMagic = await checkMagicUsage();
      if (!canUseMagic) {
        setIsUpgradeModalOpen(true); // Show upgrade modal if free user has exhausted limit
        return;
      }
    }
  
    setIsFlashcardModalOpen(true);
    setFlashcardData({ ...flashcardData, content }); // Pass content to flashcard modal
  };


  const handleGenerateMindMap = async (content) => {
    setIsMagicModalOpen(false);

    if (!isPremium) {
      const canUseMagic = await checkMagicUsage();
      if (!canUseMagic) {
        setIsUpgradeModalOpen(true); // Show upgrade modal if free user has exhausted limit
        return;
      }
    }

    setIsMindMapModalOpen(true);
    setMindMapData({ ...mindmapData, content }); // Pass content to mind map modal
  };

  
  const handleGenerateQuiz = async (content) => {
    setIsMagicModalOpen(false);
  
    if (!isPremium) {
      navigate('/subscription')
      setIsMagicModalOpen(false); // Close magic modal
      return;
  }
  
    setIsQuizModalOpen(true);
    setQuizData({ ...QuizData, content }); // Pass content to quiz modal
  };
  
  const handleGenerateTasks = async (content) => {
    setIsMagicModalOpen(false);
  
    if (!isPremium) {
      const canUseMagic = await checkMagicUsage();
      if (!canUseMagic) {
        setIsUpgradeModalOpen(true); // Show upgrade modal if free user has exhausted limit
        return;
      }
    }
  
    setIsTasksModalOpen(true);
    setTasksData({ ...TasksData, content }); // Pass content to quiz modal
  };

  const handleSubmitMindMap = async (selectedContent) => {
    const token = localStorage.getItem("token");

    if (!isPremium) {
      navigate('/subscription')
      setIsMagicModalOpen(false); // Close magic modal
      return;
  }

    const headings = selectedContent; // Use selected content directly

    setIsGeneratingMindMap(true);
    navigate("/loading-magic"); // Redirect to loading page

    try {
        const response = await fetch(API_ROUTES.generateMindMapFromMagic, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                headings,
                subject: "Ai Magic",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error generating mind map:", errorData.error);
            navigate("/ai"); // Redirect to /ai if an error occurs
            return;
        }

        const data = await response.json();
        console.log("Mind Map generated:", data);

        navigate(`/mindmap/${data.mindmapId}`); // Redirect to the generated mind map
        setMindMapData({ name: "", subject: "" });
    } catch (error) {
        console.error("Unexpected error:", error);
        navigate("/ai"); // Redirect to /ai if an unexpected error occurs
    } finally {
        setIsGeneratingMindMap(false);
    }
};

  
const handleSubmitNotes = async (selectedContent) => {
  const token = localStorage.getItem("token");

  if (!isPremium) {
    navigate('/subscription')
    setIsMagicModalOpen(false); // Close magic modal
    return;
}

  const headings = selectedContent; // Use selected content directly

  setIsGeneratingNotes(true);
  navigate("/loading-magic"); // Redirect to loading page

  try {
      const response = await fetch(API_ROUTES.generateNotesFromMagic, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              headings,
              subject: "Ai Magic",
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Error generating notes:", errorData.error);
          navigate("/ai"); // Redirect to /ai if an error occurs
          return;
      }

      const data = await response.json();
      console.log("Notes generated:", data);

      navigate(`/note/view/${data.noteId}`); // Redirect to the generated notes
      setNotesData({ name: "", subject: "" });
  } catch (error) {
      console.error("Unexpected error:", error);
      navigate("/ai"); // Redirect to /ai if an unexpected error occurs
  } finally {
      setIsGeneratingNotes(false);
  }
};


  const handleSubmitTasks = async (selectedContent) => {
    const token = localStorage.getItem('token');

    if (!isPremium) {
      navigate('/subscription')
      setIsMagicModalOpen(false); // Close magic modal
      return;
  }

    const headings = selectedContent; // Use the selected content directly

    setIsGeneratingTasks(true);
    navigate(`/loading-magic`); // Navigate to a loading page

    try {
        const response = await fetch(API_ROUTES.generateTasksFromMagic, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                headings,
                subject: 'helo',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error generating tasks:', errorData.error);
            navigate(`/ai`); // Redirect to an error page
            return;
        }

        const data = await response.json();
        console.log('Tasks generated:', data);

        navigate(`/planner`); // Navigate to planner once tasks are ready
        setTasksData({ name: '', subject: '' });
    } catch (error) {
        console.error('Unexpected error:', error);
        navigate(`/ai`); // Handle unexpected errors
    } finally {
        setIsGeneratingTasks(false);
    }
};

  
const handleSubmitFlashcards = async (selectedContent) => {
  const token = localStorage.getItem("token");

  // Check if the user is not premium and has exhausted their free usage
  if (!isPremium) {
    navigate('/subscription')
    setIsMagicModalOpen(false); // Close magic modal
    return;
}

  const headings = selectedContent; // Use the selected content directly

  setIsGeneratingFlashcards(true);
  navigate("/loading-magic"); // Redirect to loading page

  try {
      const response = await fetch(API_ROUTES.generateFlashcardsFromMagic, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              headings,
              subject: "Ai Magic",
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Error generating flashcards:", errorData.error);
          navigate("/ai"); // Redirect to /ai if an error occurs
          return;
      }

      const data = await response.json();
      console.log("Flashcards generated:", data);

      navigate(`/flashcard/set/${data.flashcardSetId}`); // Redirect to the generated flashcard set
      setFlashcardData({ name: "", subject: "" });
  } catch (error) {
      console.error("Unexpected error:", error);
      navigate("/ai"); // Redirect to /ai if an unexpected error occurs
  } finally {
      setIsGeneratingFlashcards(false);
  }
};

  

const handleSubmitQuiz = async (selectedContent) => {
  const token = localStorage.getItem("token");

  // Check if the user is not premium and prevent access to the quiz feature
  if (!isPremium) {
    navigate('/subscription')
      setIsMagicModalOpen(false); // Close magic modal
      return;
  }

  const notes = selectedContent; // Use the selected content directly

  setIsGeneratingQuiz(true);
  navigate("/loading-magic"); // Redirect to loading page

  try {
      const response = await fetch(API_ROUTES.generateQuizFromMagic, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              notes,
              subject: "Ai Magic",
              token,
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Error generating quiz:", errorData.error);
          navigate("/ai"); // Redirect to /ai if an error occurs
          return;
      }

      const data = await response.json();
      console.log("Quiz generated:", data);

      navigate(`/quiz/${data.quizId}`); // Redirect to the generated quiz
      setQuizData({ subject: "" });
  } catch (error) {
      console.error("Unexpected error:", error);
      navigate("/ai"); // Redirect to /ai if an unexpected error occurs
  } finally {
      setIsGeneratingQuiz(false);
  }
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
  
  
  useEffect(() => {

    const handleLogin = () => {
      // Remove old keys
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('ai_chat_history');
    
      // Get the current chat history from localStorage
      const storedChatHistory = JSON.parse(localStorage.getItem('new_ai_chat_history')) || [];
    
      // Check if the history contains the model role with nested objects in 'parts'
      const containsComplexParts = storedChatHistory.some(item =>
        item.role === 'model' && item.parts.some(part => typeof part.text === 'object')
      );
    
      // If complex parts (objects) are found in the 'model' role, clear the history
      if (containsComplexParts) {
        localStorage.removeItem('new_ai_chat_history'); // Clear the history
        console.log("Complex model parts found. History cleared.");
      } else {
        console.log("No complex model parts found. History not cleared.");
      }
    
      // Optional: Check if the flag is set (it shouldn't be)
      console.log("new_ai_chat_history_cleared:", localStorage.getItem('new_ai_chat_history_cleared')); // Should be null or undefined
    };
    
    // Call the function to test
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

// Inside the component
useEffect(() => {
  // Trigger MathJax formatting after chat history is updated
  if (window.MathJax) {
    window.MathJax.typeset();
  }
}, [chatHistory]); // Run whenever the chat history is updated


const swicthChatbot = () => {
  navigate('/ai/image')
}

const handleSelect = (mode) => {
  setSelectedMode(mode);
  setDropdownOpen(false);

  if (mode === "Edusify T1") {
    setThinkingMode(true);
  }
};


const SparkleIcon = () => (
  <svg height="24" width="24" fill="#9b4d96" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
  </svg>
);

  return (
    <div className="mathsolver-container">
           {!tutorialComplete && <AIPageTutorial onComplete={handleTutorialComplete} />}


           <div className="math-page-header">
  <button className="back-btn" onClick={() => navigate('/')} style={{color: "white"}}>
    <FaArrowLeft />
  </button>

  <div style={{ textAlign: "center", padding: "4px 0", position: "relative" }}>
      {/* Button to trigger dropdown */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={dropdownButtonStyle}
      >
        {getSparkleIcon(selectedMode)}
        {selectedMode} <span style={{ fontSize: "12px", marginLeft: "6px" }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div style={dropdownMenuStyle}>
          {/* Edusify E1 - Everyday Model */}
          <button onClick={() => handleSelect("Edusify E1")} style={dropdownItemStyle}>
            {getSparkleIcon("Edusify E1")}
            <div>
              <b>Edusify E1</b>
              <p style={dropdownDescStyle}>Everyday AI model, best for daily student use.</p>
            </div>
          </button>

          {/* Edusify T1 - Thinking Model */}
          <button onClick={() => handleSelect("Edusify T1")} style={dropdownItemStyle}>
            {getSparkleIcon("Edusify T1")}
            <div>
              <b>Edusify T1</b>
              <p style={dropdownDescStyle}>Thinking model for deep analysis and complex queries.</p>
            </div>
          </button>

        </div>
      )}
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
                  {result.role === 'model' && (
                    <div>
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <button className="flashcard__set__page__ai-explain-btn" onClick={() => handleMagicButtonClick(result.parts.map((part) => part.text).join(''))}>
      <SparkleIcon className="ai-explain-flashcard-icon" /> Click Here
    </button>
  </div>
  <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
    This chatbot can't add/edit tasks or study plans. <br />
    Click above to generate content like flashcards or quizzes.
  </div>
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
      placeholder="Type here.."
      onKeyDown={handleKeyDown} // Trigger the handleKeyDown function
      required
    />
  </div>

  {/* Image input field with label */}
  <div className="image-upload-container">
    <label htmlFor="imageUpload" className="image-upload-label">
      <i className="fas fa-paperclip" style={{ marginRight: '10px', color: '#464646' }}>
        {image && (
          <div className="image-preview-container">
            <img src={imageprev} alt="Image Preview" style={{ maxWidth: '30px', maxHeight: '30px' }} />
          </div>
        )}
      </i>
    </label>
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="image-upload-input"
    />
  </div>

{/* PDF input field */}
<div className="pdf-upload-container">
  <label htmlFor="pdfUpload" className="pdf-upload-label">
    <i className="fas fa-file-pdf" style={{ marginRight: '10px', color: '#464646' }}>
      {pdfFile && (
        <div className="pdf-preview-container">
          <span style={{ fontSize: '7px' }}>uploaded!</span>
        </div>
      )}
    </i>
  </label>
  <input
    id="pdfUpload"
    type="file"
    accept="application/pdf" // Restrict to PDFs
    onChange={(e) => {
      const file = e.target.files[0];
      if (file && file.type !== "application/pdf") {
        alert("Only PDF files are allowed!"); // Alert if not a PDF
        e.target.value = null; // Reset the input value
      } else {
        setPdfFile(file); // Set the file if it's valid
      }
    }}
    className="pdf-upload-input"
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
      <Modal
  isOpen={isMagicModalOpen}
  onRequestClose={() => setIsMagicModalOpen(false)}
  className="magic__ai__magic__modal__ai__page"
  overlayClassName="magic__ai__modal__overlay"
>

  <button onClick={() => setIsMagicModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  
  <h2 className="modal-title__magic__modal__ai__page">What do you want to do with this AI response?</h2>
  <div className="modal-actions__magic__modal__ai__page">
  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
    
    <button 
      className="flashcard__set__page__ai-explain-btn" 
      onClick={() => handleSubmitFlashcards(magicModalContent)}
      style={{ width: "220px" }}
    >
      <SparkleIcon className="ai-explain-flashcard-icon" /> Generate Flashcards
    </button>

    <button 
      className="flashcard__set__page__ai-explain-btn" 
      onClick={() => handleSubmitMindMap(magicModalContent)}
      style={{ width: "220px" }}
    >
      <SparkleIcon className="ai-explain-flashcard-icon" /> Generate Mind-Map
    </button>

    <button 
      className="flashcard__set__page__ai-explain-btn" 
      onClick={() => handleSubmitQuiz(magicModalContent)}
      style={{ width: "220px" }}
    >
      <SparkleIcon className="ai-explain-flashcard-icon" /> Generate Quiz
    </button>
    <button 
      className="flashcard__set__page__ai-explain-btn" 
      onClick={() => handleSubmitTasks(magicModalContent)}
      style={{ width: "220px" }}
    >
      <SparkleIcon className="ai-explain-flashcard-icon" /> Generate Tasks
    </button>
    <button 
      className="flashcard__set__page__ai-explain-btn" 
      onClick={() => handleSubmitNotes(magicModalContent)}
      style={{ width: "220px" }}
    >
      <SparkleIcon className="ai-explain-flashcard-icon" /> Generate Notes
    </button>

  </div>
</div>

</Modal>


{/* Flashcard Modal */}
<Modal
  isOpen={isFlashcardModalOpen}
  onRequestClose={() => setIsFlashcardModalOpen(false)}
  className="flashcard__modal__ai__magic__page"
>
  <button onClick={() => setIsFlashcardModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  <h2 className="modal-title__magic__modal__ai__page">Generate Flashcards</h2>
  <div className="flashcard-modal-content__magic__modal__ai__page">
    <input
      type="text"
      placeholder="Title"
      value={flashcardData.subject}
      onChange={(e) => setFlashcardData({ ...flashcardData, subject: e.target.value })}
      className="modal-input__magic__modal__ai__page"
    />
    {/* Removed the textarea, using selected content instead */}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  onClick={() => handleSubmitFlashcards(magicModalContent)} 
  disabled={isGeneratingFlashcards}
>
  <div className={`sparkle__set__page__buttons ${isGeneratingFlashcards ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGeneratingFlashcards ? 'Generating...' : 'Generate'}
    </span>
  </div>
</button>
</div>
  </div>
</Modal>

<Modal
  isOpen={isTasksModalOpen}
  onRequestClose={() => setIsSettingsModalOpen(false)}
  className="flashcard__modal__ai__magic__page"
>
  <button onClick={() => setIsSettingsModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  <h2 className="modal-title__magic__modal__ai__page">Generate Tasks</h2>
  <div className="flashcard-modal-content__magic__modal__ai__page">
    <input
      type="text"
      placeholder="Title"
      value={TasksData.subject}
      onChange={(e) => setTasksData({ ...TasksData, subject: e.target.value })}
      className="modal-input__magic__modal__ai__page"
    />
    {/* Removed the textarea, using selected content instead */}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  onClick={() => handleSubmitFlashcards(magicModalContent)} 
  disabled={isGeneratingTasks}
>
  <div className={`sparkle__set__page__buttons ${isGeneratingTasks ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGeneratingTasks ? 'Generating...' : 'Generate'}
    </span>
  </div>
</button>
</div>
  </div>
</Modal>


{/* Flashcard Modal */}
<Modal
  isOpen={isMindMapModalOpen}
  onRequestClose={() => setIsMindMapModalOpen(false)}
  className="flashcard__modal__ai__magic__page"
>
  <button onClick={() => setIsMindMapModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  <h2 className="modal-title__magic__modal__ai__page">Generate Mind Map</h2>
  <div className="flashcard-modal-content__magic__modal__ai__page">
    <input
      type="text"
      placeholder="Title"
      value={mindmapData.subject}
      onChange={(e) => setMindMapData({ ...flashcardData, subject: e.target.value })}
      className="modal-input__magic__modal__ai__page"
    />
    {/* Removed the textarea, using selected content instead */}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  onClick={() => handleSubmitMindMap(magicModalContent)} 
  disabled={isGeneratingMindMap}
>
  <div className={`sparkle__set__page__buttons ${isGeneratingMindMap ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGeneratingMindMap ? 'Generating...' : 'Generate'}
    </span>
  </div>
</button>
</div>
  </div>
</Modal>



<Modal
  isOpen={isQuizModalOpen}
  onRequestClose={() => setIsQuizModalOpen(false)}
  className="quiz__modal__ai__magic__page"
>
  <button onClick={() => setIsQuizModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  <h2 className="modal-title__magic__modal__ai__page">Generate Quiz</h2>
  <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(magicModalContent); }} className="quiz-form__magic__modal__ai__page">
    <label className="modal-label__magic__modal__ai__page">
      Quiz title:
      <input
        type="text"
        value={QuizData.subject}
        onChange={(e) => setQuizData({ ...QuizData, subject: e.target.value })}
        required
        className="modal-input__magic__modal__ai__page"
      />
    </label>

     {/* Removed the textarea, using selected content instead */}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
   type="submit"
  disabled={isGeneratingQuiz}
>
  <div className={`sparkle__set__page__buttons ${isGeneratingQuiz ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGeneratingQuiz ? 'Generating...' : 'Generate'}
    </span>
  </div>
</button>
</div>
  </form>
</Modal>
<UpgradeModal 
  message="This feature is available for Premium users only. Upgrade to Premium for unlimited access and additional features!" 
  isOpen={isUpgradeModalOpen} 
  onClose={() => setIsUpgradeModalOpen(false)} 
/>


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
     
      {}<MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />

    </div>
  );
};

// Styles
const dropdownButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  color: "rgb(112, 215, 255)",
  background: "transparent",
  border: "2px solid rgba(112, 215, 255, 0.6)",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
};

const dropdownMenuStyle = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#222",
  borderRadius: "8px",
  padding: "10px 0",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  zIndex: 10,
  minWidth: "220px",
};

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  color: "white",
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.2s",
  width: "100%",
  textDecoration: 'none'
};

const dropdownDescStyle = {
  fontSize: "12px",
  margin: "2px 0 0",
  color: "rgba(255, 255, 255, 0.7)",
};

// Sparkle Icons with Different Colors
const getSparkleIcon = (mode) => {
  let color;
  switch (mode) {
    case "Edusify E1":
      color = "rgb(112, 215, 255)"; // Cyan
      break;
    case "Edusify T1":
      color = "rgb(191, 90, 242)"; // Purple
      break;
    case "Edusify V1":
      color = "rgb(255, 215, 0)"; // Gold
      break;
    default:
      color = "rgb(112, 215, 255)";
  }

  return (
    <svg
      height="18"
      width="18"
      fill={color}
      viewBox="0 0 24 24"
      style={{ marginRight: "8px" }}
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
  );
};

export default MathPage;
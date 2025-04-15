import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './GenerateQuiz.css'; // Import the new CSS file
import axios from 'axios';
import { FaSearch, FaShareAlt, FaEye, FaTrash, FaPlus, FaPlay } from 'react-icons/fa';

const GenerateQuiz = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [isExceededLimit, setIsExceededLimit] = useState(false);

  const generateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Check if subject or topic is missing
    if (!subject || !topic) {
        alert("Please provide both subject and topic.");
        setLoading(false);
        return; // Prevent further execution
    }
  
    const token = localStorage.getItem("token");

    // **Navigate to a loading page before making the API call**
    navigate("/loader/quiz/ai");

    try {
        const response = await fetch(API_ROUTES.generateAiQuiz, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject, topic, token }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate quiz, please try again");
        }

        const data = await response.json();

        // **Navigate to the actual quiz page once loaded**
        navigate(`/quiz/${data.quizId}`);
    } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        navigate("/error"); // Redirect to an error page if needed
    } finally {
        setLoading(false);
    }
};

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => {
          setIsPremium(response.data.premium);
          
          if (!response.data.premium) {
            // Fetch AI-generated flashcards count for free users
            axios.get(API_ROUTES.QuizCountAiFree, {
              headers: { 'Authorization': token }
            })
            .then((res) => {
              setFlashcardsCount(res.data.QuizzesCount);
              if (res.data.QuizzesCount >= 1) { // Adjusted to 2 per week limit
                setIsExceededLimit(true);
              }
            })
            .catch((err) => {
              console.error("Error fetching AI flashcards count:", err);
            });
          }
        })
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);



  useEffect(() => {
    const fetchQuizzes = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(API_ROUTES.getUserQuizzes, { token });
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    fetchQuizzes();
}, []);

const filteredQuizzes = quizzes.filter(quiz =>
  quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const handleQuizAnswers = (quizId) => {
  navigate(`/quiz/answers/${quizId}`); // Navigate to the quiz answers page with the quiz ID
};

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store the selected file
  };

  const generateQuizFromPDF = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Navigate to the loading screen
    navigate("/loader/quiz/ai");

    // Extract the file from the form
    const file = selectedFile;

    // Auto-fill subject and topic if empty using filename
    let autoSubject = subject;
    let autoTopic = topic;

    if (file && file.name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const words = fileName.split(" "); // Split into words

        if (!subject) autoSubject = words[0] || "Unknown Subject"; // Use first word as subject
        if (!topic) autoTopic = words.slice(1).join(" ") || "General"; // Use remaining words as topic
    }

    // Validation check for missing fields
    if (!file || !autoSubject || !autoTopic) {
        alert("Please upload a PDF, and ensure subject and topic are correctly set.");
        setLoading(false);
        return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("subject", autoSubject);
    formData.append("topic", autoTopic);
    formData.append("token", token);

    try {
        const response = await fetch(API_ROUTES.generateQuizFromPDF, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to generate quiz from PDF, please try again");
        }

        const data = await response.json();
        navigate(`/quiz/${data.quizId}`);
    } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        // If an error occurs, navigate back or show an error screen
        navigate("/error"); // Or show a toast message instead
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="quiz-container__new__ui__Ai__gen__Quiz">
      <header className="header__new__ui__Ai__gen__Quiz">
        <button className="back-button__new__ui__Ai__gen__Quiz" onClick={() => navigate(-1)}>←</button>
      </header>
      <h1 className="title__new__ui__Ai__gen__Quiz">Generate AI Quiz</h1>

      <form onSubmit={generateQuiz} className="quiz-form__new__ui__Ai__gen__Quiz">
        <div className="input-group__new__ui__Ai__gen__Quiz">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div className="input-group__new__ui__Ai__gen__Quiz">
          <label>Topic Name</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required />
        </div>

        <div className="centered-button-container__new__ui__Ai__gen__Quiz">
          {isExceededLimit && !isPremium ? (
            <div className="locked-message__new__ui__Ai__gen__Quiz">
              <span>🔒</span>
              <p>You've reached the free limit! Upgrade to **Edusify Premium** for unlimited AI quizzes. 🚀</p>
              <button onClick={() => navigate('/subscription')}>Upgrade Now →</button>
            </div>
          ) : (
            <button type="submit" disabled={loading} className="generate-button__new__ui__Ai__gen__Quiz">
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          )}
        </div>
      </form>

      <form onSubmit={generateQuizFromPDF} className="pdf-quiz-form__new__ui__Ai__gen__Quiz">
        <p>Or Generate from PDF</p>
        {isPremium ? (
          <label className="file-input__new__ui__Ai__gen__Quiz">
            <input type="file" accept="application/pdf" required onChange={handleFileChange} />
            <span>Choose File</span>
          </label>
        ) : (
          <p className="premium-lock-message__new__ui__Ai__gen__Quiz">👑 Upgrade to Premium for PDF Quizzes</p>
        )}

        {selectedFile && <p className="selected-file__new__ui__Ai__gen__Quiz">Selected File: {selectedFile.name}</p>}

        <button type="submit" disabled={loading} className="generate-pdf-button__new__ui__Ai__gen__Quiz" style={{marginTop: '15px'}}>
          {loading ? "Generating..." : "Generate From PDF"}
        </button>
      </form>

      {error && <p className="error-message__new__ui__Ai__gen__Quiz">Error: {error}</p>}
    </div>
  );
};

export default GenerateQuiz;

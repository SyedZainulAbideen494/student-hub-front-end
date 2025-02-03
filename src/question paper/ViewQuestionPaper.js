import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ViewQuestionPaper.css';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { API_ROUTES } from '../app_modules/apiRoutes';

const ViewQuestionPaper = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false); // State for toggling answers
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(API_ROUTES.getuserQuestionPaper, {
          headers: { token },
        });
        const selectedPaper = response.data.questionPapers.find(p => p.id === parseInt(id));
        setPaper(selectedPaper);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching paper:', error);
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

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

  if (loading) return <p className="loading__question__paper__generated__ai__view">Loading...</p>;
  if (!paper) return <p className="error__question__paper__generated__ai__view">Question paper not found.</p>;

  const handleBack = () => navigate('/all-papers');
  const toggleAnswers = () => setShowAnswers(prevState => !prevState);

  // Function to blur the bottom 70% of questions
  const applyBottomBlur = (htmlContent, unblurredPercentage) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const questions = doc.querySelectorAll('li'); // Assuming questions are in <li> tags

    if (questions.length === 0) {
      console.error('No questions found. Check the HTML structure.');
      return htmlContent; // Return original content if no questions are found
    }

    const unblurredCount = Math.floor(questions.length * unblurredPercentage);

    questions.forEach((question, index) => {
      if (index >= unblurredCount) {
        question.style.filter = 'blur(5px)'; // Apply blur effect
        question.style.userSelect = 'none'; // Prevent text selection
        question.style.pointerEvents = 'none'; // Prevent interaction
      }
    });

    return doc.body.innerHTML;
  };

  const blurredQuestions = isPremium ? paper.questions : applyBottomBlur(paper.questions, 0.3);

  return (
    <div className="paper__question__paper__generated__ai__view">
      <button className="back__btn__question__paper__generated__ai__view" onClick={handleBack}>
        <FaArrowLeft /> 
      </button>
      
      {/* Disclaimer message */}
      <div className="disclaimer__message">
        <p><i>Sample practice paper for practice purposes. Not an accurate real exam representation. Multiple papers can be generated for different chapters/subjects.</i></p>
      </div>

      <h1 className="title__question__paper__generated__ai__view">{paper.subject} (Grade {paper.grade})</h1>
      <p className="board__question__paper__generated__ai__view"><b>Board:</b> {paper.board}</p>

        {isPremium ? (
  <button className="toggle-btn" onClick={toggleAnswers} style={{marginBottom: '30px'}}>
  {showAnswers ? 'Show Questions' : 'Show Answers'}
</button>
      ) : (
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: '10px' }}>
  <Link to='/subscription' style={{textDecoration: 'none'}}>
<button className="action__button__today__ai__pan_overview__locked__premium__" style={{marginBottom: '30px'}}>
  <FaLock className="lock-icon" /> Get Answers<span>Premium</span>
</button>
</Link>
</div>

      )}

      {/* Conditionally render questions or answers */}
      <div className="questions__question__paper__generated__ai__view">
        {showAnswers && isPremium ? (
          <div dangerouslySetInnerHTML={{ __html: paper.answers }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: blurredQuestions }} />
        )}
      </div>

      {isPremium ? (
        <button className="action__button__today__ai__pan_overview">
          Get New Plan
        </button>
      ) : (
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: '10px' }}>
  <Link to='/subscription' style={{textDecoration: 'none'}}>
<button className="action__button__today__ai__pan_overview__locked__premium__">
  <FaLock className="lock-icon" /> Get Full Paper <span>Premium</span>
</button>
</Link>
</div>

      )}
    </div>
  );
};

export default ViewQuestionPaper;
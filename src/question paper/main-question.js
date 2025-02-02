import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GenerateQuestion.css';
import { FaLock, FaTimes } from 'react-icons/fa';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const GenerateQuestion = () => {
  const [subject, setSubject] = useState('');
  const [board, setBoard] = useState('');
  const [grade, setGrade] = useState('');
  const [chapters, setChapters] = useState([]);  
  const [newChapter, setNewChapter] = useState('');  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false); // For tooltip visibility
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate();

  const handleAddChapter = () => {
    if (newChapter.trim() && !chapters.includes(newChapter.trim())) {
      setChapters([...chapters, newChapter.trim()]);
      setNewChapter('');
    }
  };

  const handleRemoveChapter = (chapterToRemove) => {
    setChapters(chapters.filter(chapter => chapter !== chapterToRemove));
  };

  const validateFields = () => {
    if (!subject || !board || !grade || chapters.length === 0) {
      setError('Please fill in all fields and add at least one chapter.');
      return false;
    }
    setError('');
    return true;
  };

  const generateQuestionPaper = async () => {
    if (!validateFields()) {
      return; // If validation fails, don't proceed with generating the paper
    }

    const token = localStorage.getItem('token');
    setLoading(true);
    navigate('/type-writter-loader'); // Navigate to loader page

    try {
      const response = await axios.post(API_ROUTES.generateAIQuestionPaper, {
        subject,
        chapters,
        board,
        grade,
        token
      });

      const { message, questionPaper } = response.data;
      setLoading(false);
      // Redirect to view paper with the ID of the generated paper
      navigate(`/view-paper/${questionPaper.id}`); 
    } catch (error) {
      setLoading(false);
      console.error('Error generating question paper:', error);
      setError('Failed to generate question paper. Please try again.');
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

  // Auto-close the tooltip after 4 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 10000); // Tooltip will disappear after 10 seconds
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [showTooltip]);

  return (
    <div className="generate__Ai__Question__paper">
      <div className="card__generate__Ai__Question__paper">
        <div
          className="question-icon__generate__Ai__Question__paper"
          onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
          onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when hover ends
        >
          ?
          {showTooltip && (
            <div className="tooltip__generate__Ai__Question__paper">
              <p>This page allows you to generate practice question papers by selecting the subject, chapters, board, and grade. You can create custom question papers for practice.</p>
            </div>
          )}
        </div>
        <h1 className="title__generate__Ai__Question__paper">Generate Question Paper</h1>
        
        {/* Subject */}
        <input
          className="input__generate__Ai__Question__paper"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />

        {/* Chapters */}
        <div className="chapters__generate__Ai__Question__paper">
          <input
            className="input__generate__Ai__Question__paper"
            placeholder="Enter chapter name"
            value={newChapter}
            onChange={e => setNewChapter(e.target.value)}
          />
          <button
            className="add-chapter__generate__Ai__Question__paper"
            onClick={handleAddChapter}
            disabled={!newChapter.trim()}
          >
            +
          </button>
        </div>

        <ul className="chapters-list__generate__Ai__Question__paper">
          {chapters.map((chapter, index) => (
            <li key={index} className="chapter-item__generate__Ai__Question__paper">
              {chapter}
              <span 
                className="remove-chapter__generate__Ai__Question__paper"
                onClick={() => handleRemoveChapter(chapter)}
              >
               <FaTimes/>
              </span>
            </li>
          ))}
        </ul>

       {/* Board */}
<select
  className="input__generate__Ai__Question__paper scrollable-dropdown__qp__ai"
  value={board}
  onChange={e => setBoard(e.target.value)}
>
  <option value="">Select Board/Exam</option>
  <option value="CBSE">CBSE</option>
  <option value="ICSE">ICSE</option>
  <option value="State">State Board</option>
  <option value="JEE Mains">JEE Mains</option>
  <option value="JEE Advanced">JEE Advanced</option>
  <option value="NEET">NEET</option>
  <option value="CUET">CUET</option>
  <option value="GATE">GATE</option>
  <option value="UPSC">UPSC</option>
  <option value="CAT">CAT</option>
  <option value="SAT">SAT</option>
  <option value="GRE">GRE</option>
  <option value="GMAT">GMAT</option>
</select>

{/* Grade */}
<select
  className="input__generate__Ai__Question__paper scrollable-dropdown__qp__ai"
  value={grade}
  onChange={e => setGrade(e.target.value)}
>
  <option value="">Select Grade</option>
  <option value="1">1st</option>
  <option value="2">2nd</option>
  <option value="3">3rd</option>
  <option value="4">4th</option>
  <option value="5">5th</option>
  <option value="6">6th</option>
  <option value="7">7th</option>
  <option value="8">8th</option>
  <option value="9">9th</option>
  <option value="10">10th</option>
  <option value="11">11th</option>
  <option value="12">12th</option>
  <option value="0">Other</option>
</select>

        {/* Error Message */}
        {error && <div className="error-message__generate__Ai__Question__paper">{error}</div>}


        {isPremium ? (
  <button
    className={`button__generate__Ai__Question__paper ${loading ? 'loading' : ''}`}
    onClick={generateQuestionPaper}
    disabled={loading || chapters.length === 0}
  >
    {loading ? 'Generating...' : 'Generate'}
  </button>
) : (
<button className="button__generate__Ai__Question__paper" disabled>
  <FaLock className="lock-icon" /><span>Premium</span>
</button>
)}

        {/* Button to View Previously Generated Papers */}
        <button
          className="button__generate__Ai__Question__paper"
          onClick={() => navigate('/all-papers')}
        >
          View Previous Papers
        </button>
        <button
          className="button__generate__Ai__Question__paper"
          onClick={() => navigate('/view-paper/4')}
        >
          View Example Paper
        </button>
      </div>
      <FooterNav/>
    </div>
  );
};

export default GenerateQuestion;

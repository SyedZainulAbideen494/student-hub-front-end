import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const GenerateQuestion = () => {
  const [examType, setExamType] = useState('');
  const [subject, setSubject] = useState('');
  const [boardOrExam, setBoardOrExam] = useState('');
  const [grade, setGrade] = useState('');
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate();

  // Competitive Exams List
  const competitiveExams = ['JEE Mains', 'JEE Advanced', 'NEET', 'CUET', 'GATE', 'UPSC', 'CAT', 'SAT', 'GRE', 'GMAT'];

  // Handle exam selection
  const handleBoardOrExamChange = (e) => {
    const selectedExam = e.target.value;
    setBoardOrExam(selectedExam);
    setExamType(competitiveExams.includes(selectedExam) ? 'competitive' : 'board');

    // If competitive exam, reset subject, grade, and chapters
    if (competitiveExams.includes(selectedExam)) {
      setSubject('');
      setGrade('');
      setChapters([]);
    }
  };

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
    if (!boardOrExam) {
      setError('Please select an exam type.');
      return false;
    }

    if (examType === 'board' && (!subject || !grade || chapters.length === 0)) {
      setError('Please fill in all fields and add at least one chapter.');
      return false;
    }

    setError('');
    return true;
  };

  const generateQuestionPaper = async () => {
    if (!validateFields()) return;

    const token = localStorage.getItem('token');
    setLoading(true);
    navigate('/type-writter-loader'); // Navigate to loading page

    try {
      const response = await axios.post(API_ROUTES.generateAIQuestionPaper, {
        boardOrExam,
        subject: examType === 'board' ? subject : null,
        grade: examType === 'board' ? grade : null,
        token
      });

      const { questionPaper } = response.data;
      setLoading(false);
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
        .catch(() => setIsPremium(true));
    } else {
      setIsPremium(true);
    }
  }, []);

  return (
    <div className="generate__Ai__Question__paper">
      <div className="card__generate__Ai__Question__paper">
        <h1 className="title__generate__Ai__Question__paper">Generate Question Paper</h1>

        {/* Select Board/Exam */}
        <select
          className="input__generate__Ai__Question__paper scrollable-dropdown__qp__ai"
          value={boardOrExam}
          onChange={handleBoardOrExamChange}
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

        {/* Show Subject & Grade only for Board Exams */}
        {examType === 'board' && (
          <>
            {/* Subject */}
            <input
              className="input__generate__Ai__Question__paper"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />

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
            </select>

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
          </>
        )}

        {/* Error Message */}
        {error && <div className="error-message__generate__Ai__Question__paper">{error}</div>}

        {/* Generate Button */}
        <button
          className="button__generate__Ai__Question__paper"
          onClick={generateQuestionPaper}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        <button
          className="button__generate__Ai__Question__paper"
          onClick={() => navigate('/all-papers')}
        >
          View Generated Papers
        </button>
      </div>
      <FooterNav />
    </div>
  );
};

export default GenerateQuestion;

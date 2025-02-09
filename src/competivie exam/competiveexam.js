import { useState, useEffect } from 'react';
import { FaLock, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './QuizGeneratorExam.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const QuizGeneratorExam = () => {
  const [examType, setExamType] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [inputSubject, setInputSubject] = useState('');
  const [inputChapter, setInputChapter] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [isPremium, setIsPremium] = useState(null);


  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    if (!examType || subjects.length === 0 || chapters.length === 0) {
      alert('Please select an exam type and add at least one subject and chapter.');
      return;
    }

    setLoading(true);
    navigate('/loading/mock-exam'); // Navigate to loading page

    try {
      const response = await fetch(API_ROUTES.generateCompetiveExam, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examType, subjects, chapters, token: localStorage.getItem('token') }),
      });

      const data = await response.json();
      if (data.quizId) {
        setQuizId(data.quizId);
        navigate(`/quiz/${data.quizId}`); // Navigate to quiz page
      } else {
        alert('Quiz generation failed.');
        navigate(-1); // Go back if failed
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating quiz.');
      navigate(-1); // Go back if error occurs
    }
    setLoading(false);
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

  const addSubject = () => {
    if (inputSubject.trim() && !subjects.includes(inputSubject.trim())) {
      setSubjects([...subjects, inputSubject.trim()]);
      setInputSubject('');
    }
  };

  const addChapter = () => {
    if (inputChapter.trim() && !chapters.includes(inputChapter.trim())) {
      setChapters([...chapters, inputChapter.trim()]);
      setInputChapter('');
    }
  };

  return (
    <div className="quiz-wrapper__Quiz__com__gen">
    <div className="quiz-container__Quiz__com__gen">
      <h2 className="quiz-title__Quiz__com__gen">Competitive Exam Quiz</h2>

      {/* Exam Type Dropdown */}
      <label className="quiz-label__Quiz__com__gen">Select Exam Type</label>
      <select className="quiz-dropdown__Quiz__com__gen" value={examType} onChange={(e) => setExamType(e.target.value)}>
        <option value="">Select</option>
        {['NEET', 'JEE', 'UPSC', 'CAT', 'GATE', 'GMAT', 'GRE', 'SAT', 'CUET', 'CLAT', 'Banking', 'SSC'].map((exam) => (
          <option key={exam} value={exam}>{exam}</option>
        ))}
      </select>

      {/* Subjects Input */}
      <label className="quiz-label__Quiz__com__gen">Subjects</label>
      <div className="quiz-input-group__Quiz__com__gen">
        <input
          className="quiz-input__Quiz__com__gen"
          type="text"
          placeholder="e.g. Physics"
          value={inputSubject}
          onChange={(e) => setInputSubject(e.target.value)}
        />
        <button className="quiz-add-button__Quiz__com__gen" onClick={addSubject}>
          <FaPlus />
        </button>
      </div>
      <div className="quiz-tag-container__Quiz__com__gen">
        {subjects.map((subj, index) => (
          <span key={index} className="quiz-tag__Quiz__com__gen">{subj}</span>
        ))}
      </div>

      {/* Chapters Input */}
      <label className="quiz-label__Quiz__com__gen">Chapters</label>
      <div className="quiz-input-group__Quiz__com__gen">
        <input
          className="quiz-input__Quiz__com__gen"
          type="text"
          placeholder="e.g. Thermodynamics"
          value={inputChapter}
          onChange={(e) => setInputChapter(e.target.value)}
        />
        <button className="quiz-add-button__Quiz__com__gen" onClick={addChapter}>
          <FaPlus />
        </button>
      </div>
      <div className="quiz-tag-container__Quiz__com__gen">
        {chapters.map((chap, index) => (
          <span key={index} className="quiz-tag__Quiz__com__gen">{chap}</span>
        ))}
      </div>
      {isPremium ? (
        <button className="quiz-generate-button__Quiz__com__gen" onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>
) : (
<button className="quiz-generate-button__Quiz__com__gen"disabled={loading}>
       Generate Quiz Premium <FaLock/>
      </button>
)}
<FooterNav/>
    </div>
    </div>
  );
};

export default QuizGeneratorExam;

import { useState, useEffect } from 'react';
import { FaInfoCircle, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './QuizGeneratorExam.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const QuizGeneratorExam = () => {
  const [examType, setExamType] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state

  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    if (!examType) {
      alert('Please select an exam type.');
      return;
    }

    setLoading(true);
    navigate('/loading/mock-exam'); // Navigate to loading page

    try {
      const response = await fetch(API_ROUTES.generateCompetiveExam, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examType, token: localStorage.getItem('token') }),
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

  return (
    <div className="quiz-wrapper__Quiz__com__gen">
      <div className="quiz-container__Quiz__com__gen">
        <FaInfoCircle
          className="quiz-info-icon__Quiz__com__gen"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        
        {/* Tooltip Details */}
        {showTooltip && (
          <div className="quiz-tooltip__Quiz__com__gen">
            <p>📌 <strong>Mock Exam Format:</strong> Just like the real exam.</p>
            <p>🔢 <strong>Number of Questions:</strong> 50 (MCQs, Numerical Reasoning, etc.)</p>
            <p>⏳ <strong>Time Limit:</strong> 40 minutes</p>
            <p>⚠️ <strong>Marking Scheme:</strong> Negative marking as per real exam rules.</p>
            <p>✅ <strong>Instant Score, Leaderboard & Detailed Solutions</strong></p>
          </div>
        )}
        
        <h2 className="quiz-title__Quiz__com__gen">Competitive Exam Quiz</h2>
        
        {/* Exam Type Dropdown */}
        <label className="quiz-label__Quiz__com__gen">Select Exam Type</label>
        <select className="quiz-dropdown__Quiz__com__gen" value={examType} onChange={(e) => setExamType(e.target.value)}>
          <option value="">Select</option>
          {['NEET', 'JEE', 'UPSC', 'CAT', 'GATE', 'GMAT', 'GRE', 'SAT', 'CUET', 'CLAT', 'Banking', 'SSC'].map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>

        {isPremium ? (
          <button className="quiz-generate-button__Quiz__com__gen" onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        ) : (
          <button className="quiz-generate-button__Quiz__com__gen" disabled={loading}>
            Generate Quiz Premium <FaLock />
          </button>
        )}

        <FooterNav />
      </div>
    </div>
  );
};

export default QuizGeneratorExam;

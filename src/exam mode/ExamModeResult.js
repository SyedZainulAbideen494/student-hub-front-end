import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamModeResult.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaArrowLeft, FaBookOpen, FaClipboardList, FaFlask, FaLightbulb } from 'react-icons/fa';

const ExamModeResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await axios.get(`${API_ROUTES.getExamModePack}/${id}`);
        setExamData(res.data);
      } catch (err) {
        setError('Failed to fetch exam data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="examModeResult">
      <div className="topNav">
        <button className="backBtn" onClick={() => navigate(-2)}>‹</button>
        <h2>Exam Mode</h2>
      </div>

      <div className="examData">
        <div className="examResultItem">
          <p><strong>Smart Notes</strong></p>
          <Link to={`/note/view/${examData.smart_notes_id}`} className="viewLink">View Notes →</Link>
        </div>
        <div className="examResultItem">
          <p><strong>Key Formulas</strong></p>
          <Link to={`/note/view/${examData.notes_id}`} className="viewLink">View Notes →</Link>
        </div>
        <div className="examResultItem">
          <p><strong>Predicted Questions</strong></p>
          <Link to={`/note/view/${examData.predicted_questions_id}`} className="viewLink">View Notes →</Link>
        </div>
        <div className="examResultItem">
          <p><strong>Quiz</strong></p>
          <Link to={`/quiz/${examData.quiz_id}`} className="viewLink">Start Quiz →</Link>
        </div>
      </div>
    </div>
  );
};

export default ExamModeResult;

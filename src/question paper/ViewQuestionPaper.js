import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewQuestionPaper.css';
import { FaArrowLeft } from 'react-icons/fa';
import { API_ROUTES } from '../app_modules/apiRoutes';

const ViewQuestionPaper = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <p className="loading__question__paper__generated__ai__view">Loading...</p>;
  if (!paper) return <p className="error__question__paper__generated__ai__view">Question paper not found.</p>;

  const handleBack = () => navigate('/all-papers');

  return (
    <div className="paper__question__paper__generated__ai__view">
      <button className="back__btn__question__paper__generated__ai__view" onClick={handleBack}>
        <FaArrowLeft /> Back
      </button>
      <h1 className="title__question__paper__generated__ai__view">{paper.subject} (Grade {paper.grade})</h1>
      <p className="board__question__paper__generated__ai__view"><b>Board:</b> {paper.board}</p>
      <div className="questions__question__paper__generated__ai__view" dangerouslySetInnerHTML={{ __html: paper.questions }} />
    </div>
  );
};

export default ViewQuestionPaper;

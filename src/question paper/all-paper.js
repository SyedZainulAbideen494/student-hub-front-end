import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllQuestionPapers.css'; // Importing the new CSS file for styling
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const AllQuestionPapers = () => {
  const [papers, setPapers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(API_ROUTES.getuserQuestionPaper, {
          headers: { token }
        });

        setPapers(response.data.questionPapers);
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="all__question__paper__generated__Ai">
      <h1 className="title__all__question__paper__generated__Ai">Saved Question Papers</h1>
      {papers.length === 0 ? (
        <p className="no__papers__all__question__paper__generated__Ai">No question papers found.</p>
      ) : (
        papers.map((paper) => (
          <div 
            key={paper.id} 
            onClick={() => navigate(`/view-paper/${paper.id}`)} 
            className="paper__card__all__question__paper__generated__Ai"
          >
            <h2 className="subject__all__question__paper__generated__Ai">{paper.subject} (Grade {paper.grade})</h2>
            <p className="board__all__question__paper__generated__Ai"><b>Board:</b> {paper.board}</p>
          </div>
        ))
      )}
      <FooterNav/>
    </div>
  );
};

export default AllQuestionPapers;

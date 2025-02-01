import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewQuestionPaper.css'; // Importing the new CSS file for styling
import { FaArrowLeft } from 'react-icons/fa';
import { API_ROUTES } from '../app_modules/apiRoutes';

const ViewQuestionPaper = () => {
  const { id } = useParams(); // Fetches the ID from the URL params
  const [paper, setPaper] = useState(null); // State to hold the fetched paper
  const [loading, setLoading] = useState(true); // State to manage loading state
  const navigate = useNavigate(); // Hook for navigating between pages

  useEffect(() => {
    const fetchPaper = async () => {
      const token = localStorage.getItem('token'); // Retrieves token from localStorage

      try {
        // Fetches the question paper data based on user's token and ID
        const response = await axios.get(API_ROUTES.getuserQuestionPaper, {
          headers: { token }
        });

        // Finds the specific paper by ID from the fetched data
        const selectedPaper = response.data.questionPapers.find(p => p.id === parseInt(id));
        setPaper(selectedPaper); // Sets the fetched paper into state
        setLoading(false); // Marks loading as complete
      } catch (error) {
        console.error('Error fetching paper:', error);
        setLoading(false); // Marks loading as complete on error
      }
    };

    fetchPaper(); // Calls the fetchPaper function on component mount
  }, [id]); // Dependency array ensures useEffect runs when ID changes

  // Conditional rendering based on loading and paper state
  if (loading) return <p className="loading__question__paper__generated__ai__view">Loading...</p>;
  if (!paper) return <p className="error__question__paper__generated__ai__view">Question paper not found.</p>;

  // Handles navigating back to the previous page
  const handleBack = () => {
    navigate('/all-papers'); // Goes back to the previous page in history
  };

  // Renders the fetched paper details with a back button
  return (
    <div className="paper__question__paper__generated__ai__view">
      <button className="back__btn__question__paper__generated__ai__view" onClick={handleBack}><FaArrowLeft/></button>
      <h1 className="title__question__paper__generated__ai__view">{paper.subject} (Grade {paper.grade})</h1>
      <p className="board__question__paper__generated__ai__view"><b>Board:</b> {paper.board}</p>
      <div className="questions__question__paper__generated__ai__view" dangerouslySetInnerHTML={{ __html: paper.questions }} />
    </div>
  );
};

export default ViewQuestionPaper;

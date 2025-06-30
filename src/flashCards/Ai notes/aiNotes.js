import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GenerateNotesAI.css'; // Import the CSS file for styling
import PencilSVG from '../pdf notes creation/PencilSVG';
import { API_ROUTES } from '../../app_modules/apiRoutes';

const GenerateNotesAI = () => {
  const [topic, setTopic] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [isPremium, setIsPremium] = useState(null);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [isExceededLimit, setIsExceededLimit] = useState(false);
  const [classLevel, setClassLevel] = useState('');
const [examType, setExamType] = useState('');
const [extraDetails, setExtraDetails] = useState('');
  const navigate = useNavigate(); // Hook to navigate to a different page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.aiNotesGen, {
        topic,
        class: classLevel,
        exam: examType,
        extraDetails,
        token
      });
  
      setGeneratedNotes(response.data.notes.headings);
      setError('');
      setLoading(false);
      navigate(`/note/view/${response.data.notes.id}`);
    } catch (err) {
      setError('Error generating notes. Please try again later.');
      setGeneratedNotes('');
      setLoading(false);
    }
  };

  // Fetch subscription and flashcards count
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => {
          setIsPremium(response.data.premium);
          
          if (!response.data.premium) {
            // Fetch flashcards count for free users
            axios.get(API_ROUTES.flashcardsCountPdfPremium, {
              headers: { 'Authorization': token }
            })
            .then((res) => {
              setFlashcardsCount(res.data.flashcardsCount);
              if (res.data.flashcardsCount >= 1) {
                setIsExceededLimit(true);
              }
            })
            .catch((err) => {
              console.error("Error fetching flashcards count:", err);
            });
          }
        })
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);


  return (
<div className="generate-notes__ai__gen__notes-container__ai__gen__notes" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
<button className="PDFNotesCreation__backButton" onClick={() => navigate(-1)}>
        ← 
      </button>
      <h2 className="header__ai__gen__notes__ai__gen__notes">Generate Notes</h2>
      <form onSubmit={handleSubmit} className="form-container__ai__gen__notes__ai__gen__notes">
        <div className="input-container__ai__gen__notes__ai__gen__notes">
          <label className="input-label__ai__gen__notes__ai__gen__notes">Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="input-field__ai__gen__notes__ai__gen__notes"
          />
        </div>
        <div className="input-container__ai__gen__notes__ai__gen__notes">
    <label className="input-label__ai__gen__notes__ai__gen__notes">Class/Grade (optional):</label>
    <input
      type="text"
      value={classLevel}
      onChange={(e) => setClassLevel(e.target.value)}
      placeholder="e.g. Class 11, 12, BCA, etc."
      className="input-field__ai__gen__notes__ai__gen__notes"
    />
  </div>

  {/* Exam Type Input */}
  <div className="input-container__ai__gen__notes__ai__gen__notes">
    <label className="input-label__ai__gen__notes__ai__gen__notes">Exam Type (optional):</label>
    <input
      type="text"
      value={examType}
      onChange={(e) => setExamType(e.target.value)}
      placeholder="e.g. Boards, JEE, End Semester"
      className="input-field__ai__gen__notes__ai__gen__notes"
    />
  </div>

  {/* Extra Details Input */}
  <div className="input-container__ai__gen__notes__ai__gen__notes">
    <label className="input-label__ai__gen__notes__ai__gen__notes">Extra Notes Preference (optional):</label>
    <textarea
      value={extraDetails}
      onChange={(e) => setExtraDetails(e.target.value)}
      placeholder="e.g. Focus on formulas, key points only, or include real-life applications"
      className="input-field__ai__gen__notes__ai__gen__notes"
      rows={3}
    />
  </div>
        <button 
          type="submit" 
          disabled={loading || isExceededLimit && !isPremium} 
          className="submit-btn__ai__gen__notes__ai__gen__notes"
        >
          {loading ? "Processing..." : isExceededLimit && !isPremium ? "Upgrade to Premium" : "Generate Notes"}
        </button>

        {isExceededLimit && !isPremium && (
          <div className="PDFNotesCreation__lockMessage" style={{marginTop: '20px'}}>
            <span>🔒 Premium Only</span> - You have reached the limit for free users.
          </div>
        )}
      </form>
      {error && <p className="error-message__ai__gen__notes__ai__gen__notes">{error}</p>}
      {/* Loading Modal */}
      {loading && (
        <LoadingModal/>
      )}
    </div>
  );
};

const LoadingModal = () => (
  <div className="PDFNotesCreation__loadingModal">
    <div className="PDFNotesCreation__modalContent">
      <PencilSVG />
      <p>Just a moment...!</p>
    </div>
  </div>
);

export default GenerateNotesAI;

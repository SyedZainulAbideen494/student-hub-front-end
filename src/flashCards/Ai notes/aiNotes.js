import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GenerateNotesAI.css'; // Import the CSS file for styling
import PencilSVG from '../pdf notes creation/PencilSVG';
import { API_ROUTES } from '../../app_modules/apiRoutes';

const GenerateNotesAI = () => {
  const [topic, setTopic] = useState('');
  const [types, setTypes] = useState({
    summary: false,
    detailed: false,
    'question-and-answer': false,
    'key points': false,
    subtopics: false,
    'important questions': false,
  });
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [isPremium, setIsPremium] = useState(null);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [isExceededLimit, setIsExceededLimit] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to a different page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading modal

    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.post(API_ROUTES.aiNotesGen, {
        topic,
        types,
        token
      });

      setGeneratedNotes(response.data.notes.headings);
      setError('');
      setLoading(false); // Hide loading modal

      // Redirect to the newly created note's page using the id
      navigate(`/note/view/${response.data.notes.id}`); // Ensure that 'response.data.notes.id' is the correct id
    } catch (err) {
      setError('Error generating notes. Please try again later.');
      setGeneratedNotes('');
      setLoading(false); // Hide loading modal
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
              if (res.data.flashcardsCount >= 2) {
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


  const handleToggleChange = (type) => {
    setTypes((prevTypes) => ({
      ...prevTypes,
      [type]: !prevTypes[type], // Toggle the state correctly
    }));
  };

  return (
    <div className="generate-notes__ai__gen__notes-container__ai__gen__notes">
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

        <div className="note-types-container__ai__gen__notes__ai__gen__notes">
          <label className="note-types-label__ai__gen__notes__ai__gen__notes">Note Types:</label><br/><br/>
          <div className="toggle-container__ai__gen__notes__ai__gen__notes">
            {Object.keys(types).map((type) => (
              <div key={type} className="toggle-card__ai__gen__notes__ai__gen__notes">
                <span className="toggle-label__ai__gen__notes__ai__gen__notes">{type}</span>
                <label className="switch__ai__gen__notes">
                  <input
                    type="checkbox"
                    checked={types[type]}
                    onChange={() => handleToggleChange(type)}
                    className="toggle-input"
                  />
                  <span className="slider__ai__gen__notes__ai__gen__notes"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading || isExceededLimit && !isPremium} 
          className="PDFNotesCreation__button"
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

      {generatedNotes && (
        <div className="generated-notes__ai__gen__notes__ai__gen__notes">
          <h3 className="generated-notes-header__ai__gen__notes__ai__gen__notes">Generated Notes:</h3>
          <div dangerouslySetInnerHTML={{ __html: generatedNotes }} className="notes-content__ai__gen__notes__ai__gen__notes" />
        </div>
      )}

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

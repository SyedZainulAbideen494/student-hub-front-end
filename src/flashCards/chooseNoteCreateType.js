import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNotesPageType.css'; // Import the CSS file for styling
import { FaArrowAltCircleLeft, FaArrowLeft } from 'react-icons/fa';

const CreateNotesPage = () => {
  const navigate = useNavigate(); // Hook to navigate to a different page

  const handleOptionClick = (option) => {
    if (option === 'ai') {
      navigate('/notes/create/ai'); // Navigate to the AI generated notes page
    } else if (option === 'pdf') {
      navigate('/notes/create/pdf'); // Navigate to the PDF to notes page
    } else if (option === 'manual') {
      navigate('/notes/create'); // Navigate to the manual notes creation page
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="create__notes__type__page__container">
      <div className="create__notes__type__page__header-container">
        <button className="create__notes__type__page__back-btn" onClick={handleBackClick}>
          <FaArrowLeft className="create__notes__type__page__back-icon" />
        </button><br/>
        <h1 className="create__notes__type__page__header">Create Your Notes</h1>
      </div>

      <p className="create__notes__type__page__description">
        Choose how you'd like to create your notes:
      </p>

      <div className="create__notes__type__page__options">
        <button
          className="create__notes__type__page__option"
          onClick={() => handleOptionClick('ai')}
        >
          AI Generated Notes
        </button>
        <button
          className="create__notes__type__page__option"
          onClick={() => handleOptionClick('pdf')}
        >
          PDF to Notes
        </button>
        <button
          className="create__notes__type__page__option"
          onClick={() => handleOptionClick('manual')}
        >
          Manual Notes
        </button>
      </div>
    </div>
  );
};

export default CreateNotesPage;

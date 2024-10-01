import React, { useState } from 'react';
import { FaPlus, FaEye } from 'react-icons/fa';
import CreateFlashcard from './createFlashcard';
import ViewFlashcard from './viewFlashcard';
import './flashCards.css'; // Importing the CSS file

const FlashcardsPage = () => {
  const [mode, setMode] = useState('view');

  return (
    <div className="container__main__page__flashcard__page">


      {/* Button Group */}
      <div className="button-container__main__page__flashcard__page">
        {/* View Button */}
        <button
          className={`btn__main__page__flashcard__page ${mode === 'view' ? 'active__main__page__flashcard__page' : ''}`}
          onClick={() => setMode('view')}
        >
          <FaEye className="btn-icon__main__page__flashcard__page" /> My Flashcard
        </button>

        {/* Create Button */}
        <button
          className={`btn__main__page__flashcard__page ${mode === 'create' ? 'active__main__page__flashcard__page' : ''}`}
          onClick={() => setMode('create')}
        >
          <FaPlus className="btn-icon__main__page__flashcard__page" /> Create Flashcard
        </button>
      </div>

      {/* Active Component */}
      <div className="active-component__main__page__flashcard__page">
        {mode === 'view' ? <ViewFlashcard /> : <CreateFlashcard />}
      </div>
    </div>
  );
};

export default FlashcardsPage;

import React, { useEffect, useState } from 'react';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import CreateFlashcard from './createFlashcard';
import ViewFlashcard from './viewFlashcard';
import './flashCards.css'; // Importing the CSS file

const FlashcardsPage = () => {
  const location = useLocation();
  const [mode, setMode] = useState('view');

  useEffect(() => {
    // Determine the mode based on the current URL
    if (location.pathname === '/notes/create') {
      setMode('create');
    } else if (location.pathname === '/notes/view') {
      setMode('view');
    }
  }, [location.pathname]);

  return (
    <div className="container__main__page__flashcard__page">
      {/* Button Group */}
      <div className="button-container__main__page__flashcard__page">
        {/* View Button */}
        <button
          className={`btn__main__page__flashcard__page ${mode === 'view' ? 'active__main__page__flashcard__page' : ''}`}
          onClick={() => setMode('view')}
        >
          <FaEye className="btn-icon__main__page__flashcard__page" /> My Notes
        </button>

        {/* Create Button */}
        <button
          className={`btn__main__page__flashcard__page ${mode === 'create' ? 'active__main__page__flashcard__page' : ''}`}
          onClick={() => setMode('create')}
        >
          <FaPlus className="btn-icon__main__page__flashcard__page" /> Create Notes
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

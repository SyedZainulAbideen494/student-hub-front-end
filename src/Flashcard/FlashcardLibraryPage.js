import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FlashcardLibraryPage.css'; // Import CSS styles for better look
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FlashcardsPageTutorial from './FlashcardsPageTutorial';

const FlashcardLibraryPage = () => {
  const [sets, setSets] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility

  useEffect(() => {
      // Check local storage for tutorial completion status
      const completed = localStorage.getItem('flashcardsPageTutorialComplete');
      if (completed) {
          setShowTutorial(false); // Set showTutorial to false if found
      }
  }, []);

  const handleTutorialComplete = () => {
      setShowTutorial(false); // Hide tutorial when complete
      localStorage.setItem('flashcardsPageTutorialComplete', 'true'); // Store completion status in local storage
  };
  useEffect(() => {
    const fetchSets = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      const response = await fetch(API_ROUTES.getFlashcards, {
        method: 'POST', // Keep as POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send token in the body
      });

      if (response.ok) {
        const data = await response.json();
        setSets(data.sets); // Assuming the API returns an array of sets
      } else {
        console.error('Failed to fetch flashcard sets:', response.statusText);
      }
    };

    fetchSets();
  }, []);

  return (
<div className="flashcard__library__page__component__page" style={{ marginBottom: '50px' }}>
{showTutorial && <FlashcardsPageTutorial onComplete={handleTutorialComplete} />}
<div className="header__library__page__component__page">
  <h2 className="library-title__library__page__component__page">
    <div className="icon-container__library__page__component__page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        className="icon__library__page__component__page"
      >
        <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H5V4h14v16z" />
        <path d="M14 9h-4v2h4V9zm0 3h-4v2h4v-2z" />
      </svg>
    </div>
    <span>Library</span>
  </h2>
  <Link to="/create/flashcard" style={{ textDecoration: 'none' }}>
    <button className="create-set-button__library__page__component__page">
      Create +
    </button>
  </Link>
</div>


  {sets.length === 0 ? (
    <div className="no-sets-message__library__page__component__page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        fill="#A78BFA"
        viewBox="0 0 24 24"
      >
        <path d="M10 16l-4-4h8l-4 4zm0 0l4-4H6l4 4zm-6-10h12V5H4v1zm0-1C3.447 5 3 5.447 3 6v13c0 .553.447 1 1 1h14c.553 0 1-.447 1-1V6c0-.553-.447-1-1-1H4zm1 14h10v1H5v-1z" />
      </svg>
      <h3 className="no-sets-title__library__page__component__page">No Flashcard Sets Available</h3>
      <p className="no-sets-description__library__page__component__page">
        Create your first flashcard set by clicking the button above!
      </p>
    </div>
  ) : (
    <div className="set-list__library__page__component__page">
      {sets.map((set) => (
      <div key={set.id} className="set-card__library__page__component__page fade-in">
      <Link to={`/flashcard/set/${set.id}`} style={{ textDecoration: 'none' }}>
        <div className="card-content__library__page__component__page">
          <div className="icon-container">
            <i className="fas fa-book card-icon" aria-hidden="true"></i>
            <h3 className="set-name__library__page__component__page">{set.name}</h3> {/* Centered */}
          </div>
          <div className="icon-container">
            <i className="fas fa-tags topic-icon" aria-hidden="true"></i>
            <span className="set-topic__library__page__component__page">
              Topic: <strong>{set.topic}</strong>
            </span>
          </div>
          <div className="icon-container">
            <i className="fas fa-chalkboard-teacher subject-icon" aria-hidden="true"></i>
            <span className="set-subject__library__page__component__page">
              Subject: <strong>{set.subject}</strong>
            </span>
          </div>
          <Link to={`/flashcard/set/${set.id}`} className="share__btn__flashcard__card__page">
            <i className="fas fa-eye view-icon" aria-hidden="true"></i> View
          </Link>
        </div>
      </Link>
    </div>
    

    
      ))}
    </div>
  )}
  <FooterNav />
</div>

  );
};

export default FlashcardLibraryPage;

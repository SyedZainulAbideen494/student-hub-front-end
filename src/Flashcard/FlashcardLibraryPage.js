import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FlashcardLibraryPage.css'; // Import CSS styles for better look
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FlashcardsPageTutorial from './FlashcardsPageTutorial';

const FlashcardLibraryPage = () => {
  const [sets, setSets] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility
  const [stats, setStats] = useState({
    totalFlashcards: 0,
    totalSets: 0,
    flashcardsYouKnow: 0,
    flashcardsYouDontKnow: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for tutorial completion status
    const completed = localStorage.getItem('flashcardsPageTutorialComplete');
    if (completed) {
      setShowTutorial(false); // Set showTutorial to false if found
    }

    const fetchSets = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      const response = await fetch(API_ROUTES.getFlashcards, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data: ", data); // Log the response

        setSets(data.sets);

        setStats({
          totalFlashcards: data.totalFlashcards || 0,
          totalSets: data.totalSets || 0,
          flashcardsYouKnow: data.flashcardsYouKnow || 0,
          flashcardsYouDontKnow: data.flashcardsYouDontKnow || 0,
        });

        setLoading(false); // Update loading state
      } else {
        console.error('Failed to fetch flashcard sets:', response.statusText);
        setLoading(false); // Ensure loading state is cleared on error
      }
    };

    fetchSets();
  }, []); // Empty dependency array to run once when the component mounts

  const handleTutorialComplete = () => {
    setShowTutorial(false); // Hide tutorial when complete
    localStorage.setItem('flashcardsPageTutorialComplete', 'true'); // Store completion status in local storage
  };

  return (
    <div className="flashcard__library__page__component__page" style={{marginBottom: '60px'}}>
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
        <button className="create-set-button__library__page__component__page" style={{
    display: 'inline-flex',
  }}>
    Create +
</button>

        </Link>
      </div>

      <div className="top-boxes-container__home__page__component" style={{ marginBottom: '80px', marginLeft: '10px', marginRight: '10px' }}>
        <div className="box__home__page__component box-1__home__page__component">
          <i className="fas fa-file-alt"></i>
          <span className="count__home__page__component">{stats.totalFlashcards}</span>
          <span className="text__planner__data text--1__planner__data">Total Flashcards</span>
        </div>
        <div className="box__home__page__component box-2__home__page__component">
          <i className="fas fa-box-open"></i>
          <span className="count__home__page__component">{stats.totalSets}</span>
          <span className="text__planner__data text--2__planner__data">Total Sets</span>
        </div>
        <div className="box__home__page__component box-3__home__page__component">
          <i className="fas fa-check-circle"></i>
          <span className="count__home__page__component">{stats.flashcardsYouKnow}</span>
          <span className="text__planner__data text--4__planner__data">Flashcards You Know</span>
        </div>
        <div className="box__home__page__component box-4__home__page__component">
          <i className="fas fa-times-circle"></i>
          <span className="count__home__page__component">{stats.flashcardsYouDontKnow}</span>
          <span className="text__planner__data text--4__planner__data">Flashcards You Don’t Know</span>
        </div>
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
                    <h3 className="set-name__library__page__component__page">{set.name}</h3>
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

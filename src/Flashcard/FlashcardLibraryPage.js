import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FlashcardLibraryPage.css'; // Import CSS styles for better look
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const FlashcardLibraryPage = () => {
  const [sets, setSets] = useState([]);

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
    <div className="flashcard__library__page__component__page" style={{marginBottom: '50px'}}>
      <div className="header__library__page__component__page">
        <h2 className="library-title__library__page__component__page">
          <div className="icon-container__library__page__component__page">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="#A78BFA"
            >
              <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H5V4h14v16z" />
              <path d="M14 9h-4v2h4V9zm0 3h-4v2h4v-2z" />
            </svg>
          </div>
          Library
        </h2>
        <Link to="/create/flashcard" style={{ textDecoration: 'none' }}>
          <button className="create-set-button__library__page__component__page">
            <svg
              aria-hidden="true"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
              className="create-set-button__library__page__component__page__svg"
            >
              <path
                d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <path
                d="M17 15V18M17 21V18M17 18H14M17 18H20"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
            Create
          </button>
        </Link>
      </div>
      <div className="set-list__library__page__component__page">
        {sets.map((set) => (
          <div key={set.id} className="set-card__library__page__component__page">
            <Link to={`/flashcard/set/${set.id}`} className="set-item__library__page__component__page">
              <div className="card-content__library__page__component__page">
                <h3 className="set-name__library__page__component__page">{set.name}</h3>
                <p className="set-topic__library__page__component__page">
                  Topic: <strong>{set.topic}</strong>
                </p>
                <p className="set-subject__library__page__component__page">
                  Subject: <strong>{set.subject}</strong>
                </p>
                <Link to={`/flashcard/set/${set.id}`} className="share__btn__flashcard__card__page">
                  View
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <FooterNav />
    </div>
  );
};

export default FlashcardLibraryPage;

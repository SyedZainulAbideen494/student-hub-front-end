import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFlashcardSet.css'; // Importing the CSS styles
import { API_ROUTES } from '../app_modules/apiRoutes';

const CreateFlashcardSet = () => {
  const [setName, setSetName] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const nav = useNavigate();

  const createSet = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const response = await fetch(API_ROUTES.createFlashcardSet, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the headers
      },
      body: JSON.stringify({ name: setName, subject, topic }),
    });
  
    if (response.ok) {
      const data = await response.json();
      nav(`/flashcard/set/${data.id}`); // Navigate to the newly created set
    } else {
      console.error('Failed to create flashcard set:', response.statusText);
    }
  };
  

  // Check if all fields are filled
  const isButtonDisabled = !setName || !subject || !topic;

  return (
    <div className="create__flashcard__page">
      <header className="header__create__flashcard___page">
        <button className="back-button__create__flashcard___page" onClick={() => nav(-1)}>
        <svg
  aria-hidden="true"
  viewBox="0 0 24 24"
  className="back-button-icon__create__flashcard___page"
  fill="#000000" // Changed fill to black
  width="24" // Define width
  height="24" // Define height
>
  <path d="M15 18l-6-6 6-6" />
</svg>

        </button>
        <h1 className="header-title__create__flashcard___page">Create Flashcard Set</h1>
      </header>
      <p className="header-subtitle__create__flashcard___page">Fill in the details below to get started!</p>

      <div className="form-container__create__flashcard___page">
        <div className="input-group__create__flashcard___page">
          <input
            type="text"
            placeholder="Set Name"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="input__create__flashcard___page"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input__create__flashcard___page"
          />
          <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input__create__flashcard___page"
          />
        </div>

        <button
          onClick={createSet}
          className="create-button__create__flashcard___page"
          disabled={isButtonDisabled} // Disable button if inputs are empty
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateFlashcardSet;

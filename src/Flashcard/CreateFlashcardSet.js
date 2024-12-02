import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFlashcardSet.css'; // Importing the CSS styles
import { API_ROUTES } from '../app_modules/apiRoutes';

const CreateFlashcardSet = () => {
  const [setName, setSetName] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for selected PDF file
  const [isGenerating, setIsGenerating] = useState(false); // State for handling loading while generating
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

  const generateFlashcards = async () => {
    // Check if any of the fields (setName, subject, topic) are empty
    if (!setName || !subject || !topic) {
      alert('Please fill in the Set Name, Subject, and Topic before generating flashcards.');
      return;
    }
  
    if (!selectedFile) {
      alert('Please select a PDF file.');
      return;
    }
  
    const token = localStorage.getItem('token'); // Get the token from local storage
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('name', setName);
    formData.append('subject', subject);
    formData.append('topic', topic);
  
    setIsGenerating(true); // Show loading indicator
  
    try {
      const response = await fetch(API_ROUTES.generateFlashcardsFromPdf, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        nav(`/flashcard/set/${data.flashcardSetId}`); // Navigate to the newly created set
      } else {
        console.error('Failed to generate flashcards:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGenerating(false); // Hide loading indicator
    }
  };
  

  // Check if all fields are filled
  const isManualButtonDisabled = !setName || !subject || !topic;
  const isGenerateButtonDisabled = isManualButtonDisabled || !selectedFile;

  return (
    <div className="create__flashcard__Set__Page">
      <header className="header__create__flashcard__Set__Page">
        <button className="back-button__create__flashcard__Set__Page" onClick={() => nav(-1)}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="back-button-icon__create__flashcard__Set__Page"
            fill="#000000"
            width="24"
            height="24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="header-title__create__flashcard__Set__Page">Create Flashcard Set</h1>
      </header>
      <p className="header-subtitle__create__flashcard__Set__Page">Fill in the details below to get started!</p>

      <div className="form-container__create__flashcard__Set__Page">
        <div className="input-group__create__flashcard__Set__Page">
          <input
            type="text"
            placeholder="Set Name"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="input__create__flashcard__Set__Page"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input__create__flashcard__Set__Page"
          />
          <input
            type="text"
            placeholder="Topic (Name)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input__create__flashcard__Set__Page"
          />
        </div>

        <button
          onClick={createSet}
          className="create-button__create__flashcard__Set__Page"
          disabled={isManualButtonDisabled}
        >
          Create Manually
        </button>

        <div className="pdf-upload-container__create__flashcard__Set__Page">
          <p>Or generate flashcards using a PDF file:</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="file-input__create__flashcard__Set__Page"
          />
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  onClick={generateFlashcards}
  disabled={isGenerating}
>
  <div className={`sparkle__set__page__buttons ${isGenerating ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGenerating ? 'Generating...' : 'Generate using PDF'}
    </span>
  </div>
</button>
</div>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardSet;

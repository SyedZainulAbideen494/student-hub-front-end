import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFlashcardSet.css'; // Importing the CSS styles
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';

const CreateFlashcardSet = () => {
  const [setName, setSetName] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for selected PDF file
  const [isGenerating, setIsGenerating] = useState(false); // State for handling loading while generating
    const [isPremium, setIsPremium] = useState(null);
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

    // Check if the selected file is a PDF
    if (selectedFile.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

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
    fill="#ffffff" // Correct white color
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
          <div style={{ margin: "15px 0", textAlign: "center" }}>
          {isPremium ? (
          <div>
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-block",
              backgroundColor: "#1c1c1e",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "30px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#333";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#1c1c1e";
              e.target.style.transform = "scale(1)";
            }}
          >
            Select File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
        </div>
        
  ) : (
    <p
    style={{
      color: '#222', // Deep grey for a premium look
      fontSize: '16px',
      fontWeight: '500',
      marginTop: '12px',
      padding: '12px 18px',
      backgroundColor: '#f9f9f9', // Light grey Apple-like theme
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // Soft shadow for depth
      border: '1px solid #e0e0e0', // Subtle premium border
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      maxWidth: '300px', // Keeps it compact and elegant
      margin: 'auto', // Centers it
      fontFamily: "'SF Pro Display', sans-serif", // Apple-style font
    }}
  >
    <span style={{ fontSize: '18px' }}>👑</span>
    <span>Upgrade to Premium for PDF Flashcards</span>
  </p>
  
  )}


  {selectedFile && (
    <div
      style={{
        marginTop: "10px",
        fontSize: "0.9rem",
        color: "white",
        fontWeight: "500",
      }}
    >
      Selected File: {selectedFile.name}
    </div>
  )}
</div>

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

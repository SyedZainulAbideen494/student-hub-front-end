import React, { useState, useEffect } from 'react';
import './IOSInstructions.css';
import ShareIosIcon from './download-removebg-preview.png'

const IOSInstructions = () => {
  const [isInInstagramBrowser, setIsInInstagramBrowser] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.includes('Instagram')) {
      setIsInInstagramBrowser(true);
      setShowModal(true);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  };

  const modalContentStyle = {
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#ffffff',
  };

  const linkStyle = {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ffffff', // Changed to white
    color: '#007BFF', // Set text color to a blue shade for contrast
    borderRadius: '20px', // Increased border radius for a curvier look
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.2s',
    border: '2px solid #007BFF', // Optional: add a border to define the button
};


  return (
    <div className="instructions-container__ios__instructions dark-theme__ios__instructions">
      {showModal && (
        <div style={modalStyle}>
        <div style={modalContentStyle}>
            <h2>Note</h2>
            <p>
                 Instagram browser doesn't support downloads. 
            </p>
            <p style={{ marginTop: '10px' }}>
  ⋮ Tap the <strong>three dots</strong> in the top right corner and select 
  <strong>"Open in Browser"</strong> or <strong>"Open in Safari"</strong> 
</p>


            <p>Or</p>
            <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText('https://edusify.vercel.app/ios/instructions/download')
                        .then(() => {
                            alert('Link copied! You can now paste it in your browser.');
                        })
                        .catch(err => console.error('Failed to copy link: ', err));
                }}
                style={linkStyle}
            >
                Copy Link
            </a>
        </div>
    </div>
      )}
      
      {!isInInstagramBrowser && (
         <>
         <h1 className="title__ios__instructions">Quick Install Instructions</h1>
         <p className="intro__ios__instructions">
           Add Edusify to your home screen for instant access:
         </p>
         
         <div className="steps__ios__instructions">
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 1</h2>
          <p className="step-description__ios__instructions">
            Open Safari and visit our (If you are on any other browser other than safari)<a href="https://edusify.vercel.app/ios/instructions/download" target="_blank" rel="noopener noreferrer">web app</a>.
          </p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 2</h2>
          <p className="step-description__ios__instructions">
          Tap <strong>Share</strong> at the bottom <img src={ShareIosIcon} alt="Share Icon" style={{ width: '28px', height: '28px', verticalAlign: 'middle' }} />.
          </p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 3</h2>
          <p className="step-description__ios__instructions">
            Select <strong>"Add to Home Screen"</strong> from the menu.
          </p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 4</h2>
          <p className="step-description__ios__instructions">
            Name it "Edusify" and tap <strong>Add</strong> – you're all set!
          </p>
        </div>
         </div>
       </>
      )}
    </div>
  );
};

export default IOSInstructions;

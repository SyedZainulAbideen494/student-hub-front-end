import React from 'react';
import './IOSInstructions.css'; // Ensure to create this CSS file for dark theme styling

const IOSInstructions = () => {
  return (
    <div className="instructions-container__ios__instructions dark-theme__ios__instructions">
      <h1 className="title__ios__instructions">We’re Extremely Sorry!</h1>
      <p className="intro__ios__instructions">While we’re working hard to perfect the iOS app, you can still add Edusify to your home screen as a shortcut for quick access. Follow the steps below:</p>
      
      <div className="steps__ios__instructions">
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 1</h2>
          <p className="step-description__ios__instructions">Open Safari and navigate to our <a href='https://edusify.vercel.app/ios/instructions/download' target="_blank" rel="noopener noreferrer">web app</a>.</p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 2</h2>
          <p className="step-description__ios__instructions">Tap the "Share" button (the square icon with an upward arrow) at the bottom of the screen.</p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 3</h2>
          <p className="step-description__ios__instructions">In the menu that appears, scroll down and tap "Add to Home Screen."</p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">Step 4</h2>
          <p className="step-description__ios__instructions">Give the shortcut a name, like "Edusify," and then tap "Add."</p>
        </div>
        <div className="step__ios__instructions">
          <h2 className="step-title__ios__instructions">You're Done!</h2>
          <p className="step-description__ios__instructions">Edusify is now on your home screen. Tap it anytime to quickly access the app!</p>
        </div>
      </div>
    </div>
  );
};

export default IOSInstructions;

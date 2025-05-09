import React from 'react';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome__wrapper">
    <div className="welcome__card">
      <h2 className="welcome__tagline">Reimagine Learning</h2>
      <h1 className="welcome__heading">Welcome to Edusify</h1>
      <p className="welcome__desc">
        Precision. Clarity. Simplicity.<br/>
        Edusify isn’t just another study app — it’s a statement. A space where your learning feels effortless, elegant, and ahead of its time.
      </p>
      <a href="https://edusify-download.vercel.app/">
        <button className="welcome__btn">Get Started</button>
      </a>
    </div>
  </div>
  );
};

export default Welcome;

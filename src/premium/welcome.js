import React, { useState, useEffect } from 'react';
import './Welcome.css';

const Welcome = ({ handleNext }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {

      handleNext(); // triggers parent callback after loading

  };

  if (loading) {
    return (
  <div className="wrapper____loading__premium___Page">
  <div className="glow__orb____loading__premium___Page" />
  <h1 className="loading__text____loading__premium___Page">
    Launching your learning space<span className="dot__anim____loading__premium___Page" />
  </h1>
</div>

    );
  }

  return (
    <div className="wrapper__Welcome__Premium__page">
      <div className="card__Welcome__Premium__page">
        <h1 className="heading__Welcome__Premium__page">Edusify</h1>

        <p className="tagline__Welcome__Premium__page">
          The future of learning. One app. Zero distractions.
        </p>

        <div className="statements__Welcome__Premium__page">
          <span>Built for focus.</span>
          <span>Powered by AI.</span>
          <span>Designed like no other.</span>
        </div>

        <p className="cta__Welcome__Premium__page">
          Study plans. Notes. Quizzes. Flashcards. Deadlines. Friends. All in one seamless space.
        </p>

        <p className="footnote__Welcome__Premium__page">
          You don’t switch tabs in the future.
        </p>

        <button className="btn__Welcome__Premium__page" onClick={handleClick}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./ValentineModal.css";
import { Link } from "react-router-dom";

const ValentineModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSingleMode, setIsSingleMode] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("valentineModalLastShown");
    const now = new Date().getTime();

    // Show modal only if it's been at least 1 hour (3600000ms) since last shown
    if (!lastShown || now - lastShown > 1500000) {
      setIsOpen(true);
  }
  
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem("valentineModalLastShown", new Date().getTime()); // Store the current time
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={`modal__gift__val__modal ${isSingleMode ? "single__mode" : ""}`}
      overlayClassName="overlay__gift__val__modal"
      ariaHideApp={false}
    >
      <button className="close__gift__val__modal" onClick={closeModal}>×</button>

      {isSingleMode ? (
        <>
  <h2 className="header__gift__val__modal">  
    Oh no... You're Single? 💔  
  </h2>

  <p className="message__gift__val__modal">
    Let’s be real—<strong>flowers die, relationships fade, but money lasts forever.</strong> 💸<br/>
    Instead of crying over chocolates you didn’t get, <strong>invest in yourself.</strong> 🚀<br/>
    <strong>Boss up, level up, glow up.</strong> By next Valentine’s, let them regret ignoring you.  
  </p>

  <p className="fomo__gift__val__modal">
    <strong>Step 1:</strong> Study smart. <strong>Step 2:</strong> Get rich. <strong>Step 3:</strong> Let them chase you.  
  </p>

  <Link to='/subscription'>
    <button className="cta__gift__val__modal">📈 Upgrade & Flex Next Year</button>
  </Link>
</>

      ) : (
        <>
          <h2 className="header__gift__val__modal">  
            The Gift That Never Fades. 🎁  
          </h2>

          <p className="message__gift__val__modal">
          💌 Chocolates disappear, flowers wilt, but success lasts forever.<br/> 
          This Valentine’s, give them something that truly matters.  <br/>
          Help them study smarter, stress less, and achieve their dreams.  
          </p>

          <p className="fomo__gift__val__modal">  
          Over 1,286 people have gifted Edusify Premium today.<br/>
          When will you? 💕
          </p>

          <div className="btn-group">
            <Link to='/gift-card'>
              <button className="cta__gift__val__modal">💝 Gift Edusify</button>
            </Link>
            <button className="single__btn" onClick={() => setIsSingleMode(true)}>💔 I'm Single</button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ValentineModal;

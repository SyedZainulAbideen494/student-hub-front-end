import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./ValentineModal.css";
import { Link } from "react-router-dom";

const ValentineModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("valentineModalLastShown");
    const now = new Date().getTime();

    // Show modal only if it's been at least 1 hour (3600000ms) since last shown
    if (!lastShown || now - lastShown > 3600000) {
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
      className="modal__gift__val__modal"
      overlayClassName="overlay__gift__val__modal"
      ariaHideApp={false}
    >
      <button className="close__gift__val__modal" onClick={closeModal}>×</button>

      <h2 className="header__gift__val__modal">  
        The Gift That Never Fades. 🎁  
      </h2>

      <p className="message__gift__val__modal">
      💌 Chocolates disappear, flowers wilt, but success lasts forever.<br/> 
      This Valentine’s, give them something that truly matters.  <br/>
      Help them study smarter, stress less, and achieve their dreams.  <br/>
      Because nothing says ‘I care’ more than investing in their future.  
      </p>

      <p className="fomo__gift__val__modal">  
      Over 1,286 people have gifted Edusify Premium today.<br/>
      When will you? 💕
      </p>

      <Link to='/gift-card'>
        <button className="cta__gift__val__modal">💝 Gift Edusify Now</button>
      </Link>
    </Modal>
  );
};

export default ValentineModal;

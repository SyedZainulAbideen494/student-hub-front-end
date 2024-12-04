import React, { useState, useEffect } from "react";
import img from './Images/How to get the best out of eduisfy.png';
import edusifyLogo from '../images/Edusify-removebg-preview.png'; // Path to your logo image
import "./ModalHowTo.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const ModalHowTo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();

  // Open the modal on button click
  const openModal = () => setIsOpen(true);
  
  // Close the modal
  const closeModal = () => setIsOpen(false);

  // Navigate to a different page when the "Learn More" button is clicked
  const handleLearnMore = () => {
    nav('/how-to-use-edusify');
  };

  // Check if the modal should be shown
  useEffect(() => {
    const viewedGuide = localStorage.getItem("viewedGuide");
    const hasVisitedTodayEventsAndTasks = localStorage.getItem("hasVisitedTodayEventsAndTasks");

    if (!viewedGuide && hasVisitedTodayEventsAndTasks === "true") {
      // Open the modal if the guide hasn't been viewed and the user visited today's events and tasks
      setIsOpen(true);
      // Set the viewedGuide flag to true in localStorage so it won't show the modal next time
      localStorage.setItem("viewedGuide", "true");
    }
  }, []);

  return (
    <div>
      {/* Modal */}
      {isOpen && (
        <div className="__pop__up__how__to__1__modal">
          {/* Edusify logo */}
          <img 
            src={edusifyLogo} 
            alt="Edusify Logo" 
            className="__pop__up__how__to__1__modal__logo" 
          />
          
          <div className="__pop__up__how__to__1__modal__content">
            <span className="__pop__up__how__to__1__close__btn" onClick={closeModal}>
              &times;
            </span>
            <div className="__pop__up__how__to__1__modal__image">
              <img
                src={img}
                alt="Edusify"
                className="__pop__up__how__to__1__modal__img"
              />
              <button
                className="__pop__up__how__to__1__learn__more__btn"
                onClick={handleLearnMore}
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Dismiss button */}
          <button 
            className="__pop__up__how__to__1__modal__dismiss__btn" 
            onClick={closeModal}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default ModalHowTo;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faTelegram, faChrome, faGoogle } from '@fortawesome/free-brands-svg-icons';
import './helpMain.css';
import InviteFriends from './InviteFriends';
import FeedbackForm from './FeedbackForm';

const HelpMain = () => {
  const navigate = useNavigate(); // Hook to navigate

  return (
    <div className="help-main-container-help-page">
      {/* Back Button */}
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>

   
      <h1 className="welcome-message-help-page">Welcome to Edusify: Your Ultimate Study Companion!</h1>

      <p className="app-description-help-page">
        Edusify is an all-in-one study app designed to enhance your learning experience with a suite of powerful tools. Stay organized, collaborate, and make studying more enjoyable!
      </p>

<div style={{marginTop: '10px'}}>
    <FeedbackForm/>
    </div>

      <footer className="footer-help-page">
  <p>© 2024 Edusify. All rights reserved.</p>

  {/* Social Media Links */}
  <div className="footer-social-links-help-page">
    <a href="https://www.instagram.com/edusify.app/" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
      <FontAwesomeIcon icon={faInstagram} size="2x" />
    </a>
    <a href="https://x.com/SyedZain_saz?t=mUNjUKoihNUivIYikdtu3g&s=08" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
      <FontAwesomeIcon icon={faTwitter} size="2x" />
    </a>
    <a href="https://t.me/edusify" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
      <FontAwesomeIcon icon={faTelegram} size="2x" />
    </a>
    <a href="https://edusify-download.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
      <FontAwesomeIcon icon={faChrome} size="2x" />
    </a>
    <a href="https://g.page/r/CbK_EhVVrsJqEAI/review" target="_blank" rel="noopener noreferrer" className="footer-social-icon-help-page">
      <FontAwesomeIcon icon={faGoogle} size="2x" />
    </a>
  </div>

  <Link to="/terms-and-conditions" className="footer-link-help-page"><p style={{marginTop:'10px'}}>Terms and Conditions</p></Link>
</footer>

    </div>
  );
};

export default HelpMain;

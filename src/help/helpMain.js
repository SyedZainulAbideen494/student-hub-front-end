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

      {/* Getting Started Section */}
      <section className="getting-started-section-help-page">
        <h2>Getting Started with Edusify</h2>
        <p>Download Edusify from the official app store or visit our website to get started. Here’s a step-by-step guide:</p>
        <ol>
          <li>Download and install the Edusify app.</li>
          <li>Create an account using your email or social media login.</li>
          <li>Start by setting up your profile and study preferences.</li>
          <li>Begin using the Planner, Flashcards, Notes, and other features to enhance your learning experience!</li>
        </ol>
      </section>

      {/* Key Features Section */}
      <section className="key-features-section-help-page">
        <h2>How to Use Key Features</h2>
        <div className="feature-card">
          <h3>Planner</h3>
          <p>Stay organized by adding tasks manually or using AI to generate tasks based on time availability.</p>
        </div>
        <div className="feature-card">
          <h3>Flashcards</h3>
          <p>Generate flashcards based on topics and subjects, and test your knowledge using active recall.</p>
        </div>
        <div className="feature-card">
          <h3>Notes</h3>
          <p>Create and organize notes by subject, and let AI help generate them based on your study material.</p>
        </div>
        <div className="feature-card">
          <h3>AI Assistant</h3>
          <p>Ask questions, generate study schedules, and get help with a variety of academic tasks!</p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faq-section-help-page">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How do I reset my password?</h3>
          <p>Go to the login page and click on "Forgot Password?" to reset it via email.</p>
        </div>
        <div className="faq-item">
          <h3>Can I sync my data across multiple devices?</h3>
          <p>Yes, your data is automatically synced across all devices when you log in with the same account.</p>
        </div>
        <div className="faq-item">
          <h3>How do I share my study notes with others?</h3>
          <p>Navigate to the Notes section, select the note, and click "Share" to send it to your friends.</p>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="troubleshooting-section-help-page">
        <h2>Troubleshooting</h2>
        <p>If you’re experiencing issues, check out the solutions below:</p>
        <ul>
          <li>App crashes? Try restarting the app or reinstalling it.</li>
          <li>Login issues? Ensure your credentials are correct, or reset your password if necessary.</li>
          <li>Data not syncing? Check your internet connection and try logging out and back in.</li>
        </ul>
      </section>

      {/* Feedback Form */}
      <div style={{ marginTop: '10px' }}>
        <FeedbackForm />
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

        <Link to="/terms-and-conditions" className="footer-link-help-page">
          <p style={{ marginTop: '10px' }}>Terms and Conditions</p>
        </Link>
      </footer>
    </div>
  );
};

export default HelpMain;

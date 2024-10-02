import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
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

      {/* Welcome Message */}
      <h1 className="welcome-message-help-page">Welcome to Edusify: Your Ultimate Study Companion!</h1>

      {/* App Description */}
      <p className="app-description-help-page">
        Edusify is an all-in-one study app designed to enhance your learning experience with a suite of powerful tools. Stay organized, collaborate, and make studying more enjoyable!
      </p>

      <InviteFriends/>

      {/* Features Details */}
      <div className="features-container-help-page">
        <div className="feature-card-help-page">
          <h3>Task Management</h3>
          <p>Stay on top of your assignments and tasks with Edusify's Task Management feature. Easily create, categorize, and prioritize your to-dos, set deadlines, and track your progress to keep up with your studies effortlessly.</p>
          <Link to="/task-management-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Collaborative Study Groups</h3>
          <p>Join or create study groups, share notes, and collaborate on projects with peers. Our Collaborative Study Groups feature promotes group learning, offering a shared space to discuss topics, schedule study sessions, and exchange ideas.</p>
          <Link to="/collaborative-study-groups-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Aesthetic Notes & Flashcards</h3>
          <p>Enhance your note-taking with beautiful, customizable templates and flashcards. Organize your notes in a visually appealing way that makes studying more engaging and helps you retain information more effectively.</p>
          <Link to="/aesthetic-notes-flashcards-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Pomodoro Timer</h3>
          <p>Boost your productivity with the Pomodoro Timer, a time management tool that helps you break your study sessions into focused intervals, separated by short breaks to maximize efficiency and reduce burnout.</p>
          <Link to="/pomodoro-timer-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Music Player</h3>
          <p>Listen to calming or motivational music while you study with our integrated Music Player. Choose from curated playlists that match your mood and keep you focused throughout your sessions.</p>
          <Link to="/music-player-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Calendar & Reminders</h3>
          <p>Plan your study schedule and never miss a deadline with the Calendar & Reminders feature. Set reminders for important dates, exams, and assignments to stay organized and manage your time effectively.</p>
          <Link to="/calendar-reminders-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Social Feed</h3>
          <p>Stay connected with your peers through the Social Feed. Share study tips, updates, and notes in a Twitter-like format designed specifically for students to foster a collaborative learning environment.</p>
          <Link to="/social-feed-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
        <div className="feature-card-help-page">
          <h3>Subject Helpers</h3>
          <p>Get AI-powered assistance for your studies with our Subject Helpers. Whether you need help with Science, Math, or Commerce, our AI provides answers and explanations to your questions, making study sessions more productive.</p>
          <Link to="/subject-helpers-guide/guide" className="feature-link-help-page">Learn More</Link>
        </div>
      </div>

      {/* About App Card */}
      <div className="about-app-card-help-page">
        <h3>About Edusify</h3>
        <p>Discover more about Edusify, its vision, and how it can help you in your educational journey. Learn about our mission to enhance your learning experience.</p>
        <Link to="/about-app" className="about-app-link-help-page">Learn More</Link>
      </div>
    <FeedbackForm/>
      {/* Footer */}
      <footer className="footer-help-page">
        <p>© 2024 Edusify. All rights reserved.</p>
        <Link to="/terms-and-conditions" className="footer-link-help-page">Terms and Conditions</Link>
      </footer>
    </div>
  );
};

export default HelpMain;

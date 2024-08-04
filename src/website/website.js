import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { Typewriter } from 'react-simple-typewriter';
import './website.css'; // Import the CSS file
import logo from '../images/Edusify-logo-dark.png';
import { FaDownload, FaSignInAlt, FaInfoCircle, FaBars, FaTimes, FaCalendarAlt, FaClock, FaMusic, FaShareAlt, FaComments, FaPen, FaTasks, FaQuestion, FaUsers, FaChartBar, FaLock, FaFilePdf } from 'react-icons/fa'; // Font Awesome icons
import { IoMdFlash } from 'react-icons/io'; // For Flashcards icon

// Handle file download
const handleDownload = async () => {
  const response = await fetch(API_ROUTES.downloadAndroid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!response.ok) {
    console.error('Failed to download file');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Edusify.apk'; // Replace with your file name
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// Check token and redirect
const checkTokenAndRedirect = async (token, navigate) => {
  try {
    const response = await axios.post(API_ROUTES.sessionCheck, { token });

    if (response.data.exists) {
      navigate('/planner');
    } else {
      console.error('No matching token found.');
    }
  } catch (error) {
    console.error('Error checking token:', error);
  }
};

// Features Card Component
const FeatureCard = ({ icon, heading, description }) => (
  <div className='feature-card'>
    <div className='feature-icon'>{icon}</div>
    <h3 className='feature-heading'>{heading}</h3>
    <p className='feature-description'>{description}</p>
  </div>
);

// DownloadPage Component
const DownloadPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
    checkTokenAndRedirect(token, navigate);
  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Fragment>
      {/* Modal for small screens */}
      {menuOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='modal-close' onClick={toggleMenu}>
              <FaTimes />
            </button>
            <img src={logo} alt="App Logo" className='modal-logo' />
            <div className='modal-buttons'>
              <button onClick={handleDownload} className='modal-btn'><FaDownload /> Download for Android</button>
              <button className='modal-btn'><FaSignInAlt /> Sign Up</button>
              <button className='modal-btn'><FaInfoCircle /> Learn More</button>
            </div>
          </div>
        </div>
      )}
      
      <div className='website-main-div'>
        <header className='header-section-website'>
          <div className='logo-container'>
            <img src={logo} alt="App Logo" className='logo' />
          </div>
          <div className='desktop-menu'>
            <button onClick={handleDownload} className='btn-header-section'>Download for Android</button>
            <button className='btn-header-section'>Sign Up</button>
            <button className='btn-header-section'>Learn More</button>
          </div>
          <button className='mobile-menu-btn' onClick={toggleMenu}>
            <FaBars />
          </button>
        </header>
        {/* Hero Section */}
        <section className='hero-section'>
        </section>
        <div className='cta-section'>
          <h2>
            <Typewriter
              words={['Transform Your Learning Experience', 'Start Your Journey with Edusify Today!']}
              loop={true}
              cursor
              cursorStyle='|'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h2>
          <p>Join thousands of learners who have upgraded their learning experience with Edusify. Download our app or sign up to get started!</p>
          <button className='cta-button'>Start Now</button>
        </div>
        {/* Features Section */}
        <section className='features-section'>
          <div className='features-container'>
            <FeatureCard
              icon={<FaTasks />}
              heading='Tasks & Reminders'
              description='Manage tasks and set reminders for important deadlines.'
            />
            <FeatureCard
              icon={<FaUsers />}
              heading='Groups'
              description='Create groups with friends to ask questions and share details.'
            />
            <FeatureCard
              icon={<IoMdFlash />}
              heading='Notes & Flashcards'
              description='Create and download notes and flashcards as PDFs. Share with groups.'
            />
            <FeatureCard
              icon={<FaPen />}
              heading='Quizzes'
              description='Create and share quizzes. View results as admin or student.'
            />
            <FeatureCard
              icon={<FaCalendarAlt />}
              heading='Calendar Events'
              description='Add important events to the calendar and get reminders.'
            />
            <FeatureCard
              icon={<FaClock />}
              heading='Pomodoro Timer'
              description='Boost productivity with a built-in Pomodoro timer.'
            />
            <FeatureCard
              icon={<FaMusic />}
              heading='Music Player'
              description='Enjoy music with the in-built music player.'
            />
            <FeatureCard
              icon={<FaShareAlt />}
              heading='Social Feed'
              description='Post thoughts, questions, and updates in a social feed.'
            />
            <FeatureCard
              icon={<FaQuestion />}
              heading='Science & Math Helper'
              description='Get help with science and math questions directly in the app.'
            />
            <FeatureCard
              icon={<FaFilePdf />}
              heading='PDF Export'
              description='Export your notes, flashcards, and quizzes as PDFs.'
            />
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default DownloadPage;
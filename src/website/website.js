import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './website.css';
import logo from '../images/Edusify-logo-dark.png';
import { FaDownload, FaSignInAlt, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';

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

// Features Slider Component
const FeaturesSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const features = [
    { video: require('../images/add-task-vid.mp4'), title: 'Feature 1', description: 'Description for feature 1' },
    { video: require('../images/add-task-vid.mp4'), title: 'Feature 2', description: 'Description for feature 2' },
    // Add 8 more features
  ];

  return (
    <div className='features-section'>
      <div className='features-container'>
        <Slider {...settings}>
          {features.map((feature, index) => (
            <div key={index} className='feature'>
              <video loop autoPlay muted>
                <source src={feature.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

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
          <h2>Transform Your Learning Experience</h2>
          <h4>Start Your Journey with Edusify Today!</h4>
          <button className='cta-button'>Start Now</button>
        </div>
        {/* Features Section */}
        <FeaturesSlider />
      </div>
    </Fragment>
  );
};

export default DownloadPage;
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './website.css'; // Import the CSS file
import logo from '../images/Edusify-logo-dark.png';

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
    const response = await axios.post(`${API_ROUTES.sessionCheck}`, { token });

    if (response.data.exists) {
      navigate('/planner');
    } else {
      console.error('No matching token found.');
    }
  } catch (error) {
    console.error('Error checking token:', error);
  }
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
      <div className={`overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <div className='website-main-div'>
        <div className='header-section-website'>
          <header>
            <img src={logo} alt="Logo" className="logo" />
            <button className="menu-toggle" onClick={toggleMenu}>
              {menuOpen ? '×' : '☰'}
            </button>
            <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
              <button className="nav-close" onClick={toggleMenu}>×</button>
              <img src={logo} alt="Logo" className="nav-logo" />
              <div className="nav-buttons">
                <button className='nav-button download' onClick={handleDownload}>Download</button>
                <button className='nav-button'>Sign Up</button>
                <button className='nav-button'>Learn More</button>
              </div>
            </nav>
          </header>
        </div>
      </div>
    </Fragment>
  );
};

export default DownloadPage;


import React, { useEffect, useState } from 'react';
import { FaAndroid, FaApple, FaArrowAltCircleLeft, FaDesktop } from 'react-icons/fa'; // Import the icons from react-icons/fa
import { Helmet } from 'react-helmet'; // Import Helmet for SEO optimization
import './Complete-download-page.css'; // Ensure you have this CSS file for styles
import { Link } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

const DownloadPageComplete = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Check if the user is on an in-app browser (like Instagram's browser)
  useEffect(() => {
    const checkInAppBrowser = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (ua.includes('Instagram')) {
        setIsInAppBrowser(true);
      }
    };
    checkInAppBrowser();

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);



  // Open download page in a new browser window
  const handleOpenInBrowser = () => {
    const newWindow = window.open('https://edusify-download.vercel.app', '_blank');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  // Modal styles for in-app browser notification
  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  };

  const modalContentStyle = {
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#ffffff',
  };

  const linkStyle = {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: '#007BFF',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.2s',
    border: '2px solid #007BFF',
  };

  if (isInAppBrowser) {
    return (
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h2>Note</h2>
          <p>Instagram browser doesn't support downloads.</p>
          <p style={{ marginTop: '10px' }}>
            ⋮ Tap the <strong>three dots</strong> in the top right corner and select <strong>"Open in Chrome"</strong> to proceed.
          </p>
          <p>Or</p>
          <a
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText('https://edusify.vercel.app/android/download')
                .then(() => {
                  alert('Link copied! You can now paste it in your browser.');
                })
                .catch((err) => console.error('Failed to copy link: ', err));
            }}
            style={linkStyle}
          >
            Copy Link
          </a>
        </div>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
  
      // Log download request to the server
      const response = await fetch(API_ROUTES.apiLogDownload, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outcome: choiceResult.outcome,
          appTitle: 'Edusify', // You can include more data as needed
          timestamp: new Date().toISOString(),
        }),
      });
  
      if (response.ok) {
        console.log('Download request logged successfully');
      } else {
        console.error('Failed to log download request');
      }
  
      // Log user's choice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };


  return (
    <div>
      <Link to='/'>
        <button className='download-page-back-btn__complte__download__page'>
          <FaArrowAltCircleLeft />
        </button>
      </Link>

      {/* SEO Meta Tags */}
      <Helmet>
        <title>Download Edusify</title>
      </Helmet>

      <section className="download__page__complte__download__page">
        <div className="download__container__complte__download__page">

          {/* Heading */}
          <div className="download__header__complte__download__page">
            <h1 className="download__heading__complte__download__page">Download Edusify Now</h1>
            <p className="download__subheading__complte__download__page">
              Choose your platform and elevate your productivity with Edusify. Manage tasks, notes, flashcards, and more!
            </p>
          </div>

          {/* Download Options */}
          <div className="download__options__complte__download__page">
            {/* Android Option */}
            <div className="download__option__complte__download__page">
              <a onClick={handleInstallClick} className="download__link__complte__download__page" target="_blank" rel="noopener noreferrer">
                <div className="download__card__complte__download__page">
                  <FaAndroid size="3em" className="download__icon__complte__download__page" /> {/* Android Icon */}
                  <h2 className="download__platform__complte__download__page">Download Edusify for Android</h2>
                  <p className="download__description__complte__download__page">
                    Access Edusify anytime on your Android device. Fast, reliable, and easy to use. Get organized with tasks, notes, and flashcards.
                  </p>
                  <button className="download__btn__complte__download__page" onClick={handleInstallClick}>Download Now</button>
                </div>
              </a>
            </div>

            {/* iOS Option */}
            <div className="download__option__complte__download__page">
              <a href="https://edusify.vercel.app/ios/instructions/download" className="download__link__complte__download__page" target="_blank" rel="noopener noreferrer">
                <div className="download__card__complte__download__page">
                  <FaApple size="3em" className="download__icon__complte__download__page" /> {/* iOS Icon */}
                  <h2 className="download__platform__complte__download__page">Download Edusify for iOS</h2>
                  <p className="download__description__complte__download__page">
                    Seamlessly integrate Edusify into your iPhone. Boost your productivity anywhere, anytime, with task management and study tools.
                  </p>
                  <button className="download__btn__complte__download__page">Download Now</button>
                </div>
              </a>
            </div>

            {/* Web Option */}
            <div className="download__option__complte__download__page">
              <a href="https://edusify.vercel.app/" className="download__link" target="_blank" rel="noopener noreferrer">
                <div className="download__card__complte__download__page">
                  <FaDesktop size="3em" className="download__icon__complte__download__page" /> {/* Web Icon */}
                  <h2 className="download__platform__complte__download__page">Access Edusify on the Web</h2>
                  <p className="download__description__complte__download__page">
                    Access Edusify on any browser without needing to install anything. Start managing your tasks, taking notes, and using flashcards now.
                  </p>
                  <button className="download__btn__complte__download__page">Go to Web App</button>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DownloadPageComplete;

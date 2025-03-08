import React, { useEffect, useState } from 'react';
import './DownloadPage.css';
import logo from '../images/Edusify-removebg-preview.png'; // Ensure the logo path is correct
import { API_ROUTES } from '../app_modules/apiRoutes';

const DownloadPageAndroid = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [copied, setCopied] = useState(false);
  const downloadLink = "https://edusify.vercel.app/android/download";

  useEffect(() => {
    const checkInAppBrowser = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (ua.includes("Instagram")) {
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
          appTitle: "Edusify",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log('Download request logged successfully');
      } else {
        console.error('Failed to log download request');
      }

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  const handleOpenInBrowser = () => {
    const newWindow = window.open('https://edusify-download.vercel.app', '_blank');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const app = {
    title: "Edusify",
    description:
      "Edusify is your all-in-one learning companion, offering curated educational content and tools for optimal learning experiences. Download the app to elevate your studies today.",
    logo: "https://edusify-download.vercel.app/static/media/1722866972968-removebg-preview.7e58008fdb08fcfb6a92.png",
    rating: 4.8,
    version: "2.0.1",
    lastUpdated: "March 8, 2025.",
  };

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
    backgroundColor: '#ffffff', // Changed to white
    color: '#007BFF', // Set text color to a blue shade for contrast
    borderRadius: '20px', // Increased border radius for a curvier look
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.2s',
    border: '2px solid #007BFF', // Optional: add a border to define the button
};




if (isInAppBrowser) {
  return (
      <div style={modalStyle}>
          <div style={modalContentStyle}>
              <h2>Note</h2>
              <p>
                   Instagram browser doesn't support downloads. 
              </p>
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
                          .catch(err => console.error('Failed to copy link: ', err));
                  }}
                  style={linkStyle}
              >
                  Copy Link
              </a>
          </div>
      </div>
  );
}

const handleCopyLink = () => {
  navigator.clipboard.writeText(downloadLink).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Show "Copied!" for 2 seconds
  });
};

  return (
    <div className="download-page">
      <div className="app-details">
        <div className="app-header">
          <img src={app.logo} alt={app.title} className="app-logo" />
          <div className="app-info">
            <h1>{app.title}</h1>
            <div className="app-rating">
              <span>⭐⭐⭐⭐⭐</span>
              <span>{app.rating}</span>
            </div>
            <p className="app-version">Version: {app.version}</p>
            <p className="app-updated">Last updated: {app.lastUpdated}</p>
            <button className="download-btn__android" onClick={handleInstallClick}>Download</button>
          </div>
        </div>

        <div className="app-description">
          <h2>About this app</h2>
          <p>{app.description}</p>
        </div>
        
         <div className="note-container">
          <p className="download-note">
            If you can't download, copy this link and paste it in Chrome:<br /> 
            <strong>{downloadLink}</strong>
          </p>
          <button 
            className="copy-btn" 
            onClick={handleCopyLink}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPageAndroid;

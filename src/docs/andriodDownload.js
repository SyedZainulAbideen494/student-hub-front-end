import React, { useEffect, useState } from 'react';
import './DownloadPage.css';
import logo from '../images/Edusify-removebg-preview.png'; // Make sure the logo path is correct

const DownloadPageAndroid = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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
    image: "https://via.placeholder.com/150",
    rating: 4.8,
    size: "100MB",
    version: "2.0.1",
    lastUpdated: "Oct 18, 2024",
  };

  return (
    <div className="download-page__android__download">
      <div className="app-details-page__android__download">
        <div className="app-header-details__android__download">
          <img src={logo} alt={app.title} className="app-icon__android__download" />
          <div className="app-info__android__download">
            <h1>{app.title}</h1>
            <p className="app-rating__android__download">⭐ {app.rating} • Version {app.version}</p>
            <p className="app-updated__android__download">Last updated: {app.lastUpdated}</p>
            <button className="download-btn__android__download" onClick={handleInstallClick}>Download</button>
          </div>
        </div>

        <div className="app-description__android__download">
          <h2>About this app</h2>
          <p>{app.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadPageAndroid;

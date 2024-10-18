import React, { useEffect, useState } from 'react';
import './DownloadPage.css';

const DownloadPageAndorid = () => {
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

  return (
    <div className="download-page__download__andorid">
      <div className="download-container__download__andorid">
        <h1 className="download-title__download__andorid">Install Our App</h1>
        <p className="download-description__download__andorid">Get the best experience by adding our app to your home screen.</p>

        {/* PWA Install Button */}
        <button className="install-button__download__andorid" onClick={handleInstallClick}>
          Install App
        </button>
      </div>
    </div>
  );
};

export default DownloadPageAndorid;

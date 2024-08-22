import React from 'react';
import './Modal.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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

  return (
    <div className="modal-overlay-website" onClick={onClose}>
      <div className="modal-content-website" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header-website">
          <h2>Get Started with Edusify</h2>
        </header>
        <div className="modal-body-website">
          <p>Select your preferred platform to start using Edusify:</p>
        </div>
        <div className="modal-buttons-website">
          <button className="btn-android" onClick={handleDownload}>Download for Android</button>
          <span className="divider">or</span>
          <button className="btn-ios" onClick={() => window.location.href = '/sign-up'}>Sign Up for iOS</button>
          <span className="divider">or</span>
          <a href='/sign-up' className="btn-web">Use on Web</a>
        </div>
        <footer className="modal-footer-website">
          <button className="modal-close-website" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;

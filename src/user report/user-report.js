import React, { useState } from 'react';
import './UserReport.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

const UserReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [report, setReport] = useState(null);
  const [showInitialPage, setShowInitialPage] = useState(true); // Manage initial page visibility
  const nav = useNavigate();

  const generateUserReport = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch(API_ROUTES.generatePersonalReport, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to generate user report');
        setIsGenerating(false);
        
        // Hide error message after 4 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
        
        return;
      }
  
      const data = await response.json();
      setReport(data.report);
      setSuccessMessage('User report generated successfully!');
      setShowInitialPage(false);
  
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('Failed to generate user report. Please try again.');
      
      // Hide error message after 4 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateReport = async () => {
    await generateUserReport();
  };

  const handleBackClick = () => {
    nav('/');
  };

  const handleViewPreviousReports = () => {
    nav('/previous-reports'); // Navigate to the "Previous Reports" page
  };

  return (
    <div className="user__report-container">
      <header className="user__report-header">
        <button className="back-btn__report-gen" onClick={handleBackClick}>
          <FaArrowLeft />
        </button>
      </header>

      <div className="user__report-content">
        {showInitialPage && (
          <>
                      <div className="beta-mode-text">
    <span>Beta Mode</span>
  </div>
            <h2 className="user__report-subheading">Ready for your personalized report?</h2>
            <p className="user__report-description">
              Discover your strengths, areas for improvement, and more!
            </p>

            <div className="user__report-buttons">
  <div className="flashcard__set__page__modal-content" style={{ textAlign: 'center' }}>
    <button
      className="flashcard__set__page__modal-generate btn__set__page__buttons equal-width-button"
      type="submit"
      disabled={isGenerating}
      onClick={handleGenerateReport}
    >
      <div className={`sparkle__set__page__buttons ${isGenerating ? 'animating' : ''}`}>
        <svg
          height="24"
          width="24"
          fill="#FFFFFF"
          viewBox="0 0 24 24"
          data-name="Layer 1"
          id="Layer_1"
          className="sparkle__set__page__buttons"
        >
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
        </svg>
        <span className="text__set__page__buttons">
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </span>
      </div>
    </button>
    <button
      className="view-previous-reports-button btn__set__page__buttons equal-width-button"
      type="button"
      onClick={handleViewPreviousReports}
    >
      View Previous Reports
    </button>
  </div>
</div>

          </>
        )}

        {errorMessage && <div className="user__report-message user__report-error">{errorMessage}</div>}

        {report && !showInitialPage && (
          <div className="user__report-card">
            <div className="user__report-section">
              <h4 className="user__report-section-title">User Type:</h4>
              <div className="user__report-card-item">{report.userType}</div>
            </div>

            <div className="user__report-section">
              <h4 className="user__report-section-title">Strengths:</h4>
              <div className="user__report-card-list">
                {report.strengths.map((strength, index) => (
                  <div key={index} className="user__report-card-item">
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            <div className="user__report-section">
              <h4 className="user__report-section-title">Improvement Areas:</h4>
              <div className="user__report-card-list">
                {report.improvementAreas.map((area, index) => (
                  <div key={index} className="user__report-card-item">
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="user__report-section">
              <h4 className="user__report-section-title">Summary:</h4>
              <div className="user__report-card-item">{report.summary}</div>
            </div>
          </div>
        )}
      </div>

      <footer className="user__report-footer">
        <p>&copy; 2024 Edusify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserReport;

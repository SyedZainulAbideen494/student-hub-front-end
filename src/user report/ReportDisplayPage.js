import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './reportDetails.css'
import { API_ROUTES } from '../app_modules/apiRoutes';

const ReportDisplayPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`${API_ROUTES.getPrevReportWithId}/${id}`);
        console.log(response.data); // Check the data in the console
        setReport(response.data.report); // Set the nested report object
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError('Failed to fetch report details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  if (isLoading) {
    return <div className="report__details__loading">Loading...</div>;
  }

  if (error) {
    return <div className="report__details__error">{error}</div>;
  }

  if (!report) {
    return <div className="report__details__not-found">No report details found.</div>;
  }

  return (
    <div className="report__details__container">
      <div className="report__details__back-btn" onClick={() => navigate(-1)}>
        <span className="report__details__back-icon">&#8592;</span>
      </div>

      <div className="report__details__card">
        <h1 className="report__details__header">Student Report</h1>

        <h2 className="report__details__subheader">Summary</h2>
        <p className="report__details__summary">{report.summary}</p>

        <div className="report__details__strengths">
          <h2 className="report__details__subheader">Strengths</h2>
          <ul className="report__details__list">
            {report.strengths && report.strengths.length > 0 ? (
              report.strengths.map((strength, index) => (
                <li key={index} className="report__details__list-item">{strength}</li>
              ))
            ) : (
              <li className="report__details__list-item">No strengths available.</li>
            )}
          </ul>
        </div>

        <div className="report__details__improvement">
          <h2 className="report__details__subheader">Areas for Improvement</h2>
          <ul className="report__details__list">
            {report.improvementAreas && report.improvementAreas.length > 0 ? (
              report.improvementAreas.map((area, index) => (
                <li key={index} className="report__details__list-item">{area}</li>
              ))
            ) : (
              <li className="report__details__list-item">No areas for improvement.</li>
            )}
          </ul>
        </div>
      </div>

      <footer className="report__details__footer">
        <p>Report generated on {new Date(report.created_at).toLocaleDateString()}</p>
      </footer>
    </div>
  );
};

export default ReportDisplayPage;

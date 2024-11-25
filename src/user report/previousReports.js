import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PreviousReports.css'; // Add styling here
import { API_ROUTES } from '../app_modules/apiRoutes';

const PreviousReports = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
                if (!token) {
                    setError('You must be logged in to view reports.');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(API_ROUTES.getPrevReports, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReports(response.data.reports);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Failed to fetch reports. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleViewReport = (reportId) => {
        navigate(`/user/report/${reportId}`);
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (isLoading) {
        return <div className="pre__list__reports__loading">Loading...</div>;
    }

    if (error) {
        return <div className="pre__list__reports__error">{error}</div>;
    }

    return (
        <div className="pre__list__reports__container">
            <div className="pre__list__reports__header">
                <button className="pre__list__reports__back-button" onClick={handleBack}>
                    &#8592;
                </button>
                <h1 className="pre__list__reports__header-text">Previous Reports</h1>
            </div>
            {reports.length === 0 ? (
                <p className="pre__list__reports__no-reports">No reports found.</p>
            ) : (
                <div className="pre__list__reports__list">
                    {reports.map((report) => (
                        <div key={report.id} className="pre__list__reports__card">
                            <p className="pre__list__reports__date">
                                <strong>Report Date:</strong> {new Date(report.created_at).toLocaleDateString()}
                            </p>
                            <button
                                className="pre__list__reports__view-button"
                                onClick={() => handleViewReport(report.id)}
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PreviousReports;

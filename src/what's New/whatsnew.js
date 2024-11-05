import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { API_ROUTES } from '../app_modules/apiRoutes';

const WhatsNew = () => {
    const [updates, setUpdates] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        const response = await axios.get(API_ROUTES.getWhatsNew);
        setUpdates(response.data);
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div className="whats-new__page" style={styles.page}>
            <div style={styles.header}>
                <button 
                    onClick={handleBack} 
                    style={styles.backButton}
                >
                    &#8592;
                </button>
                <h2 style={styles.pageTitle}>What's New</h2>
            </div>
            <div style={styles.updatesContainer}>
                {updates.map((update) => (
                    <div 
                        key={update.id} 
                        className="update-card__page" 
                        style={styles.updateCard}
                    >
                        <h3 style={styles.updateTitle}>{update.title}</h3>
                        <p style={styles.updateContent}>{update.content}</p>
                        <small style={styles.updateDate}>
    {new Date(update.created_at).toLocaleDateString()}
</small>

                    </div>
                ))}
            </div>
        </div>
    );
};

// CSS in JS for better readability and customization
const styles = {
    page: {
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
    },
    backButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '30px',
        color: '#4f4f4f',
        marginRight: '20px',
    },
    pageTitle: {
        margin: 0,
        fontSize: '28px',
        fontWeight: '600',
        color: '#333',
        letterSpacing: '0.5px',
        textAlign: 'center',
    },
    updatesContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    updateCard: {
        padding: '25px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
    },
    updateCardHover: {
        transform: 'translateY(-5px)',
    },
    updateTitle: {
        margin: '0 0 15px',
        fontSize: '22px',
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
    },
    updateContent: {
        margin: '0 0 15px',
        color: '#555',
        fontSize: '16px',
        lineHeight: '1.6',
        textAlign: 'center',
    },
    updateDate: {
        display: 'block',
        textAlign: 'center',
        color: '#777',
        fontSize: '14px',
    },
};

export default WhatsNew;

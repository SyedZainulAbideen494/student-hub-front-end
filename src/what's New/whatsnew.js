// WhatsNew.js
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
        <div className="whats-new__page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={handleBack} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#000', marginRight: '10px' }}
                >
                    &#8592; {/* Left arrow symbol */}
                </button>
                <h2 style={{ margin: 0, textAlign: 'center' }}>What's New</h2>
            </div>
            <div>
                {updates.map((update) => (
                    <div 
                        key={update.id} 
                        className="update-card__page" 
                        style={{ marginBottom: '20px', padding: '15px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    >
                        <h3 style={{ margin: '0 0 10px', textAlign: 'center' }}>{update.title}</h3> {/* Centering the title */}
                        <p style={{ margin: '0 0 10px', color: '#333' }}>{update.content}</p>
                        <small style={{ display: 'block', textAlign: 'center', color: '#888', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
                            {new Date(update.created_at).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhatsNew;

import React, { useEffect, useState } from 'react';
import './SuccessMessage.css'; // Import the CSS file for styling

const SuccessMessage = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Hiding success message');
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    console.log('Rendering SuccessMessage with message:', message);

    return (
        <div className="success-message-sucess-modal">
            {message}
        </div>
    );
};

export default SuccessMessage;

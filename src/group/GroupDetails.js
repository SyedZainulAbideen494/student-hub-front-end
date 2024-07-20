import React, { useState } from 'react';
import './GroupDetails.css'; // Import CSS for modal styling

const GroupDetailModal = ({ groupDetails, members, onClose, onInvite }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleInvite = async () => {
        if (!phoneNumber) {
            setErrorMessage('Phone number is required.');
            return;
        }

        try {
            await onInvite(phoneNumber);
            setPhoneNumber('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    if (!groupDetails) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose} style={{color: 'black'}}>×</button>
                <h2>{groupDetails.name}</h2>
                <p>Status: {groupDetails.is_public ? 'Public' : 'Private'}</p>
                <h3>Members</h3>
                <ul>
                    {members.map(member => (
                        <li key={member.id}>{member.user_name}</li>
                    ))}
                </ul>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter phone number"
                />
                <button className="invite-button" onClick={handleInvite}>Invite Members</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default GroupDetailModal;
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
        <div className="modal-overlay-group-details">
            <div className="modal-content-group-details">
                <button className="close-button-group-details" onClick={onClose}>×</button>
                <h2>{groupDetails.name}</h2>
                <p>{groupDetails.description}</p>
                <p>Status: {groupDetails.is_public ? 'Public' : 'Private'}</p>
                
                <h3 className="members-heading">Members</h3>
                <div className="members-container">
                    {members.map(member => (
                        <div key={member.id} className="member-card">
                            <p className="member-name">{member.user_name}</p>
                        </div>
                    ))}
                </div>
                
                <h3 className="invite-heading">Invite Members</h3>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter phone number"
                />
                <button className="invite-button-group-details" onClick={handleInvite}>Invite Members</button>
                {errorMessage && <p className="error-message-group-details">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default GroupDetailModal;
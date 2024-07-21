import React from 'react';
import './InvitationModal.css'; // Make sure to style this modal appropriately

const InvitationModal = ({ visible, invitations, onResponse, onClose }) => {
    if (!visible) return null;

    return (
        <div className="invitation-modal">
            <div className="modal-content">
                <h2>Invitations</h2>
                <ul>
                    {invitations.map((invitation) => (
                        <li key={invitation.group_id} className="invitation-item">
                            <span>{invitation.group_name}</span>
                            <button 
                                className="accept-button" 
                                onClick={() => onResponse(invitation.group_id, invitation.phone_number, 'accept')}
                            >
                                Accept
                            </button>
                            <button 
                                className="ignore-button" 
                                onClick={() => onResponse(invitation.group_id, invitation.phone_number, 'ignore')}
                            >
                                Ignore
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default InvitationModal;

import React from 'react';
import './InvitationModal.css';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const InvitationModal = ({ visible, invitations, onResponse, onClose }) => {
    if (!visible) return null;

    return (
        <div className="invitation-modal-inv-modal">
            <div className="modal-content-inv-modal">
                <h2 className="invitation-header-inv-modal">Invitations</h2>
                <button className="close-button-inv-modal" onClick={onClose}>
                    <FaTimes />
                </button>
                <ul className="invitation-list-inv-modal">
                    {invitations.map((invitation) => (
                        <li key={invitation.group_id} className="invitation-item-inv-modal">
                            <span className="group-name-inv-modal">{invitation.group_name}</span>
                            <div className="button-group-inv-modal">
                                <button 
                                    className="accept-button-inv-modal" 
                                    onClick={() => onResponse(invitation.group_id, invitation.phone_number, 'accept')}
                                >
                                    <FaCheckCircle className="icon-inv-modal" />
                                </button>
                                <button 
                                    className="ignore-button-inv-modal" 
                                    onClick={() => onResponse(invitation.group_id, invitation.phone_number, 'ignore')}
                                >
                                    <FaTimesCircle className="icon-inv-modal" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InvitationModal;

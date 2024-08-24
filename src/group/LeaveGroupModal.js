import React from 'react';
import './LeaveGroupModal.css'; // Import CSS for styling

const LeaveGroupModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Are you sure you want to leave this group?</h3>
                <p>This action cannot be undone.</p>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Yes, Leave</button>
                    <button className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LeaveGroupModal;

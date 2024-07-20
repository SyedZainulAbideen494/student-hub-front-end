// GroupModal.js
import React from 'react';
import './GroupModal.css'; // Import your CSS file for styling

const GroupModal = ({ groups, onClose, onShare }) => {
    return (
        <div className="group-modal-overlay">
            <div className="group-modal">
                <h2>Select a Group to Share</h2>
                <ul>
                    {groups.map(group => (
                        <li key={group.id} onClick={() => onShare(group.id)}>
                            {group.name}
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


export default GroupModal;

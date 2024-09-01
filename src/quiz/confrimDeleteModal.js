import React, { useState, useEffect } from 'react';
import './confrimDeleteModal.css';

const DeleteConfirmationModal = ({ quizId, onConfirm, onClose }) => {
    const [showModal, setShowModal] = useState(true);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (animate) {
            setTimeout(() => onClose(), 500); // Close after animation
        }
    }, [animate, onClose]);

    const handleConfirm = () => {
        setAnimate(true);
        setTimeout(() => onConfirm(quizId), 500); // Confirm action after animation
    };

    const handleClose = () => {
        setShowModal(false);
        setAnimate(true);
    };

    return (
        <div className={`delete-confirmation-modal-quiz ${showModal ? 'show' : ''}`}>
            <div className={`modal-content-quiz ${animate ? 'tear bin-animation' : 'show'}`}>
                <h3>Are you sure you want to delete this quiz?</h3>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={handleClose}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
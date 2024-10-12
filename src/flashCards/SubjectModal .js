import React, { useState } from 'react';
import './SubjectModal.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const SubjectModal = ({ onClose, onCreate }) => {
    const [subjectName, setSubjectName] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (subjectName.trim()) {
            const token = localStorage.getItem('token'); // Retrieve token from local storage

            try {
                const response = await fetch(API_ROUTES.createSubject, { // Update the endpoint as needed
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Send token in Authorization header
                    },
                    body: JSON.stringify({ subjectName })
                });

                if (!response.ok) {
                    throw new Error('Failed to create subject'); // Handle error response
                }

                const data = await response.json();
                onCreate(data.subject); // Call onCreate with the created subject
                setSubjectName(''); // Clear input
                setError(''); // Clear any previous errors
                onClose(); // Close modal after creation
            } catch (error) {
                setError(error.message); // Set error message
            }
        }
    };

    return (
        <div className="modal__subject__creation__container__create__subject__modal">
            <div className="modal__content__subject__creation__create__subject__modal">
                <h2 className="modal__header__create__subject__modal">Create Subject</h2>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <input
                    className="modal__input__create__subject__modal"
                    type="text"
                    placeholder="Enter subject name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                />
                <div className="modal__actions__subject__creation__create__subject__modal">
                    <button
                        className="modal__button__create__subject__modal modal__button__cancel__create__subject__modal"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="modal__button__create__subject__modal modal__button__submit__create__subject__modal"
                        onClick={handleCreate}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubjectModal;

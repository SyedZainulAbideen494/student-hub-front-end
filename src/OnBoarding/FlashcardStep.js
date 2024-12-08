import React, { useState } from 'react';
import './FlashcardStep.css';

const FlashcardStep = ({ setName, setSubject, setTopic, setSelectedFile, onNext, onBack }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleCreateSet = () => {
        // Handle AI-based flashcard set creation
        setSuccessMessage('🎉 Flashcard Set Generated Successfully with AI!');
        setShowSuccessModal(true);
    };

    const handleGenerateFromPDF = () => {
        // Handle flashcards generation from PDF
        setSuccessMessage('📄 Flashcards Generated Successfully from PDF!');
        setShowSuccessModal(true);
    };

    return (
        <div className="container__onboarding__page__component__flashcard">
            <div className='flashcard__card'>
            <h2 className="heading__onboarding__page__component__flashcard">Create Your First Flashcard Set</h2>
            <input
                className="input__onboarding__page__component__flashcard"
                type="text"
                placeholder="Set Name"
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="input__onboarding__page__component__flashcard"
                type="text"
                placeholder="Subject"
                onChange={(e) => setSubject(e.target.value)}
            />
            <input
                className="input__onboarding__page__component__flashcard"
                type="text"
                placeholder="Topic"
                onChange={(e) => setTopic(e.target.value)}
            />
            <div className="generation-container__onboarding__page__component__flashcard">
                <h3 className="subheading__onboarding__page__component">Choose Generation Method</h3>
                <button
                    className="button__onboarding__page__component__flashcard ai-button__onboarding__page__component__flashcard"
                    onClick={handleCreateSet}
                >
                    Generate with AI
                </button>
                <div className="file-upload-container__onboarding__page__component__flashcard">
                    <label className="file-label__onboarding__page__component__flashcard">
                        Upload PDF:
                        <input
                            type="file"
                            accept="application/pdf"
                            className="file-input__onboarding__page__component__flashcard"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                    </label>
                    <button
                        className="button__onboarding__page__component__flashcard pdf-button__onboarding__page__component__flashcard"
                        onClick={handleGenerateFromPDF}
                    >
                        Generate from PDF
                    </button>
                </div>
            </div>
            
            </div>
            {showSuccessModal && (
                <div className="modal__onboarding__page__component">
                    <div className="modal-content__onboarding__page__component">
                        <h3 className="modal-heading__onboarding__page__component">{successMessage}</h3>
                        <p className="modal-text__onboarding__page__component">
                            You're all set to begin studying with your flashcards!
                        </p>
                        <button
                            className="button__onboarding__page__component next__onboarding__page__component"
                            onClick={onNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardStep;

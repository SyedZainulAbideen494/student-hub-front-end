import React, { useState } from 'react';
import './EventStep.css';

const EventStep = ({ eventData, setEventData, onNext, onBack }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSave = () => {
        setShowSuccessModal(true);
    };

    return (
        <div className="container__onboarding__page__component__events">
            <div className='event__card'>
            <h2 className="heading__onboarding__page__component__events">Add Your First Event</h2>
            <input
                className="input__onboarding__page__component__events"
                type="text"
                placeholder="Event Title"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            />
            <input
                className="input__onboarding__page__component__events"
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
            />
            <button className="button__onboarding__page__component__events save__onboarding__page__component__events" onClick={handleSave}>
                Save Event
            </button>

            </div>
            {showSuccessModal && (
                <div className="modal__onboarding__page__component__modal">
                <div className="modal-content__onboarding__page__component__modal">
                    <h3 className="modal-heading__onboarding__page__component__modal">Boom! Event Added Like a Boss!</h3>
                    <p className="modal-text__onboarding__page__component__modal">
                        Your first event is locked and loaded! 🎯 Time to unleash the fun and make some epic memories. Let's get this party started! 🥳
                    </p>
                    <button
                        className="button__onboarding__page__component__modal next__onboarding__page__component__modal"
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

export default EventStep;

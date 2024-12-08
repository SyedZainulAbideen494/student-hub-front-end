import React, { useState } from 'react';
import './AllSetStep.css';

const AllSetStep = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(true);

    const handleGoToDashboard = () => {
        window.location.href = '/';
    };

    return (
<div className="container__onboarding__page__component__all__set">
    <div className="card__onboarding__page__component__all__set">
        <h1 className="heading__onboarding__page__component__all__set">All Set!</h1>
        <p className="description__onboarding__page__component__all__set">
            Your onboarding is complete. Explore Edusify now!
        </p>
        <button
            className="button__onboarding__page__component__all__set go-to-dashboard__onboarding__page__component__all__set"
            onClick={handleGoToDashboard}
        >
            Go to Dashboard
        </button>
    </div>
</div>

    );
};

export default AllSetStep;

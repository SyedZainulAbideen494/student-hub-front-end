import React from 'react';
import './WelcomeStep.css';

const WelcomeStep = ({ onNext }) => {
    return (
        <div className="container__onboarding__page__component__welcome">
            <div className="card__container__onboarding__page__component__welcome">
                <h1 className="heading__onboarding__page__component__welcome">Welcome to Edusify!</h1>
                <p className="paragraph__onboarding__page__component__welcome">
                    Let's get started with setting up your account.
                </p>
                <button className="button__onboarding__page__component__welcome" onClick={onNext}>
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomeStep;

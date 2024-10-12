import React from 'react';
import './PageStyles.css';

const PrivacyPolicy = () => {
    return (
        <div className="policy__page">
            <h1 className="heading__policy__page">Privacy Policy</h1>
            <p className="content__policy__page">
                Your privacy is important to us. We collect data such as your email, phone number, name, and activities within the app. 
                All data is encrypted and handled with care in accordance with the best security practices.
            </p>
            <h2 className="subheading__policy__page">What Data We Collect</h2>
            <p className="content__policy__page">
                We collect information such as:
                <ul>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>Activities (Tasks, Events, AI Questions)</li>
                </ul>
            </p>
            <h2 className="subheading__policy__page">How We Use Your Data</h2>
            <p className="content__policy__page">
                We use the data to:
                <ul>
                    <li>Track your progress</li>
                    <li>Enhance your experience in the app</li>
                    <li>Provide insights and analytics</li>
                </ul>
            </p>
        </div>
    );
};

export default PrivacyPolicy;

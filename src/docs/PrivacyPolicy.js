import React from 'react';
import './PageStyles.css';

const PrivacyPolicy = () => {
    return (
        <div className="policy__page">
            <h1 className="heading__policy__page">Privacy Policy</h1>
            <p className="content__policy__page">
                Your privacy is important to us. This Privacy Policy outlines the types of data we collect, how we use it, and the measures we take to protect your information. By using Edusify, you consent to the data practices described in this policy.
            </p>
            <p className="content__policy__page"><strong>Last Updated:</strong> February 17, 2025</p>

            <h2 className="subheading__policy__page">What Data We Collect</h2>
            <p className="content__policy__page">
                We collect the following types of information:
            </p>
            <ul className="content__policy__page">
                <li><strong>Email Address:</strong> To create and manage your account, and for communication purposes.</li>
                <li><strong>Phone Number:</strong> For account verification and secure access.</li>
                <li><strong>Activities:</strong> Including tasks, events, AI queries, notes, and other actions within the app.</li>
                <li><strong>Device Information:</strong> Such as your operating system, app version, and device type for troubleshooting and improvements.</li>
                <li><strong>Usage Data:</strong> Insights into how you interact with features to optimize app performance and enhance your experience.</li>
                <li><strong>Location Data:</strong> If you allow location access, we collect your geographic location to provide location-based features like study group suggestions and exam event reminders. We only collect location data when explicitly permitted, and you can choose to disable this feature at any time. The location is used solely for enhancing your experience within the app and is not shared with third parties without your consent.</li>
            </ul>

            <h2 className="subheading__policy__page">How We Use Your Data</h2>
            <p className="content__policy__page">
                We use the collected data to:
            </p>
            <ul className="content__policy__page">
                <li>Track your progress and provide personalized recommendations.</li>
                <li>Enhance your overall experience by improving app features and functionality.</li>
                <li>Generate insights and analytics for better user support and app development.</li>
                <li>Ensure a safe and secure environment by monitoring for inappropriate or harmful activity.</li>
                <li>Provide location-based features, if enabled.</li>
            </ul>

            <h2 className="subheading__policy__page">Monitoring User Inputs</h2>
            <p className="content__policy__page">
                To maintain a safe and productive platform, we monitor user inputs such as AI-generated questions, notes, and other shared content. This monitoring is conducted solely for the following reasons:
            </p>
            <ul className="content__policy__page">
                <li><strong>Security:</strong> To identify and prevent harmful or inappropriate behavior within the app.</li>
                <li><strong>Compliance:</strong> To ensure adherence to our Terms and Conditions.</li>
                <li><strong>Improvement:</strong> To refine AI functionality and ensure accuracy in responses.</li>
            </ul>
            <p className="content__policy__page">
                All monitoring is conducted transparently, and we do not use this information for any purpose beyond the stated reasons. Your data is treated with the utmost confidentiality and handled in compliance with relevant data protection laws.
            </p>

            <h2 className="subheading__policy__page">Data Protection and Security</h2>
            <p className="content__policy__page">
                We prioritize the security of your data through industry-standard encryption and security measures. Access to your data is limited to authorized personnel who are bound by confidentiality obligations. Regular security audits and updates ensure that your information remains protected. Edusify does not store or retain sensitive data beyond what is necessary for the app’s functionality.
            </p>

            <h2 className="subheading__policy__page">Sharing Your Data</h2>
            <p className="content__policy__page">
                We do not share your personal data with third parties without your explicit consent, except in the following cases:
            </p>
            <ul className="content__policy__page">
                <li>To comply with legal requirements, such as court orders or regulatory investigations.</li>
                <li>To protect the rights, property, or safety of Edusify, its users, or the public.</li>
                <li>In the event of a business merger, acquisition, or sale, where your data may be transferred to the new entity.</li>
            </ul>

            <h2 className="subheading__policy__page">Your Rights</h2>
            <p className="content__policy__page">
                You have the right to:
            </p>
            <ul className="content__policy__page">
                <li>Access the data we have collected about you.</li>
                <li>Request corrections to inaccurate or incomplete information.</li>
                <li>Request deletion of your data, subject to legal and operational limitations.</li>
                <li>Withdraw consent for data processing where applicable.</li>
            </ul>

            <h2 className="subheading__policy__page">Changes to this Policy</h2>
            <p className="content__policy__page">
                We may update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be communicated via updates in the app or notifications to your registered email address.
            </p>

            <h2 className="subheading__policy__page">Contact Us</h2>
            <p className="content__policy__page">
                If you have any questions or concerns regarding this Privacy Policy or your data, please contact us through our support channels. We are committed to addressing your concerns promptly and transparently.
            </p>

            <p className="content__policy__page">
                Thank you for trusting Edusify. Your privacy and security are our top priorities.
            </p>
        </div>
    );
};

export default PrivacyPolicy;

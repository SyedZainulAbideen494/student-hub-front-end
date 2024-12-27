import React from 'react';
import './PageStyles.css';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div className="policy__page">
            <h1 className="heading__policy__page">Terms and Conditions</h1>
            <p className="content__policy__page">
                Welcome to Edusify! These Terms and Conditions ("Terms") govern your use of our app and services. By accessing or using Edusify, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please refrain from using our app.
            </p>

            <h2 className="subheading__policy__page">Eligibility</h2>
            <p className="content__policy__page">
                1. You must be at least 14 years old to create an account and use Edusify. By using the app, you confirm that you meet this age requirement. If you are under 14, your account may be terminated without notice.
            </p>

            <h2 className="subheading__policy__page">Account Security</h2>
            <p className="content__policy__page">
                2. You are responsible for maintaining the confidentiality of your account credentials, including your username and password. Sharing your account details with others is strictly prohibited. Any activity conducted through your account is your responsibility, and you agree to notify us immediately of any unauthorized access or use.
            </p>

            <h2 className="subheading__policy__page">Appropriate Usage</h2>
            <p className="content__policy__page">
                3. All users are expected to use Edusify responsibly and ethically. Any form of inappropriate behavior, including but not limited to abusive language, harassment, sharing of offensive content, or any other activity that disrupts the experience of other users, will result in account suspension or permanent termination.
            </p>

            <h2 className="subheading__policy__page">Monitoring AI-Generated Questions</h2>
            <p className="content__policy__page">
                4. To ensure a safe and positive experience for all users, Edusify monitors AI-generated questions and other content created within the app. This monitoring helps us detect and prevent any harmful, inappropriate, or misleading behavior. We do this for your safety and to maintain the integrity of the app. If we identify any suspicious or unsafe activities, we may take necessary actions, including but not limited to content removal, account suspension, or termination.
            </p>

            <h2 className="subheading__policy__page">Acceptance of Related Policies</h2>
            <p className="content__policy__page">
                5. By agreeing to these Terms, you also acknowledge and accept our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/more-info">More Information</Link>. These documents provide detailed information on how we handle your data, your rights as a user, and additional guidelines for using Edusify.
            </p>

            <h2 className="subheading__policy__page">Data Collection and Usage</h2>
            <p className="content__policy__page">
                6. Edusify collects and processes data in compliance with applicable laws to enhance user experience and improve app functionality. For detailed information, please refer to our <Link to="/privacy-policy">Privacy Policy</Link>. By using the app, you consent to our data practices as outlined in these policies.
            </p>

            <h2 className="subheading__policy__page">Prohibited Activities</h2>
            <p className="content__policy__page">
                7. You agree not to engage in activities that:
            </p>
            <ul className="content__policy__page">
                <li>Violate any laws or regulations.</li>
                <li>Compromise the security of the app or other users' accounts.</li>
                <li>Use automated scripts or bots to access or interact with the app.</li>
                <li>Distribute malware, viruses, or any other harmful software.</li>
            </ul>

            <h2 className="subheading__policy__page">Account Termination</h2>
            <p className="content__policy__page">
                8. We reserve the right to suspend or terminate your account at our discretion for violations of these Terms or any other reason deemed necessary to protect the integrity of Edusify and its community.
            </p>

            <h2 className="subheading__policy__page">Limitation of Liability</h2>
            <p className="content__policy__page">
                9. Edusify is provided on an "as-is" basis. While we strive to ensure the app functions smoothly, we do not guarantee uninterrupted or error-free service. We are not liable for any damages arising from the use or inability to use the app.
            </p>

            <h2 className="subheading__policy__page">Changes to Terms</h2>
            <p className="content__policy__page">
                10. Edusify reserves the right to modify these Terms at any time. Any changes will be communicated via updates within the app or notifications sent to your registered email. Continued use of the app after changes have been made constitutes your acceptance of the updated Terms.
            </p>

            <h2 className="subheading__policy__page">Contact Us</h2>
            <p className="content__policy__page">
                11. If you have any questions or concerns regarding these Terms or any aspect of Edusify, please reach out to us through our support channels.
            </p>

            <p className="content__policy__page">
                Thank you for choosing Edusify. We are committed to providing a safe and productive environment for all users.
            </p>
        </div>
    );
};

export default TermsAndConditions;

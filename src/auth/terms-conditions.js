import React from 'react';
import { Link } from 'react-router-dom';
import './TermsAndConditions.css'; // Ensure to create and link the CSS file

const TermsAndConditions = () => {
    return (
        <div className="terms-container">
            <h1>Terms and Conditions</h1>
            <section className="about-app-section">
                <h2>About the App</h2>
                <p>
                    Welcome to our app. We provide a suite of tools designed to enhance your study experience, including a study planner, online quizzes, flashcards, and a homework help community. By using our app, you agree to comply with the following terms and conditions.
                </p>
            </section>
            <section className="features-section">
                <h2>Core Features</h2>
                <ul>
                    <li><strong>Study Planner and Organizer</strong>
                        <ul>
                            <li>Calendar Integration (Google Calendar Sync)</li>
                            <li>Task Manager (Create, Prioritize, Track Tasks)</li>
                            <li>Reminders and Notifications</li>
                        </ul>
                    </li>
                    <li><strong>Online Quiz and Flashcard Tool</strong>
                        <ul>
                            <li>Custom Quizzes (Create and Share)</li>
                            <li>Flashcards (Generate and Review)</li>
                            <li>Progress Tracking</li>
                        </ul>
                    </li>
                    <li><strong>Homework Help and Study Community</strong>
                        <ul>
                            <li>Discussion Boards (Ask and Answer Questions)</li>
                            <li>Resource Sharing (Notes, Study Guides)</li>
                        </ul>
                    </li>
                </ul>
            </section>
            <section className="legal-section">
                <h2>Legal Information</h2>
                <p>
                    By accessing and using our app, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the app. We reserve the right to modify these Terms and Conditions at any time without prior notice. Your continued use of the app after such modifications constitutes your acceptance of the updated Terms and Conditions.
                </p>
                <p>
                    The app is provided on an "as-is" and "as-available" basis. We make no warranties or representations about the accuracy, reliability, or completeness of the app or its content. We disclaim all warranties, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
                </p>
                <p>
                    We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from or related to your use of the app, including but not limited to damages for loss of profits, data, or other intangible losses.
                </p>
                <p>
                    We do not guarantee that the app will be available at all times or that it will be free from errors or viruses. It is your responsibility to take appropriate measures to protect your device and data.
                </p>
            </section>
            <section className="data-protection-section">
                <h2>Data Protection</h2>
                <p>
                    We are committed to protecting your personal data and privacy. We will collect and store your email address, phone number, and username for the purpose of managing your account, providing notifications, and improving our services. We use industry-standard security measures to safeguard your data, but please be aware that no system is completely secure.
                </p>
                <p>
                    While we take reasonable precautions to protect your data, we cannot guarantee the absolute security of your information. In the event of a data breach, we will notify you in accordance with applicable laws but will not be liable for any unauthorized access or use of your data.
                </p>
                <p>
                    By using the app, you consent to the collection, storage, and use of your personal data as described in this section.
                </p>
            </section>
            <section className="user-responsibilities-section">
                <h2>User Responsibilities</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account information, including your username and password. You must notify us immediately if you suspect any unauthorized use of your account or any other breach of security.
                </p>
                <p>
                    You agree to use the app in compliance with all applicable laws and regulations. You must not engage in any activity that could harm or disrupt the app or its users, including but not limited to distributing malware or engaging in fraudulent activities.
                </p>
                <p>
                    You are solely responsible for any content you submit or share through the app. We do not endorse or take responsibility for any user-generated content and are not liable for any loss or damage arising from such content.
                </p>
            </section>
            <div className="back-button-container">
                <Link to="/sign-up" className="back-button">Back to Sign Up</Link>
            </div>
        </div>
    );
};

export default TermsAndConditions;
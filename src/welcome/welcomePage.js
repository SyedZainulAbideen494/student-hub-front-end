import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';
import axios from 'axios';
import { subscribeUser } from '../api/api'; // Correctly import subscribeUser
import { urlBase64ToUint8Array } from '../utils/webPushUtils';

const Welcome = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [transition, setTransition] = useState('');
    const [subscription, setSubscription] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Request notification permission and subscription
    const requestNotificationPermission = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const swRegistration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker Registered:', swRegistration);

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setPermissionGranted(true);
                    const subscription = await swRegistration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array('BB0t-WTOpYNRM6b24mcvZKliaHnYK0umXovnqouKrFpSD8Zeq07V9N_z1jTwhenXBJ-Rlf_UxplpYculchlM3ug'),
                    });
                    console.log('Push Subscription:', subscription);
                    setSubscription(subscription);
                    await subscribeUser(subscription);
                } else {
                    console.warn('Notification permission denied');
                }
            } catch (error) {
                console.error('Error registering service worker or subscribing:', error);
            }
        }
    };

    // Call requestNotificationPermission when the component mounts
    useEffect(() => {
        // You can choose to call this function based on user interaction as well
    }, []);

    const handleNext = () => {
        if (currentStep < 3) {
            setTransition('hidden');
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setTransition('show');
            }, 500);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setTransition('hidden');
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setTransition('show');
            }, 500);
        }
    };

    return (
        <div className="welcome-page">
            <div className={`welcome-section ${transition}`}>
                {currentStep === 1 && (
                    <div>
                        <header className="welcome-header-welcome-page">
                            <h1>Welcome to Edusify!</h1>
                            <p>Your all-in-one study and organization app.</p>
                        </header>
                        <main className="welcome-content-welcome-page">
                            <button className="continue-button-welcome-page" onClick={handleNext}>Next</button>
                            <div className="pagination-dots">
                                {[1, 2, 3].map((step) => (
                                    <span key={step} className={`dot ${currentStep === step ? 'active' : ''}`} />
                                ))}
                            </div>
                        </main>
                    </div>
                )}
{currentStep === 2 && (
    <div className="welcome-section-container">
        <header className="welcome-header-welcome-page">
            <h1>About Edusify</h1>
            <p>Discover how Edusify can help you manage your study and stay organized.</p>
        </header>
        <main className="welcome-content-welcome-page">
            <section className="app-overview-welcome-page">
                <h2>Features</h2>
                <p>Edusify offers a variety of features to enhance your study experience:</p>
                <ul className="features-list">
                    <li><strong>Study Planner:</strong> Add tasks, get reminders, and view your schedule on a calendar.</li>
                    <li><strong>Groups:</strong> Create groups with friends or join public groups to ask questions and share knowledge.</li>
                    <li><strong>Notes:</strong> Create and share notes, and manage your study materials.</li>
                    <li><strong>Quizzes:</strong> Create quizzes, challenge friends, and view results.</li>
                    <li><strong>Calendar:</strong> Manage events, get reminders, and stay organized.</li>
                    <li><strong>Pomodoro Timer:</strong> Stay focused with our built-in Pomodoro timer.</li>
                    <li><strong>Math Solver:</strong> Solve complex math problems with ease.</li>
                    <li><strong>Science Helper:</strong> Get assistance with science topics and experiments.</li>
                    <li><strong>Commerce Helper:</strong> Understand and solve commerce-related problems.</li>
                    <li><strong>Social Feed:</strong> Stay updated with your peers and share your achievements.</li>
                </ul>
                <div className="button-container">
                    <button className="continue-button-welcome-page" onClick={handlePrevious}>Previous</button>
                    <button className="continue-button-welcome-page" onClick={handleNext}>Next</button>
                </div>
                <div className="pagination-dots">
                    {[1, 2, 3].map((step) => (
                        <span key={step} className={`dot ${currentStep === step ? 'active' : ''}`} />
                    ))}
                </div>
            </section>
        </main>
    </div>
)}


                {currentStep === 3 && (
                    <div>
                        <header className="welcome-header-welcome-page">
                            <h1>Explore Features</h1>
                        </header>
                        <main className="welcome-content-welcome-page">
                            <section className="features-welcome-page">
                                <div className="feature-cards-welcome-page">
                                    {/* Existing features */}
                                    <div className="feature-card-welcome-page">
                                        <h3>Study Planner</h3>
                                        <p>Organize your tasks and get reminders. View your schedule on a calendar.</p>
                                        <Link to="/" className="continue-button-welcome-page">Continue to Study Planner</Link>
                                    </div>
                                    <div className="feature-card-welcome-page">
                                        <h3>Groups</h3>
                                        <p>Create groups with friends or join public groups to ask questions and share knowledge.</p>
                                        <Link to="/groups" className="continue-button-welcome-page">Continue to Groups</Link>
                                    </div>
                                    <div className="feature-card-welcome-page">
                                        <h3>Notes</h3>
                                        <p>Create and share notes, and manage your study materials.</p>
                                        <Link to="/notes" className="continue-button-welcome-page">Continue to Notes</Link>
                                    </div>
                                    <div className="feature-card-welcome-page">
                                        <h3>Quizzes</h3>
                                        <p>Create quizzes, challenge friends, and view results.</p>
                                        <Link to="/quiz/home" className="continue-button-welcome-page">Continue to Quizzes</Link>
                                    </div>
                                    <div className="feature-card-welcome-page">
                                        <h3>Calendar</h3>
                                        <p>Manage events, get reminders, and stay organized.</p>
                                        <Link to="/calendar" className="continue-button-welcome-page">Continue to Calendar</Link>
                                    </div>
                                    <div className="feature-card-welcome-page">
                                        <h3>Pomodoro Timer</h3>
                                        <p>Stay focused with our built-in Pomodoro timer.</p>
                                        <Link to="/pomodoro" className="continue-button-welcome-page">Continue to Pomodoro Timer</Link>
                                    </div>
                                  
                                    {/* New features */}
                                    <div className="feature-card-welcome-page">
  <h3>AI Solver</h3>
  <p>Get instant, step-by-step solutions to any problem, from math to science and beyond. Simplify your studies with our AI-powered solver, designed to help you tackle even the most challenging questions.</p>
  <Link to="/ai" className="continue-button-welcome-page">Explore the AI Solver</Link>
</div>

                                    <div className="feature-card-welcome-page">
                                        <h3>Social Feed</h3>
                                        <p>Stay updated with your peers and share your achievements.</p>
                                        <Link to="/social-feed" className="continue-button-welcome-page">Continue to Social Feed</Link>
                                    </div>
                                </div>
                                {!permissionGranted && (
                                    <button className="continue-button-welcome-page" onClick={requestNotificationPermission}>
                                        Enable Notifications
                                    </button>
                                )}
                            </section>
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Welcome;

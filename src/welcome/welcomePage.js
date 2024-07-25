import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';

const Welcome = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [transition, setTransition] = useState('');

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
                        </main>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <header className="welcome-header-welcome-page">
                            <h1>About Edusify</h1>
                            <p>Discover how Edusify can help you manage your study and stay organized.</p>
                        </header>
                        <main className="welcome-content-welcome-page">
                            <section className="app-overview-welcome-page">
                                <h2>Features</h2>
                                <p>Edusify offers a variety of features to enhance your study experience:</p>
                                <ul>
                                    <li><strong>Study Planner:</strong> Add tasks, get reminders, and view your schedule on a calendar.</li>
                                    <li><strong>Groups:</strong> Create groups with friends or join public groups to ask questions and share knowledge.</li>
                                    <li><strong>Notes:</strong> Create and share notes, and manage your study materials.</li>
                                    <li><strong>Quizzes:</strong> Create quizzes, challenge friends, and view results.</li>
                                    <li><strong>Calendar:</strong> Manage events, get reminders, and stay organized.</li>
                                    <li><strong>Pomodoro Timer:</strong> Stay focused with our built-in Pomodoro timer.</li>
                                    <li><strong>Music Player:</strong> Play music directly through the app.</li>
                                </ul>
                                <button className="continue-button-welcome-page" onClick={handlePrevious}>Previous</button>
                                <button className="continue-button-welcome-page" onClick={handleNext}>Next</button>
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
                                    <div className="feature-card-welcome-page">
                                        <h3>Study Planner</h3>
                                        <p>Organize your tasks and get reminders. View your schedule on a calendar.</p>
                                        <Link to="/planner" className="continue-button-welcome-page">Continue to Study Planner</Link>
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
                                        <Link to="/quizzes" className="continue-button-welcome-page">Continue to Quizzes</Link>
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
                                    <div className="feature-card-welcome-page">
                                        <h3>Music Player</h3>
                                        <p>Play music directly through the app.</p>
                                        <Link to="/music" className="continue-button-welcome-page">Continue to Music Player</Link>
                                    </div>
                                </div>
                                <button className="continue-button-welcome-page" onClick={handlePrevious}>Previous</button>
                                <button className="continue-button-welcome-page" onClick={() => window.location.href = '/planner'}>Get Started</button>
                            </section>
                        </main>
                    </div>
                )}
            </div>
            <div className="pagination-dots">
                {[1, 2, 3].map((step) => (
                    <span key={step} className={`dot ${currentStep === step ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
};

export default Welcome;
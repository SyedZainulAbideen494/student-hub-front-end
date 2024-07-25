import React from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-page">
      <header className="welcome-header-welcome-page">
        <h1>Welcome to Edusify!</h1>
        <p>Your all-in-one study and organization app.</p>
      </header>
      <main className="welcome-content-welcome-page">
        <section className="app-overview-welcome-page">
          <h2>About Edusify</h2>
          <p>
            Edusify helps you manage your study schedule, collaborate with friends,
            take notes, and stay organized with reminders and a Pomodoro timer.
          </p>
        </section>
        <section className="features-welcome-page">
          <h2>Explore Features</h2>
          <div className="feature-cards-welcome-page">
            <div className="feature-card-welcome-page">
              <h3>Study Planner</h3>
              <p>Organize your tasks and get reminders. View your schedule on a calendar.</p>
              <Link to="/planner" className="continue-button-welcome-page">Continue to Study Planner</Link>
            </div>
            <div className="feature-card-welcome-page">
              <h3>Groups</h3>
              <p>Create groups with friends or join public groups to ask questions and share knowledge.</p>
              <Link to="/groups" className="continue-button-welcome-page">Continue to GroupsStudy Planner</Link>
            </div>
            <div className="feature-card-welcome-page">
              <h3>Notes</h3>
              <p>Create and share notes with your groups or via WhatsApp. Keep your study materials organized.</p>
              <Link to="/notes" className="continue-button-welcome-page">Continue to Notes</Link>
            </div>
            <div className="feature-card-welcome-page">
              <h3>Quizzes</h3>
              <p>Create quizzes to test your knowledge or challenge friends. View and share quiz results.</p>
              <Link to="/quiz/home" className="continue-button-welcome-page">Continue to Quizzes</Link>
            </div>
            <div className="feature-card-welcome-page">
              <h3>Calendar</h3>
              <p>Add and manage events such as exams. Stay organized with reminders and notifications.</p>
              <Link to="/calendar" className="continue-button-welcome-page">Continue to Calendar</Link>
            </div>
            <div className="feature-card-welcome-page">
              <h3>Music Player</h3>
              <p>Play music directly through the app to stay focused while studying.</p>
              <Link to="/music" className="continue-button-welcome-page">Continue to Music Player</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Welcome;
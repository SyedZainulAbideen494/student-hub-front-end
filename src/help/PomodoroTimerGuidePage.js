// PomodoroTimerGuidePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const PomodoroTimerGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Pomodoro Timer</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Boost your productivity with the Pomodoro Timer feature!</p>
        </section>
        <section className="blog-content-help-page">
          <h3>Using the Pomodoro Timer</h3>
          <ol>
            <li>
              <strong>Access the Pomodoro Timer:</strong> Click on "Pomodoro Timer" in the navigation bar below to navigate to the Pomodoro Timer page.
            </li>
            <li>
              <strong>Start the Timer:</strong> You will see a timer with a "Start" button. Click this button to begin your Pomodoro session.
              <ul>
                <li>The timer will start counting down your study time. Once the timer reaches zero, it will stop.</li>
                <li>After the study time is complete, you will need to start your break timer.</li>
              </ul>
            </li>
            <li>
              <strong>Adjust Settings:</strong> Below the timer, there is a settings section where you can customize your study and break times in minutes.
            </li>
            <li>
              <strong>View Stats:</strong> The stats section displays your Pomodoro timer statistics, including total study time, break time, number of breaks, and sessions.
            </li>
          </ol>
        </section>
        <section className="blog-tips-help-page">
          <h3>Tips for Effective Use of the Pomodoro Timer</h3>
          <ul>
            <li>Set your study and break times to fit your productivity levels and personal preferences.</li>
            <li>Use the timer to manage your work sessions and breaks effectively, ensuring you maintain focus and avoid burnout.</li>
            <li>Review your stats regularly to track your productivity and adjust your study and break times as needed.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default PomodoroTimerGuidePage;

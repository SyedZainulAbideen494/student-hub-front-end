// CalendarGuidePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const CalendarGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Calendar & Events</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Organize your schedule and manage events with the Calendar feature!</p>
        </section>
        <section className="blog-content-help-page">
          <h3>Using the Calendar Feature</h3>
          <ol>
            <li>
              <strong>Access the Calendar:</strong> Click on "Calendar" in the navigation bar below. This will take you to the Calendar page where you can view and manage your events.
            </li>
            <li>
              <strong>View the Calendar:</strong> The calendar will display the current date and highlight dates with events. You can navigate through months to view past and future events.
            </li>
            <li>
              <strong>Add an Event:</strong> Click the "Add Event" button to open the event creation form. 
              <ul>
                <li>Add a title for your event.</li>
                <li>Select a date on the calendar for the event.</li>
                <li>Click "Add Event" to save it.</li>
              </ul>
            </li>
            <li>
              <strong>View Events for Selected Dates:</strong> Below the add event section, you can see a list of events for the currently selected date on the calendar.
            </li>
            <li>
              <strong>View All Events:</strong> Further below, you will find a section that displays all events you have added. Here, you can edit or delete events as needed.
            </li>
          </ol>
        </section>
        <section className="blog-tips-help-page">
          <h3>Tips for Managing Your Calendar</h3>
          <ul>
            <li>Regularly update your calendar with new events to keep track of important dates and deadlines.</li>
            <li>Use descriptive titles for your events to make it easier to remember what each event is about.</li>
            <li>Review and edit your events frequently to ensure that your schedule is up-to-date.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default CalendarGuidePage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList } from 'react-icons/fa'; // Import icons from react-icons
import axios from 'axios'; // Import axios for API calls
import './homeTodayData.css'; // Import the CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';
import NoContentCardFace from './nocontentcard';
import NoContentCardTask from './nocontentTaskCArd';
import TodayEventsAndTasksTutorial from './TodayEventsAndTasksTutorial';
import StudyNotes from './StudyNotes';

const TodayEventsAndTasks = () => {
    const nav = useNavigate();
    const [events, setEvents] = useState([]); // State for events
    const [tasks, setTasks] = useState([]); // State for tasks
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [viewMode, setViewMode] = useState('today'); // Add state for toggling view mode (today/upcoming)

    useEffect(() => {
        const visited = localStorage.getItem('hasVisitedTodayEventsAndTasks');

        // Check if the user has visited before
        if (visited) {
            setIsFirstVisit(false);
        }
    }, []);

    const handleTutorialComplete = () => {
        setIsFirstVisit(false);
        localStorage.setItem('hasVisitedTodayEventsAndTasks', 'true');
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const todayDate = new Date().toISOString().split('T')[0]; // Today's date

                // Determine the date range based on the viewMode (today/upcoming)
                const dateFilter = viewMode === 'today' ? { due_date: todayDate } : { upcoming: true };

                // Fetch tasks
                const tasksResponse = await axios.post(API_ROUTES.todayTaskHome, dateFilter, {
                    headers: { 'Authorization': token },
                });
                setTasks(tasksResponse.data);

                // Fetch events
                const eventsResponse = await axios.post(API_ROUTES.todayEventHome, dateFilter, {
                    headers: { 'Authorization': token },
                });
                setEvents(eventsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [viewMode]); // Re-fetch data whenever the viewMode changes

    const handleGoToPlanner = () => {
        nav('/planner');
    };

    const handleGoToCalendar = () => {
        nav('/calendar');
    };

    // Toggle between today's view and upcoming view
    const toggleViewMode = () => {
        setViewMode(viewMode === 'today' ? 'upcoming' : 'today');
    };

    const handleGoToWhatsNew = () => {
        nav('/whats-new');
    };

    const handleGoToMonthlyStats = () => {
        nav('/monthly-stats')
    }

    return (
        <div class="home-page-container">
        <div className="today-container__home__page__component">
            {isFirstVisit && <TodayEventsAndTasksTutorial onComplete={handleTutorialComplete} />}
            <div className="Btn-Container__multiple">
  <button className="Btn-Container__whstaNeww_btn" onClick={handleGoToWhatsNew}>
    <span className="text__whstaNeww_btn">What's New</span>
    <span className="icon-Container__whstaNeww_btn">
      <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1.61321" cy="1.61321" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="1.61321" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="5.5566" r="1.5" fill="black"></circle>
        <circle cx="9.85851" cy="5.5566" r="1.5" fill="black"></circle>
        <circle cx="9.85851" cy="9.5" r="1.5" fill="black"></circle>
        <circle cx="13.9811" cy="9.5" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="13.4434" r="1.5" fill="black"></circle>
        <circle cx="9.85851" cy="13.4434" r="1.5" fill="black"></circle>
        <circle cx="1.61321" cy="17.3868" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="17.3868" r="1.5" fill="black"></circle>
      </svg>
    </span>
  </button>

  <button className="Btn-Container__monthlyStats_btn" onClick={handleGoToMonthlyStats}>
    <span className="text__monthlyStats_btn">Monthly Stats</span>
    <span className="icon-Container__monthlyStats_btn">
      <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1.61321" cy="1.61321" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="1.61321" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="5.5566" r="1.5" fill="black"></circle>
        <circle cx="9.85851" cy="5.5566" r="1.5" fill="black"></circle>
        <circle cx="9.85851" cy="9.5" r="1.5" fill="black"></circle>
        <circle cx="13.9811" cy="9.5" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="13.4434" r="1.5" fill="black"></circle>
        <circle cx="9.85851" cy="13.4434" r="1.5" fill="black"></circle>
        <circle cx="1.61321" cy="17.3868" r="1.5" fill="black"></circle>
        <circle cx="5.73583" cy="17.3868" r="1.5" fill="black"></circle>
      </svg>
    </span>
  </button>
</div>

            <StudyNotes/>
            <div className='section__home__page__component'>
                <div className="section-header">
                    <h2>
                        <FaCalendarAlt /> {viewMode === 'today' ? "Today's Events" : 'Upcoming Events'}
                    </h2>
                    <button onClick={toggleViewMode} className='toggle-view-btn__view__type__date'>
                        {viewMode === 'today' ? 'See Upcoming Events' : 'See Today’s Events'}
                    </button>
                </div>
                {events.length > 0 ? (
                    <ul className="event-list__home__page__component">
                        {events.map((event, index) => (
                            <li key={index} className="event-item__home__page__component">
                                <FaCalendarAlt /> {/* Event icon */}
                                <strong>{event.title}</strong> {/* Display event title */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <NoContentCardFace />
                )}
                <button onClick={handleGoToCalendar} className='go-page-home-component-btn'>Go To Calendar</button>
            </div>
            <div className='section__home__page__component'>
                <div className="section-header">
                    <h2>
                        <FaClipboardList /> {viewMode === 'today' ? "Today's Tasks" : 'Upcoming Tasks'}
                    </h2>
                    <button onClick={toggleViewMode} className='toggle-view-btn__view__type__date'>
                        {viewMode === 'today' ? 'See Upcoming Tasks' : 'See Today’s Tasks'}
                    </button>
                </div>
                {tasks.length > 0 ? (
                    <ul className="task-list__home__page__component">
                        {tasks.map((task, index) => (
                            <li key={index} className="task-item__home__page__component">
                                <FaClipboardList /> {/* Task icon */}
                                {task.title} - Priority: {task.priority} {/* Display task title and priority */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <NoContentCardTask />
                )}
                <button onClick={handleGoToPlanner} className='go-page-home-component-btn'>Go To Planner</button>
            </div>
        </div>
        </div>
    );
};

export default TodayEventsAndTasks;

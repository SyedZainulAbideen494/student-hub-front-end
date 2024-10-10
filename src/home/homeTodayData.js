import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList } from 'react-icons/fa'; // Import icons from react-icons
import axios from 'axios'; // Import axios for API calls
import './homeTodayData.css'; // Import the CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';
import NoContentCardFace from './nocontentcard';
import NoContentCardTask from './nocontentTaskCArd';
import TodayEventsAndTasksTutorial from './TodayEventsAndTasksTutorial';

const TodayEventsAndTasks = () => {
    const nav = useNavigate();
    const [events, setEvents] = useState([]); // State for events
    const [tasks, setTasks] = useState([]); // State for tasks
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        const visited = localStorage.getItem('hasVisitedTodayEventsAndTasks');

        // Check if the user has visited before
        if (visited) {
            // If visited, set isFirstVisit to false
            setIsFirstVisit(false);
        }
    }, []);

    // Function to handle the completion of the tutorial
    const handleTutorialComplete = () => {
        setIsFirstVisit(false); // Set the first visit state to false
        localStorage.setItem('hasVisitedTodayEventsAndTasks', 'true'); // Mark as visited in local storage
    };

    

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Get token from local storage
            if (!token) return; // Exit if token is not present

            try {
                const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

                // Fetch today's tasks using POST request
                const tasksResponse = await axios.post(API_ROUTES.todayTaskHome, {
                    due_date: todayDate,
                }, {
                    headers: {
                        'Authorization': token, // Send token in headers
                    },
                });
                setTasks(tasksResponse.data); // Set tasks

                // Fetch today's events using POST request
                const eventsResponse = await axios.post(API_ROUTES.todayEventHome, {
                    event_date: todayDate,
                }, {
                    headers: {
                        'Authorization': token, // Send token in headers
                    },
                });
                setEvents(eventsResponse.data); // Set events
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetchData function
    }, []); // Run only once when the component mounts

    const handleGoToPlanner = () => {
        nav('/planner'); // Replace with your planner route
    };

    const handleGoToCalendar = () => {
        nav('/calendar'); // Replace with your calendar route
    };

    return (
        <div className="today-container__home__page__component">
               {isFirstVisit && <TodayEventsAndTasksTutorial onComplete={handleTutorialComplete} />}
            <div className='section__home__page__component'>
        <div className="section-header">
            <h2><FaCalendarAlt/> Today's Events</h2>
           
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
            <NoContentCardFace/>
        )}
        <button onClick={handleGoToCalendar} className='go-page-home-component-btn'>Go To Calendar</button>
    </div>
    <div className='section__home__page__component'>
        <div className="section-header">
            <h2><FaClipboardList/> Today's Tasks</h2>
           
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
            <NoContentCardTask/>
        )}
            <button onClick={handleGoToPlanner} className='go-page-home-component-btn'>Go To Planner</button>
    </div>
    </div>
    );
};

export default TodayEventsAndTasks;

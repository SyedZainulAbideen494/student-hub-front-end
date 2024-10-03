import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import './homeTopCards.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinBeam } from '@fortawesome/free-solid-svg-icons'; // Import the grin beam icon


const TopBoxes = () => {
    const [todayTasks, setTodayTasks] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate()
    const token = localStorage.getItem('token');

    // Fetch profile data and overview
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    setError('No token found');
                    return;
                }

                // Fetch user profile
                const profileResponse = await axios.post(API_ROUTES.fetchUserProfile, { token });
                setProfile(profileResponse.data);

                // Fetch overview data
                const boxDataResponse = await axios.post(API_ROUTES.userBoxDataHome, { token });
                setTodayTasks(boxDataResponse.data.todayTasks || []);
                setTodayEvents(boxDataResponse.data.todayEvents || []);
                setUpcomingTasks(boxDataResponse.data.upcomingTasks || []);
                setUpcomingEvents(boxDataResponse.data.upcomingEvents || []);
            } catch (err) {
                setError('Error fetching data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // SVG Icons for Events and Tasks
    const eventIcon = (
        <svg className="icon__home__page__component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3M16 7V3M3 12h18m-2 5h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h2m4 0h4" />
        </svg>
    );

    const taskIcon = (
        <svg className="icon__home__page__component" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6m-6-8h6m4 2h2M3 12H1m2 4H1m2-8H1" />
        </svg>
    );

    const handleSettingsClick = () => {
       nav('/settings')
    };
    

    // Render the component
    return (
        <div className="home-container__home__page__component">
<div className="header__home__page__component">
    <div className="welcome-container__home__page__component">
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p className="error-message">{error}</p>
        ) : (
            <>
                <img
                    className="profile-avatar"
                    src={`${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
                    alt="Profile Avatar"
                />
                <p className="welcome-message__home__page__component">
                    Hi, {profile?.unique_id || 'User'}! 
                    <FontAwesomeIcon icon={faGrinBeam} className="welcome-icon__home__page__component" />
                </p>
            </>
        )}
    </div>
    <div className="settings-icon__home__page__component" onClick={handleSettingsClick}>
        <i className="fas fa-cog"></i> {/* Font Awesome settings icon */}
    </div>
</div>
            <p className="subtext__home__page__component">Here's your overview for today</p>

            <div className="top-boxes-container__home__page__component">
    <div className={`box__home__page__component box-1__home__page__component`}>
        {eventIcon}
        <p className="count__home__page__component">
            <CountUp end={todayEvents.length} duration={2} />
        </p>
        <h3 className="title__home__page__component">Today's Events</h3>
    </div>
    <div className={`box__home__page__component box-2__home__page__component`}>
        {taskIcon}
        <p className="count__home__page__component">
            <CountUp end={todayTasks.length} duration={2} />
        </p>
        <h3 className="title__home__page__component">Today's Tasks</h3>
    </div>
    <div className={`box__home__page__component box-3__home__page__component`}>
        {taskIcon}
        <p className="count__home__page__component">
            <CountUp end={upcomingTasks.length} duration={2} />
        </p>
        <h3 className="title__home__page__component">Upcoming Tasks</h3>
    </div>
    <div className={`box__home__page__component box-4__home__page__component`}>
        {eventIcon}
        <p className="count__home__page__component">
            <CountUp end={upcomingEvents.length} duration={2} />
        </p>
        <h3 className="title__home__page__component">Upcoming Events</h3>
    </div>
</div>
        </div>
    );
};

export default TopBoxes;

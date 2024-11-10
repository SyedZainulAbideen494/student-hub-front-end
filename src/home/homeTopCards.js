import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import './homeTopCards.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faGrinBeam, faTrophy } from '@fortawesome/free-solid-svg-icons'; // Import the grin beam icon
import { TypeAnimation } from 'react-type-animation';

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
    const location = useLocation();
   
    
    useEffect(() => {
        const validateToken = async () => {
          const token = localStorage.getItem('token');
          console.log('Token from local storage:', token); // Debugging
    
          // If no token, redirect to login
          if (!token) {
            console.log('No token found, redirecting to sign-up.');
            nav('/sign-up');
            return;
          }
    
          try {
            const response = await axios.post(API_ROUTES.userSessionAut, { token });
            console.log('Token validation response:', response.data); // Debugging
            if (!response.data.valid) {
              console.log('Invalid token, redirecting to sign-up.');
              nav('/sign-up');
            }
          } catch (error) {
            console.error('Error during token validation:', error);
            nav('/sign-up');
          }
        };
    
        // Delay the validation by 5 seconds
        const timeoutId = setTimeout(() => {
          validateToken();
        }, 500);
    
        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId);
    }, [nav]);


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
                    <TypeAnimation
                        sequence={[
                            `Hi, ${profile?.unique_id || 'User'}!`,
                            2000 // Pause for 2 seconds
                        ]}
                        speed={50} // Typing speed in milliseconds
                        repeat={0} // Number of times to repeat; 0 means no repeat
                        wrapper="span"
                        cursor={false} // Hide the typing cursor
                    />

                </p>
                <div className="icons-container__home__page__component">
  {/* Leaderboard icon */}
  <Link to='/streaks' className="leaderboard-icon__home__page__component">
    <FontAwesomeIcon icon={faFire} size="lg" />
    <p>Streaks</p>
  </Link>
</div>

            </>
        )}
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

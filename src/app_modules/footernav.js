import React, { useState, useEffect } from 'react';
import { FaUsers, FaFlask, FaCalculator, FaStickyNote, FaCalendarAlt, FaBars, FaSignOutAlt, FaClock, FaMusic, FaStream, FaUser, FaSearch, FaGem, FaQuestionCircle, FaTrophy, FaBook, FaToolbox, FaFolder, FaGlobe } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md'; // Material Dashboard icon
import { HiBookOpen } from 'react-icons/hi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GiMaterialsScience } from 'react-icons/gi'; 
import { MdBusiness, MdNote } from 'react-icons/md'; 
import './footer-nav.css';
import axios from 'axios';
import { API_ROUTES } from './apiRoutes';

const FooterNav = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
                setProfile(data);
            } catch (err) {
                setError('Error fetching profile data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const hasProfileIssues = profile && (!profile.user_name || !profile.bio);


    const SparkleIcon = () => (
        <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>

    );


    return (
        <div className="footer-nav">
            {/* Primary Buttons */}
            <Link to='/' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/' ? 'active' : ''}`}>
                    <MdDashboard  className="icon-footer-nav" />
                    <span className="btn-label">Dashboard</span>
                </button>
            </Link>

            <Link to='/ai' style={{ textDecoration: 'none' }}>
    <button className={`nav-btn-footer-nav ${location.pathname === '/ai' ? 'active' : ''}`}>
        <SparkleIcon className="icon-footer-nav" />
        <span className="btn-label">AI</span>
    </button>
</Link>
<Link to='/planner' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/planner' ? 'active' : ''}`}>
                    <HiBookOpen className="icon-footer-nav" />
                    <span className="btn-label">Planner</span>
                </button>
            </Link>
            <button className={`nav-btn-footer-nav ${isPopupVisible ? 'active' : ''}`} onClick={togglePopup}>
                <FaBars className="icon-footer-nav" />
                <span className="btn-label">More{hasProfileIssues && <span className="issue-icon">!</span>}</span>
            </button>
            <div className={`popup-menu-footer-nav ${isPopupVisible ? 'show-footer-nav' : ''}`}>
                {/* Popup Buttons */}
               
                <Link to='/leaderboard' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/leaderboard' ? 'active' : ''}`}>
                        <FaTrophy className="icon-footer-nav" />
                        <span className="btn-label">leaderboard</span>
                    </button>
                </Link>
                <Link to='/notes/view' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/notes/view' ? 'active' : ''}`}>
                    <FaBook className="icon-footer-nav" />
                    <span className="btn-label">Notes</span>
                    <sapn className='new-label-footer-nav'>New - Generate Quiz and Flashcards from Notes</sapn>
                </button>
            </Link>
            <Link to='/flashcard' style={{ textDecoration: 'none' }}>
    <button className={`nav-btn-footer-nav ${location.pathname === '/flashcard' ? 'active' : ''}`}>
        <FaStickyNote className="icon-footer-nav" />
        <span className="btn-label">Flashcards</span>
        <sapn className='new-label-footer-nav'>New - Generate using PDF and Active recall fetaure</sapn>
    </button>
</Link>



   <Link to='/room' style={{ textDecoration: 'none' }}>
    <button className={`nav-btn-footer-nav ${location.pathname === '/room' ? 'active' : ''}`}>
        <FaUsers className="icon-footer-nav" />
        <span className="btn-label">Rooms</span> {/* Changed label from Groups to Rooms */}
        <span className='new-label-footer-nav'>New! A must-try with friends!</span>
    </button>
</Link> 


          <Link to='/quiz/home' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/quiz/home' ? 'active' : ''}`}>
                        <FaFlask className="icon-footer-nav" />
                        <span className="btn-label">AI Powered Quiz</span>
                        <sapn className='new-label-footer-nav'>New - Generate using PDF</sapn>
                    </button>
                </Link>
                   {/* New Document Locker Link */}
                   <Link to='/document-locker' style={{ textDecoration: 'none' }}>
    <button className={`nav-btn-footer-nav ${location.pathname === '/document-locker' ? 'active' : ''}`}>
        <FaFolder className="icon-footer-nav" /> {/* Changed icon to FaFolder */}
        <span className="btn-label">Document Locker</span>
    </button>
</Link>
                <Link to='/calendar' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/calendar' ? 'active' : ''}`}>
                        <FaCalendarAlt className="icon-footer-nav" />
                        <span className="btn-label">Calendar</span>
                    </button>
                </Link>
                <Link to='/pomodoro' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/pomodoro' ? 'active' : ''}`}>
                        <FaClock className="icon-footer-nav" />
                        <span className="btn-label">Pomodoro</span>
                    </button>
                </Link>

                <Link to='/toolkit' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/toolkit' ? 'active' : ''}`}>
                    <FaToolbox className="icon-footer-nav" />
                    <span className="btn-label">Toolkit</span>
                </button>
            </Link>
                <Link to='/profile' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/profile' ? 'active' : ''}`}>
                        <FaUser className="icon-footer-nav" />
                        <span className="btn-label">Profile{hasProfileIssues && <span className="issue-icon">!</span>}</span>
                         {/* Red icon for profile issues */}
                    </button>
                </Link>
                <Link to='/how-to-use-edusify' style={{ textDecoration: 'none' }}>
    <button className={`nav-btn-footer-nav ${location.pathname === '/guide-to-use-edusify' ? 'active' : ''}`}>
        <FaQuestionCircle className="icon-footer-nav" />
        <span className="btn-label">How To Use Edusify Effectively</span>
    </button>
</Link>

             
                <button className="close-btn-footer-nav" onClick={togglePopup}>×</button>
            </div>
        </div>
    );
};

export default FooterNav;
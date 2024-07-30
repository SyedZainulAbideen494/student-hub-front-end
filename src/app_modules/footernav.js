import React, { useState, useEffect } from 'react';
import { FaUsers, FaFlask, FaStickyNote, FaCalendarAlt, FaBars, FaSignOutAlt, FaClock, FaMusic, FaUser, FaStream } from 'react-icons/fa';
import { HiBookOpen } from 'react-icons/hi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './footer-nav.css';
import axios from 'axios';
import { API_ROUTES } from './apiRoutes';

const FooterNav = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(API_ROUTES.userSessionAut, { token })
                .then(response => {
                    if (!response.data.valid) {
                        navigate('/login');
                    }
                })
                .catch(error => {
                    console.error('Token validation error:', error);
                    navigate('/login');
                });
        }
    }, [navigate]);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="footer-nav">
            <Link to='/planner' style={{textDecoration: 'none'}}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/planner' ? 'active' : ''}`}>
                    <HiBookOpen className="icon-footer-nav" />
                    <span className="btn-label">Planner</span>
                </button>
            </Link>
            <Link to='/groups' style={{textDecoration: 'none'}}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/groups' ? 'active' : ''}`}>
                    <FaUsers className="icon-footer-nav" />
                    <span className="btn-label">Groups</span>
                </button>
            </Link>
            <Link to='/notes' style={{textDecoration: 'none'}}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/notes' ? 'active' : ''}`}>
                    <FaStickyNote className="icon-footer-nav" />
                    <span className="btn-label">Notes</span>
                </button>
            </Link>
            <button className="nav-btn-footer-nav" onClick={togglePopup}>
                <FaBars className="icon-footer-nav" />
                <span className="btn-label">More</span>
            </button>
            <div className={`popup-menu-footer-nav ${isPopupVisible ? 'show-footer-nav' : ''}`}>
                <Link to='/planner' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <HiBookOpen className="icon-footer-nav" />
                        <span className="btn-label">Planner</span>
                    </button>
                </Link>
                <Link to='/groups' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaUsers className="icon-footer-nav" />
                        <span className="btn-label">Groups</span>
                    </button>
                </Link>
                <Link to='/notes' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaStickyNote className="icon-footer-nav" />
                        <span className="btn-label">Notes</span>
                    </button>
                </Link>
                <Link to='/quiz/home' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaFlask className="icon-footer-nav" />
                        <span className="btn-label">Quizzes</span>
                    </button>
                </Link>
                <Link to='/calendar' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaCalendarAlt className="icon-footer-nav" />
                        <span className="btn-label">Calendar</span>
                    </button>
                </Link>
                <Link to='/pomodoro' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaClock className="icon-footer-nav" />
                        <span className="btn-label">Pomodoro</span>
                    </button>
                </Link>
                <Link to='/music' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaMusic className="icon-footer-nav" />
                        <span className="btn-label">Music</span>
                    </button>
                </Link>
                <Link to='/profile' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaUser className="icon-footer-nav" />
                        <span className="btn-label">Profile</span>
                    </button>
                </Link>
                <Link to='/social-feed' style={{textDecoration: 'none'}}>
                    <button className="nav-btn-footer-nav">
                        <FaStream className="icon-footer-nav" />
                        <span className="btn-label">Social Feed</span>
                    </button>
                </Link>
                <button className="nav-btn-footer-nav" onClick={handleLogout}>
                    <FaSignOutAlt className="icon-footer-nav" />
                    <span className="btn-label">Logout</span>
                </button>
                <button className="close-btn-footer-nav" onClick={togglePopup}>×</button>
            </div>
        </div>
    );
};

export default FooterNav;
import React, { useState } from 'react';
import { FaUsers, FaTasks, FaFlask, FaStickyNote, FaQuestionCircle, FaCalendarAlt, FaBars } from 'react-icons/fa';
import { HiBookOpen } from 'react-icons/hi'; // Use this icon for "Study Planner"
import './footer-nav.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const FooterNav = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    return (
        <div className="footer-nav">
            <Link to='/' style={{textDecoration: 'none'}}>
            <button className="nav-btn-footer-nav active-footer-nav">
                <HiBookOpen className="icon-footer-nav" /> {/* Use the new icon */}
                <span className="btn-label">Study Planner</span> {/* Update label */}
            </button>
            </Link>
            <Link to='/groups'>
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
                <button className="nav-btn-footer-nav" onClick={setPopupVisible}>
                    <FaBars className="icon-footer-nav" />
                    <span className="btn-label">More</span>
                </button>
            <div className={`popup-menu-footer-nav ${isPopupVisible ? 'show-footer-nav' : ''}`}>
            <Link to='/' style={{textDecoration: 'none'}}>
                <button className="nav-btn-footer-nav">
                    <HiBookOpen className="icon-footer-nav" /> {/* Use the new icon */}
                    <span className="btn-label">Study Planner</span> {/* Update label */}
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
                <button className="close-btn-footer-nav" onClick={togglePopup}>Close</button>
            </div>
        </div>
    );
};

export default FooterNav;

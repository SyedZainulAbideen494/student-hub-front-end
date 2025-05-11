import React, { useState, useEffect } from 'react';
import {
    FaUsers, FaFlask, FaStickyNote, FaCalendarAlt, FaBars, FaClock, FaUser,
    FaQuestionCircle, FaBook, FaToolbox, FaFolder, FaFileAlt, FaCrown, FaBookReader,
    FaUserGraduate
} from 'react-icons/fa';
import { MdDashboard, MdAssignment } from 'react-icons/md';
import { HiBookOpen } from 'react-icons/hi';
import { FiMap } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './footer-nav.css';
import axios from 'axios';
import { API_ROUTES } from './apiRoutes';

const FooterNav = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isPremium, setIsPremium] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsPremium(false);
            return;
        }

        axios.post(API_ROUTES.fetchUserProfile, { token })
            .then(({ data }) => setProfile(data))
            .catch(() => console.error('Error fetching profile'))
            .finally(() => {
                axios.post(API_ROUTES.checkSubscription, {}, {
                    headers: { 'Authorization': token }
                })
                    .then(response => setIsPremium(response.data.premium))
                    .catch(() => setIsPremium(false));
            });
    }, []);

    const togglePopup = () => setPopupVisible(!isPopupVisible);
    const hasProfileIssues = profile && (!profile.user_name || !profile.bio);

    const LockButton = ({ to, icon, label, locked, isActive, extra = null }) => {
        const content = (
            <button
                className={`nav-btn-footer-nav ${isActive ? 'active' : ''} ${locked ? 'locked' : ''}`}
                onClick={(e) => locked && e.preventDefault()}
            >
                {icon}
                <span className="btn-label">
                    {label} {locked && '🔒'}
                </span>
                {extra}
            </button>
        );
        return locked ? <div style={{ textDecoration: 'none' }}>{content}</div> :
            <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link>;
    };

    return (
        <div className="footer-nav">
            <Link to='/' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/' ? 'active' : ''}`}>
                    <MdDashboard className="icon-footer-nav" />
                    <span className="btn-label">Dashboard</span>
                </button>
            </Link>

            <Link to='/ai/select' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/ai/select' ? 'active' : ''}`}>
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" className="icon-footer-nav">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                    </svg>
                    <span className="btn-label">AI</span>
                </button>
            </Link>

            <Link to='/planner' style={{ textDecoration: 'none' }}>
                <button className={`nav-btn-footer-nav ${location.pathname === '/planner' ? 'active' : ''}`}>
                    <HiBookOpen className="icon-footer-nav" />
                    <span className="btn-label">To-do list</span>
                </button>
            </Link>

            <button className={`nav-btn-footer-nav ${isPopupVisible ? 'active' : ''}`} onClick={togglePopup}>
                <FaBars className="icon-footer-nav" />
                <span className="btn-label">More{hasProfileIssues && <span className="issue-icon">!</span>}</span>
            </button>

            <div className={`popup-menu-footer-nav ${isPopupVisible ? 'show-footer-nav' : ''}`}>
                <LockButton to='/exam-mode' icon={<FaBookReader className="icon-footer-nav" />} label="Exam Mode" locked={!isPremium} isActive={location.pathname === '/exam-mode'} extra={<span className='new-label-footer-nav'>new</span>} />
                <LockButton to='/competive-exam' icon={<FaFileAlt className="icon-footer-nav" />} label="Competitive Exam Mock Quiz" locked={!isPremium} isActive={location.pathname === '/competive-exam'} />

                <Link to='/carrier/flow' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/carrier/flow' ? 'active' : ''}`}>
                        <FaUserGraduate className="icon-footer-nav" />
                        <span className="btn-label">CareerSense</span>
                        <span className='new-label-footer-nav'>new</span>
                    </button>
                </Link>

                <Link to='/resource-finder' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/resource-finder' ? 'active' : ''}`}>
                        <i className="fas fa-search icon-footer-nav"></i>
                        <span className="btn-label">Resources Finder</span>
                    </button>
                </Link>

                <LockButton to='/mindmap/create' icon={<FiMap className="icon-footer-nav" />} label="Mind Maps" locked={!isPremium} isActive={location.pathname === '/mindmap/create'} />

                <Link to='/notes/view' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/notes/view' ? 'active' : ''}`}>
                        <FaBook className="icon-footer-nav" />
                        <span className="btn-label">Notes</span>
                    </button>
                </Link>

                <Link to='/flashcard' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/flashcard' ? 'active' : ''}`}>
                        <FaStickyNote className="icon-footer-nav" />
                        <span className="btn-label">Flashcards</span>
                    </button>
                </Link>

                <Link to='/room' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/room' ? 'active' : ''}`}>
                        <FaUsers className="icon-footer-nav" />
                        <span className="btn-label">Rooms</span>
                    </button>
                </Link>

                <Link to='/quiz/home' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/quiz/home' ? 'active' : ''}`}>
                        <FaFlask className="icon-footer-nav" />
                        <span className="btn-label">AI Quiz</span>
                    </button>
                </Link>

                <Link to='/document-locker' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/document-locker' ? 'active' : ''}`}>
                        <FaFolder className="icon-footer-nav" />
                        <span className="btn-label">Locker</span>
                    </button>
                </Link>

                <LockButton to='/assignment-maker' icon={<MdAssignment className="icon-footer-nav" />} label="Assignment Maker" locked={!isPremium} isActive={location.pathname === '/assignment-maker'} />

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
                    </button>
                </Link>

                <Link to='/help' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/help' ? 'active' : ''}`}>
                        <FaQuestionCircle className="icon-footer-nav" />
                        <span className="btn-label">Help</span>
                    </button>
                </Link>

                <LockButton to='/user/report' icon={<FaFileAlt className="icon-footer-nav" />} label="AI Report" locked={!isPremium} isActive={location.pathname === '/user/report'} />

                <Link to='/subscription' style={{ textDecoration: 'none' }}>
                    <button className={`nav-btn-footer-nav ${location.pathname === '/subscription' ? 'active' : ''}`}>
                        <FaCrown className="icon-footer-nav" />
                        <span className="btn-label">Premium</span>
                    </button>
                </Link>

                <button className="close-btn-footer-nav" onClick={togglePopup}>×</button>
            </div>
        </div>
    );
};

export default FooterNav;

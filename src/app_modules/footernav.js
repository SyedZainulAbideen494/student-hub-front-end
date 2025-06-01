import React, { useState, useEffect } from 'react';
import {
    FaUsers, FaFlask, FaStickyNote, FaCalendarAlt, FaBars, FaClock, FaUser,
    FaQuestionCircle, FaBook, FaToolbox, FaFolder, FaFileAlt, FaCrown, FaBookReader,
    FaUserGraduate, FaChartBar, FaMicrophone
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

    const NavButton = ({ to, icon, label, isActive, extra = null }) => (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <button className={`nav-btn-footer-nav ${isActive ? 'active' : ''}`}>
                {icon}
                <span className="btn-label">{label}</span>
                {extra}
            </button>
        </Link>
    );

    return (
        <div className="footer-nav">
            <NavButton
                to="/"
                icon={<MdDashboard className="icon-footer-nav" />}
                label="Dashboard"
                isActive={location.pathname === '/'}
            />

            <NavButton
                to="/ai/select"
                icon={
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" className="icon-footer-nav">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                    </svg>
                }
                label="AI"
                isActive={location.pathname === '/ai/select'}
            />

            <NavButton
                to="/planner"
                icon={<HiBookOpen className="icon-footer-nav" />}
                label="To-do list"
                isActive={location.pathname === '/planner'}
            />

            <button
                className={`nav-btn-footer-nav ${isPopupVisible ? 'active' : ''}`}
                onClick={togglePopup}
            >
                <FaBars className="icon-footer-nav" />
                <span className="btn-label">More{hasProfileIssues && <span className="issue-icon">!</span>}</span>
            </button>

            <div className={`popup-menu-footer-nav ${isPopupVisible ? 'show-footer-nav' : ''}`}>
                <NavButton to='/exam-mode' icon={<FaBookReader className="icon-footer-nav" />} label="Exam Mode" isActive={location.pathname === '/exam-mode'} />
                <NavButton to='/competive-exam' icon={<FaFileAlt className="icon-footer-nav" />} label="Competitive Exam Mock Quiz" isActive={location.pathname === '/competive-exam'} />
                <NavButton to='/carrier/flow' icon={<FaUserGraduate className="icon-footer-nav" />} label="CareerSense" isActive={location.pathname === '/carrier/flow'} />
                <NavButton to='/resource-finder' icon={<i className="fas fa-search icon-footer-nav"></i>} label="Resources Finder" isActive={location.pathname === '/resource-finder'} />
                <NavButton to='/mindmap/create' icon={<FiMap className="icon-footer-nav" />} label="AI Mind Maps" isActive={location.pathname === '/mindmap/create'} />
                <NavButton to='/notes/view' icon={<FaBook className="icon-footer-nav" />} label="Notes" isActive={location.pathname === '/notes/view'} />
                <NavButton to='/flashcard' icon={<FaStickyNote className="icon-footer-nav" />} label="Flashcards" isActive={location.pathname === '/flashcard'} />
                <NavButton to='/room' icon={<FaUsers className="icon-footer-nav" />} label="Rooms" isActive={location.pathname === '/room'} />
                <NavButton to='/quiz/home' icon={<FaFlask className="icon-footer-nav" />} label="AI Quiz" isActive={location.pathname === '/quiz/home'} />
                <NavButton to='/lecture-recorder' icon={<FaMicrophone className="icon-footer-nav" />} label="Lecture AI" isActive={location.pathname === '/lecture-recorder'} />
                <NavButton to='/assignment-maker' icon={<MdAssignment className="icon-footer-nav" />} label="Assignment Maker" isActive={location.pathname === '/assignment-maker'} />
                <NavButton to='/calendar' icon={<FaCalendarAlt className="icon-footer-nav" />} label="Calendar" isActive={location.pathname === '/calendar'} />
                <NavButton to='/pomodoro' icon={<FaClock className="icon-footer-nav" />} label="Pomodoro" isActive={location.pathname === '/pomodoro'} />
                <NavButton to='/toolkit' icon={<FaToolbox className="icon-footer-nav" />} label="Toolkit" isActive={location.pathname === '/toolkit'} />
                <NavButton to='/profile' icon={<FaUser className="icon-footer-nav" />} label={`Profile${hasProfileIssues ? '!' : ''}`} isActive={location.pathname === '/profile'} />
                <NavButton to='/help' icon={<FaQuestionCircle className="icon-footer-nav" />} label="Help" isActive={location.pathname === '/help'} />
                <NavButton to='/user/report' icon={<FaFileAlt className="icon-footer-nav" />} label="AI Report" isActive={location.pathname === '/user/report'} />

                {isPremium ? (
                    <NavButton to="/monthly-stats" icon={<FaChartBar className="icon-footer-nav" />} label="Monthly Stats" isActive={location.pathname === '/monthly-stats'} />
                ) : (
                    <NavButton
    to="/subscription"
    icon={<FaCrown className="icon-footer-nav" style={{ color: 'gold' }} />}
    label="Edusify Pro"
    isActive={location.pathname === '/subscription'}
/>

                )}

                <button className="close-btn-footer-nav" onClick={togglePopup}>×</button>
            </div>
        </div>
    );
};

export default FooterNav;

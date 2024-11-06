import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MonthlyStats.css'; // Import the CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaTasks, FaClipboardList, FaTrophy, FaStopwatch, FaRegStar, FaRobot, FaSignInAlt, FaAngleLeft, FaQuestionCircle } from 'react-icons/fa'; // Import icons from FontAwesome
import LoadingSpinner from '../app_modules/LoadingSpinner';
import { useSpring, animated } from 'react-spring';

const MonthlyStats = () => {
    const [stats, setStats] = useState({
        totalCompletedTasks: 0,
        totalPendingTasks: 0,
        pomodoroSessions: 0,
        averageQuizScore: 0,
        quizzesAttended: 0,
        aiInteractions: 0,
        dailyLogins: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, config: { tension: 170, friction: 26 } });

    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                API_ROUTES.getMonthlystats,
                { token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setStats(response.data);
        } catch (err) {
            setError('Error fetching stats: ' + err.message);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const getCurrentMonth = () => {
        const date = new Date();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[date.getMonth()];
    };

    // Handle click to show the modal
    const handleQuestionClick = () => {
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 4000); // Hide the modal after 4 seconds
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p>{error}</p>;

    return (
        <div className="monthly__stats-container">
            <div className="monthly__stats-header">
                <button onClick={() => window.history.back()} className="monthly__stats-back-button">
                    <FaAngleLeft />
                </button>
                <h2 className="monthly__stats-page-title">My Monthly Summary</h2>
                <span className="question-icon__stats-stat" onClick={handleQuestionClick}>
                            <FaQuestionCircle />
                        </span>
            </div>

            {/* Animated Sections */}
            <animated.div style={fadeIn}>
                {/* Task Completion Stats */}
                <div className="monthly__stats-section">
                    <h3 className="monthly__stats-section-header">
                        <FaTasks className="monthly__stats-icon" /> Task Completion
                    </h3>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">Total Tasks Completed</span>
                        <span className="monthly__stats-stat-value">{stats.totalCompletedTasks}</span>
                    </div>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">Pending Tasks</span>
                        <span className="monthly__stats-stat-value">{stats.totalPendingTasks}</span>
                    </div>
                </div>

                {/* Learning and Activity Stats */}
                <div className="monthly__stats-section">
                    <h3 className="monthly__stats-section-header">
                        <FaClipboardList className="monthly__stats-icon" /> Learning & Activity
                    </h3>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">Quizzes Taken</span>
                        <span className="monthly__stats-stat-value">{stats.quizzesAttended}</span>
                    </div>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">Average Quiz Score</span>
                        <span className="monthly__stats-stat-value">{stats.averageQuizScore.toFixed(2)}</span>
                    </div>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">Pomodoro Sessions</span>
                        <span className="monthly__stats-stat-value">{stats.pomodoroSessions}</span>
                    </div>
                </div>

                {/* Engagement Metrics */}
                <div className="monthly__stats-section">
                    <h3 className="monthly__stats-section-header">
                        <FaTrophy className="monthly__stats-icon" /> Engagement
                    </h3>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">Daily Logins</span>
                        <span className="monthly__stats-stat-value">{stats.dailyLogins} days</span>
                    </div>
                    <div className="monthly__stats-stat-box">
                        <span className="monthly__stats-stat-label">AI Interactions</span>
                        <span className="monthly__stats-stat-value">{stats.aiInteractions}</span>
                    </div>
                </div>
            </animated.div>

            {/* Modal */}
            {modalVisible && (
                <div className="stats-modal__stats-stat">
                    <p>These stats represent your performance for {getCurrentMonth()}.</p>
                </div>
            )}
        </div>
    );
};

export default MonthlyStats;

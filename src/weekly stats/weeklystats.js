// WeeklyStats.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MonthlyStats = () => {
    const [stats, setStats] = useState({
        totalCompletedTasks: 0,
        totalPendingTasks: 0,
        pomodoroSessions: 0,
        averageQuizScore: 0,
        quizzesAttended: 0,
        aiInteractions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        const token = localStorage.getItem('token');
        console.log("Token before request:", token); // Debug log
    
        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }
        
        try {
            const response = await axios.post(
                'http://localhost:8080/api/stats/monthly',
                { token }, // Send the token in the request body
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setStats(response.data);
        } catch (err) {
            setError('Error fetching stats: ' + err.message);
            console.error("Fetch error:", err); // Log the error for debugging
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ display: 'inline', marginRight: '10px' }}>My Stats for This Month</h2>
            <button onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>
                ← Back
            </button>
            <div style={{ marginTop: '20px' }}>
                <h3>Task Completion Stats</h3>
                <div>
                    <strong>Total Tasks Completed:</strong> {stats.totalCompletedTasks}
                </div>
                <div>
                    <strong>Pending Tasks:</strong> {stats.totalPendingTasks}
                </div>
                <h3>Pomodoro Sessions</h3>
                <div>
                    <strong>Total Sessions:</strong> {stats.pomodoroSessions}
                </div>
                <h3>Quizzes Stats</h3>
                <div>
                    <strong>Average Score:</strong> {stats.averageQuizScore.toFixed(2)}
                </div>
                <div>
                    <strong>Quizzes Attended:</strong> {stats.quizzesAttended}
                </div>
                <h3>AI Interactions</h3>
                <div>
                    <strong>Total Interactions:</strong> {stats.aiInteractions}
                </div>
            </div>
        </div>
    );
};

export default MonthlyStats;

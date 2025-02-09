import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SessionStats.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import arrow icon for the back button
import { format } from 'date-fns'; // Import format from date-fns
import { API_ROUTES } from '../../app_modules/apiRoutes';

const formatDuration = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  
  let formattedDuration = '';
  if (hours > 0) {
    formattedDuration += `${hours} hour${hours > 1 ? 's' : ''} `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''} `;
  }
  if (seconds > 0) {
    formattedDuration += `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
  return formattedDuration || '0 seconds';
};

const SessionStatsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(API_ROUTES.pomodoroStatsFetch, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSessions(response.data);
        calculateTotalTime(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error.response?.data?.message || error.message);
      }
    };

    if (token) {
      fetchSessions();
    } else {
      console.log('No token available');
    }
  }, [token]);

  const calculateTotalTime = (sessions) => {
    let studyTime = 0;
    let breakTime = 0;
    sessions.forEach((session) => {
      if (session.session_type === 'study') {
        studyTime += session.duration;
      } else {
        breakTime += session.duration;
      }
    });
    setTotalStudyTime(studyTime);
    setTotalBreakTime(breakTime);
  };

  return (
    <div className="session-stats__pomodoro__stats__page">
      
      {/* Header with Back Button */}
      <div className="header__pomodoro__stats__page">
        <button className="back-button__pomodoro__stats__page" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>
      </div>

      <div className="summary__pomodoro__stats__page">
        <h3><i className="fas fa-chart-line"></i> Your Pomodoro Session Stats</h3>
        <div className="summary-stats__pomodoro__stats__page">
          <div className="total-time__pomodoro__stats__page">
            <h2><i className="fas fa-clock"></i> Total Session Time</h2>
            <p><i className="fas fa-pencil-alt"></i> Study: {formatDuration(totalStudyTime)}</p>
            <p><i className="fas fa-coffee"></i> Break: {formatDuration(totalBreakTime)}</p>
            <div className="annotation__total-time">
              <span className="tooltip">This shows the total time spent on study and break sessions.</span>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '60px', textAlign: 'center' }}><i className="fas fa-calendar-alt"></i> All Sessions</h3>
      <div className="session-details__pomodoro__stats__page">
        {sessions.length > 0 ? (
          <ul>
            {sessions.map((session) => (
              <li key={session.id} className={`session-card__pomodoro__stats__page ${session.session_type}`}>
                <p><strong><i className="fas fa-play-circle"></i> Started at:</strong> {format(new Date(session.start_time), 'MM/dd/yyyy HH:mm')}</p>
                <p><strong><i className="fas fa-stop-circle"></i> Ended at:</strong> 
                  {session.end_time ? format(new Date(session.end_time), 'MM/dd/yyyy HH:mm') : 'Session ended prematurely — you gave up midway'}
                </p>
                <p><strong><i className="fas fa-clipboard-check"></i> Session Type:</strong> {session.session_type === 'study' ? 'Study' : 'Break'}</p>
                <p><strong><i className="fas fa-clock"></i> Duration:</strong> 
                  {session.end_time ? formatDuration(session.duration) : 'Not Recorded'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions available</p>
        )}
      </div>
    </div>
  );
};

export default SessionStatsPage;

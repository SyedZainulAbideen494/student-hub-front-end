import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import './TodayProgress.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const TodayProgressAiOverView = ({ selectedDay }) => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [pomodoroDuration, setPomodoroDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.getStudyPlan, { token }, {
          headers: { 'Content-Type': 'application/json' }
        });
        setStudyPlan(response.data.data.study_plan);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    const fetchPomodoroData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.pomodoroStudyPlanData, { token }, {
          headers: { 'Content-Type': 'application/json' }
        });
        setPomodoroDuration(response.data.durationInSeconds);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchStudyPlan();
    fetchPomodoroData();
  }, []);

  if (loading) return null;

  const todaySchedule = studyPlan?.weekly_timetable?.find((day) => day.day.toLowerCase() === selectedDay.toLowerCase());

  const pomodoroHours = pomodoroDuration ? pomodoroDuration / 3600 : 0;
  const studyTimeLeftInMinutes = todaySchedule?.total_study_time ? Math.max((todaySchedule.total_study_time - pomodoroHours) * 60, 0) : 0;
  const studyTimePercentage = todaySchedule?.total_study_time ? Math.max((pomodoroHours / todaySchedule.total_study_time) * 100, 0) : 0;

  return (
    <div className="today-progress-dashboard__container">
      <div className="inline__today-progress-dashboard__container">
        <div className="study-time__today-progress-dashboard--left">
          <p className="study-time-left__today-progress-dashboard--text">{studyTimeLeftInMinutes.toFixed(0)} minutes</p>
          <p className="study-time-left-label__today-progress-dashboard--text"><strong>Study Time Left on {selectedDay}</strong></p>
        </div>

        <div className="pomodoro-progress-circle__today-progress-dashboard--container">
          <CircularProgressbar
            value={studyTimePercentage}
            text={`${studyTimePercentage.toFixed(0)}%`}
            styles={{
              path: { stroke: '#11111', strokeLinecap: 'round', strokeWidth: 8 },
              trail: { stroke: '#121212' },
              text: { fill: '#333', fontSize: '16px', fontWeight: 'bold' },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TodayProgressAiOverView;

import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './TodayProgress.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const TodayProgress = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [pomodoroDuration, setPomodoroDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasksToday, setTasksToday] = useState([]);
  const [tasksOverall, setTasksOverall] = useState([]);
  const [animatedStudyPercent, setAnimatedStudyPercent] = useState(0);

  const navigate = useNavigate();

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStudyPlan = async () => {
      try {
        const res = await axios.post(
          API_ROUTES.getStudyPlan,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setStudyPlan(res.data?.data?.study_plan || null);
      } catch {
        setStudyPlan(null);
      }
    };

    const fetchPomodoroData = async () => {
      try {
        const res = await axios.post(
          API_ROUTES.pomodoroStudyPlanData,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setPomodoroDuration(res.data?.durationInSeconds || 0);
      } catch {
        setPomodoroDuration(0);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.post(
          API_ROUTES.getStudyPlanTaskData,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setTasksToday(res.data?.today || []);
        setTasksOverall(res.data?.all || []);
      } catch {
        setTasksToday([]);
        setTasksOverall([]);
      }
    };

    Promise.all([
      fetchStudyPlan(),
      fetchPomodoroData(),
      fetchTasks()
    ]).finally(() => setLoading(false));
  }, []);

  /* ---------------- TIME CALCULATIONS ---------------- */
  const today = moment.utc().local().format('dddd');

  const todaySchedule = studyPlan?.weekly_timetable?.find(
    (day) => day.day.toLowerCase() === today.toLowerCase()
  );

  const pomodoroHours = pomodoroDuration ? pomodoroDuration / 3600 : 0;

  const studyTimeLeftInMinutes =
    todaySchedule?.total_study_time
      ? Math.max((todaySchedule.total_study_time - pomodoroHours) * 60, 0)
      : 0;

  const studyTimePercentage =
    todaySchedule?.total_study_time
      ? Math.min((pomodoroHours / todaySchedule.total_study_time) * 100, 100)
      : 0;

  /* ---------------- SMOOTH ANIMATION ---------------- */
  useEffect(() => {
    if (loading || studyTimePercentage <= 0) {
      setAnimatedStudyPercent(0);
      return;
    }

    let start = 0;
    const end = studyTimePercentage;
    const duration = 900;
    const step = 16;
    const increment = end / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedStudyPercent(end);
        clearInterval(timer);
      } else {
        setAnimatedStudyPercent(start);
      }
    }, step);

    return () => clearInterval(timer);
  }, [studyTimePercentage, loading]);

  /* ---------------- TASK CALCULATIONS ---------------- */
  const completedTasksToday = tasksToday.filter(t => t.completed).length;
  const completedTasksOverall = tasksOverall.filter(t => t.completed).length;

  const taskCompletionTodayPercentage =
    tasksToday.length > 0
      ? (completedTasksToday / tasksToday.length) * 100
      : 0;

  const taskCompletionOverallPercentage =
    tasksOverall.length > 0
      ? (completedTasksOverall / tasksOverall.length) * 100
      : 0;

  /* ---------------- ACTION ---------------- */
  const handleButtonClick = () => {
    navigate(studyPlan ? '/my-ai-plan' : '/flow-user-data');
  };

  const todayPlan = todaySchedule || { subjects: [], hours_allocation: [] };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <div className="today-progress-dashboard__container">
        <div className="inline__today-progress-dashboard__container">
          <div className="study-time__today-progress-dashboard--left">
            <p className="study-time-left__today-progress-dashboard--text">
              {studyTimeLeftInMinutes.toFixed(0)} minutes
            </p>
            <p className="study-time-left-label__today-progress-dashboard--text">
              <strong>Study Time Left Today</strong>
            </p>
          </div>

          <div className="pomodoro-progress-circle__today-progress-dashboard--container">
            <CircularProgressbar
              value={animatedStudyPercent}
              text={`${animatedStudyPercent.toFixed(0)}%`}
              styles={{
                path: {
                  stroke: '#6A93FF',
                  strokeLinecap: 'round',
                  strokeWidth: 8,
                },
                trail: { stroke: '#121212' },
                text: {
                  fill: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '700',
                },
              }}
            />
          </div>
        </div>

        {!loading && (
          <div className="view-plan-btn__today-progress-dashboard--container">
            <button
              className="view-plan-btn__today-progress-dashboard"
              onClick={handleButtonClick}
            >
              {studyPlan ? "View Today's Plan" : "Get Plan"}
            </button>
          </div>
        )}
      </div>

      <div className="dashboard__today__progress__container">
        <div className="dashboard__today__progress__row">
          <div className="dashboard__today__progress__card">
            <h3>Today's Tasks</h3>
            <CircularProgressbar
              value={taskCompletionTodayPercentage}
              text={`${taskCompletionTodayPercentage.toFixed(0)}%`}
            />
          </div>

          <div className="dashboard__today__progress__card">
            <h3>Overall Tasks</h3>
            <CircularProgressbar
              value={taskCompletionOverallPercentage}
              text={`${taskCompletionOverallPercentage.toFixed(0)}%`}
            />
          </div>
        </div>

        <div className="dashboard__today__progress__row">
          <div className="dashboard__today__progress__card">
            <h3>Subjects</h3>
            <p>{todayPlan.subjects.join(', ') || 'No subjects planned'}</p>
          </div>

          <div className="dashboard__today__progress__card">
            <h3>Sessions</h3>
            {todayPlan.hours_allocation.length > 0 ? (
              todayPlan.hours_allocation.map((s, i) => (
                <p key={i}>
                  <strong>{s.subject}:</strong> {s.hours * 60} min
                </p>
              ))
            ) : (
              <p>No session times allocated</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayProgress;

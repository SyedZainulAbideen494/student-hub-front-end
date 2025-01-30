import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './TodayProgress.css'; // Import the custom CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';

const TodayProgress = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [pomodoroDuration, setPomodoroDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasksToday, setTasksToday] = useState([]); // For today's tasks
  const [tasksOverall, setTasksOverall] = useState([]); // For overall tasks
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the study plan data from the backend
    const fetchStudyPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.getStudyPlan, { 
          token 
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        setStudyPlan(response.data.data.study_plan);
        setLoading(false);
      } catch (err) {
        setLoading(false); // No error handling needed here, fallback will be used
      }
    };

    // Fetch Pomodoro data for today
    const fetchPomodoroData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.pomodoroStudyPlanData, { 
          token 
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        setPomodoroDuration(response.data.durationInSeconds);
      } catch (err) {
        setLoading(false); // No error handling needed here, fallback will be used
      }
    };

    // Fetch tasks for today and overall
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.getStudyPlanTaskData, { 
          token 
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        setTasksToday(response.data.today); // Assuming `today` returns tasks for today
        setTasksOverall(response.data.all); // Assuming `all` returns overall tasks
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudyPlan();
    fetchPomodoroData();
    fetchTasks();
  }, []);

  // Fallback if no study plan or Pomodoro data
  const today = moment().format('dddd');  // Get today's day name (e.g., Tuesday)
  const todaySchedule = studyPlan?.weekly_timetable?.find((day) => day.day.toLowerCase() === today.toLowerCase());

  const pomodoroHours = pomodoroDuration ? pomodoroDuration / 3600 : 0;

  // Ensure studyTimeLeftInMinutes falls back to 0 if todaySchedule or total_study_time is not available
  const studyTimeLeftInMinutes = todaySchedule && todaySchedule.total_study_time
    ? Math.max((todaySchedule.total_study_time - pomodoroHours) * 60, 0)
    : 0;
  
  // Ensure studyTimePercentage falls back to 0 if todaySchedule or total_study_time is not available
  const studyTimePercentage = todaySchedule && todaySchedule.total_study_time
    ? Math.max((pomodoroHours / todaySchedule.total_study_time) * 100, 0)
    : 0;

  // Calculate task completion percentage for today and overall
  const completedTasksToday = tasksToday.filter(task => task.completed).length;
  const totalTasksToday = tasksToday.length;
  const completedTasksOverall = tasksOverall.filter(task => task.completed).length;
  const totalTasksOverall = tasksOverall.length;

  const taskCompletionTodayPercentage = totalTasksToday > 0 ? (completedTasksToday / totalTasksToday) * 100 : 0;
  const taskCompletionOverallPercentage = totalTasksOverall > 0 ? (completedTasksOverall / totalTasksOverall) * 100 : 0;

  const handleButtonClick = () => {
    // Navigate to the appropriate page based on whether there's a study plan
    if (studyPlan) {
      navigate('/my-ai-plan'); // View Today's Plan
    } else {
      navigate('/flow-user-data'); // Get Plan
    }
  };

  // Fallback for missing subjects or session times
  const todayPlan = todaySchedule || { subjects: [], hours_allocation: [] };

  return (
    <div>
      <div className="today-progress-dashboard__container">
        <div className="inline__today-progress-dashboard__container">
          <div className="study-time__today-progress-dashboard--left">
            <p className="study-time-left__today-progress-dashboard--text">{studyTimeLeftInMinutes.toFixed(0)} minutes</p>
            <p className="study-time-left-label__today-progress-dashboard--text"><strong>Study Time Left Today</strong></p>
          </div>

          {/* Pomodoro Progress Circle on the right */}
          <div className="pomodoro-progress-circle__today-progress-dashboard--container">
            <CircularProgressbar
              value={studyTimePercentage}  // Set the percentage value here, default to 0%
              text={`${studyTimePercentage.toFixed(0)}%`}  // Display percentage in the circle
              styles={{
                path: {
                  stroke: '#000000',  // Change to a minimal green color, you can choose any color you like
                  strokeLinecap: 'round',
                  strokeWidth: 8,  // Adjust the stroke width if needed
                },
                trail: {
                  stroke: '#e0e0e0',  // Light gray color for the background circle
                },
                text: {
                  fill: '#333',  // Dark gray color for the text inside the circle
                  fontSize: '16px',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>
        </div>

        {!loading && (
  <div className="view-plan-btn__today-progress-dashboard--container">
    <button className="view-plan-btn__today-progress-dashboard" onClick={handleButtonClick}>
      {studyPlan ? "View Today's Plan" : "Get Plan"}
    </button>
  </div>
)}

      </div>

      <div className="card__today__ai__pan_overview__container">
               {/* Today's Task Completion Card */}
               <div className="card__today__ai__pan_overview">
          <h3>Today's Task</h3>
          <CircularProgressbar
            value={taskCompletionTodayPercentage}
            text={`${taskCompletionTodayPercentage.toFixed(0)}%`}
            styles={{
              path: {
                stroke: '#a2d2ff',
                strokeLinecap: 'round',
                strokeWidth: 8,
              },
              trail: {
                stroke: '#e0e0e0',
              },
              text: {
                fill: '#333',
                fontSize: '16px',
                fontWeight: 'bold',
              },
            }}
          />
        </div>

        {/* Overall Task Completion Card */}
        <div className="card__today__ai__pan_overview">
          <h3>Overall Tasks</h3>
          <CircularProgressbar
            value={taskCompletionOverallPercentage}
            text={`${taskCompletionOverallPercentage.toFixed(0)}%`}
            styles={{
              path: {
                stroke: '#bdb2ff',
                strokeLinecap: 'round',
                strokeWidth: 8,
              },
              trail: {
                stroke: '#e0e0e0',
              },
              text: {
                fill: '#333',
                fontSize: '16px',
                fontWeight: 'bold',
              },
            }}
          />
        </div>
        {/* Subject Card   */}
        <div className="card__today__ai__pan_overview">
          <h3>Subjects</h3>
          <p>{todayPlan.subjects.join(', ') || 'No subjects planned'}</p>
        </div>

        <div className="card__today__ai__pan_overview">
          <h3>Sessions</h3>
          {todayPlan.hours_allocation.length > 0 ? (
            todayPlan.hours_allocation.map((allocation, idx) => (
              <p key={idx}><strong>{allocation.subject}:</strong> {allocation.hours * 60} minutes</p>

            ))
          ) : (
            <p>No session times allocated</p>
          )}
        </div>
      
 
      </div>
    </div>
  );
};

export default TodayProgress;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TodayOverview.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import moment from 'moment';
import TodayProgressAiOverView from './today-progress';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../app_modules/LoadingSpinner';

function TodayAiOverview() {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskError, setTaskError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(moment().format('dddd')); // Default to current day
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.getStudyPlan, { token }, {
          headers: { 'Content-Type': 'application/json' },
        });
        setStudyPlan(response.data.data.study_plan);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch study plan');
        setLoading(false);
      }
    };

    fetchStudyPlan();
  }, []);

  const handleGenerateTasks = async (instructions) => {
    setGenerating(true);
    setTaskError(null);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.generateTasksFromStudyPlan, {
        token,
        AI_task_generation_instructions: instructions, // Send instructions received from button
      });
  
      if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTaskError('No tasks generated.');
      }
    } catch (err) {
      setTaskError('Failed to generate tasks.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDay(day);
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <div>{error}</div>;

  if (!studyPlan) return <div>No study plan found</div>;

  const today = moment().format('dddd');
  const todayPlan = studyPlan.weekly_timetable.find(day => day.day === selectedDay);

  if (!todayPlan) return <div>No study plan available for {selectedDay}.</div>;

  const handleNewPlan = () => {
    navigate('/flow-user-data');
  };

  return (
    <div className="today__ai__pan_overview_container">
      {/* Back Button */}
      <button
        className="back__button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <FaArrowLeft />
      </button>

      {/* Toggle Buttons for Days */}
      <div className="day__Plan__toggle__container">
  {studyPlan.weekly_timetable.map(day => (
    <button
      key={day.day}
      className={`day__Plan__toggle__btn ${selectedDay === day.day ? 'active' : ''}`}
      onClick={() => setSelectedDay(day.day)}
    >
      {day.day}
    </button>
  ))}
</div>


      {/* Main Heading */}
      <h2>Today's Study Plan</h2>

      <TodayProgressAiOverView />

      {/* Card Container */}
      <div className="card__today__ai__pan_overview__container">
        {/* Subject Card */}
        <div className="card__today__ai__pan_overview">
          <h3>Subjects</h3>
          <p>{todayPlan.subjects.join(', ')}</p>
        </div>

        {/* Session Time Card */}
        <div className="card__today__ai__pan_overview">
          <h3>Session Time</h3>
          {todayPlan.hours_allocation.map((allocation, idx) => (
           <p key={idx}>
           <strong>{allocation.subject}:</strong> {allocation.hours * 60} minutes
         </p>
         
          ))}
        </div>
      </div>

      <div className="card__today__ai__pan_overview__container">
        {/* Total Study Time Card */}
        <div className="card__today__ai__pan_overview">
          <h3>Total Study Time</h3>
          <p>{todayPlan.total_study_time * 60} minutes</p>
        </div>

        {/* Tips Card */}
        <div className="card__today__ai__pan_overview">
          <h3>Tips</h3>
          <p>{todayPlan.tips}</p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bottom__buttons__today__ai__pan_overview">
        <button
          className="action__button__today__ai__pan_overview"
          onClick={handleNewPlan}
        >
          Get New Plan
        </button>
        {/* Uncomment to enable task generation button */}
        {/* <button
          className="action__button__today__ai__pan_overview"
          onClick={() => handleGenerateTasks(todayPlan.AI_task_generation_instructions)}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate Tasks'}
        </button> */}

        {taskError && <p className="error">{taskError}</p>}
        {tasks.length > 0 && (
          <div className="tasks__list__plan__ai__tasks__generated">
            <h3 className="tasks__list__header__plan__ai__tasks__generated">Tasks</h3>
            <ul className="tasks__list__items__plan__ai__tasks__generated">
              {tasks.map((task, idx) => (
                <li key={idx} className="task__item__plan__ai__tasks__generated">
                  <strong className="task__title__plan__ai__tasks__generated">{task.title}</strong>: 
                  <span className="task__description__plan__ai__tasks__generated">{task.description}</span> 
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodayAiOverview;

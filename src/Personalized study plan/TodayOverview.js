import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodayOverview.css';
import axios from 'axios';
import moment from 'moment';
import TodayProgressAiOverView from './today-progress';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const DayToggleButtons = ({ days, selectedDay, onSelectDay }) => (
  <div className="day__Plan__toggle__container">
    {days.map(day => (
      <button
        key={day.day}
        className={`day__Plan__toggle__btn ${selectedDay === day.day ? 'active' : ''}`}
        onClick={() => onSelectDay(day.day)}
      >
        {day.day}
      </button>
    ))}
  </div>
);

const StudyPlanCard = ({ title, content }) => (
  <div className="card__today__ai__pan_overview">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const TaskList = ({ tasks }) => (
  <div className="tasks__list__plan__ai__tasks__generated">
    <h3 className="tasks__list__header__plan__ai__tasks__generated">Tasks</h3>
    <ul className="tasks__list__items__plan__ai__tasks__generated">
      {tasks.map((task, idx) => (
        <li key={idx} className="task__item__plan__ai__tasks__generated">
          <strong>{task.title}:</strong> 
          <span>{task.description}</span>
        </li>
      ))}
    </ul>
  </div>
);

function TodayAiOverview() {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskError, setTaskError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(moment().format('dddd'));
  const [studyPlanDateCreated, setStudyPlanDateCreated] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [studyPlanResponse, dateResponse] = await Promise.all([
          axios.post(API_ROUTES.getStudyPlan, { token }, { headers: { 'Content-Type': 'application/json' } }),
          axios.post(API_ROUTES.getStudyPlanCreatedDate, { token }, { headers: { 'Content-Type': 'application/json' } })
        ]);

        setStudyPlan(studyPlanResponse.data.data.study_plan);
        setStudyPlanDateCreated(dateResponse.data.data.created_at);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch study plan');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  const handleGenerateTasks = async (instructions) => {
    setGenerating(true);
    setTaskError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.generateTasksFromStudyPlan, {
        token,
        AI_task_generation_instructions: instructions,
      });

      if (response.data.tasks) {
        setTasks(response.data.tasks);
        setShowModal(true); // Show the modal after tasks are generated
      } else {
        setTaskError('No tasks generated.');
      }
    } catch (err) {
      setTaskError('Failed to generate tasks.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };
  
  const handleNewPlan = () => {
    navigate('/flow-user-data');
  };

  const handleEdit = () => {
    navigate('/study-plan')
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;
  if (!studyPlan) return <div>No study plan found</div>;

  const todayPlan = studyPlan.weekly_timetable.find(day => day.day === selectedDay);
  if (!todayPlan) return <div>No study plan available for {selectedDay}.</div>;

  const isStudyPlanLessThanAMonthOld = moment().diff(moment(studyPlanDateCreated), 'months') < 1;

  return (
    <div className="today__ai__pan_overview_container">
      {/* Back Button */}
      <button className="back__button" onClick={() => navigate(-1)} aria-label="Go back">
        <FaArrowLeft />
      </button>

      {/* Day Toggle */}
      <DayToggleButtons
        days={studyPlan.weekly_timetable}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {/* Main Heading */}
      <h2>Today's Study Plan</h2>

      <TodayProgressAiOverView selectedDay={selectedDay} />

      {/* Cards Section */}
      <div className="card__today__ai__pan_overview__container">
        <StudyPlanCard title="Subjects" content={todayPlan.subjects.join(', ')} />
        <StudyPlanCard
          title="Session Time"
          content={todayPlan.hours_allocation.map((allocation, idx) => (
            <p key={idx}><strong>{allocation.subject}:</strong> {allocation.hours * 60} minutes</p>
          ))}
        />
      </div>

    <div className="card__today__ai__pan_overview__container">
  <StudyPlanCard title="Total Study Time" content={`${todayPlan.total_study_time * 60} minutes`} />

  <div className="locked__tip__container">
    <StudyPlanCard 
      title="Tips" 
      content={
        <div 
          className={`locked__tip__content ${!isPremium ? 'locked' : ''}`}
        >
          {todayPlan.tips}
        </div>
      }
    />
    {!isPremium && <FaLock className="lock-icon__tip" />} {/* Show lock for non-premium */}
  </div>
</div>



      {/* Bottom Buttons */}
      <div className="bottom__buttons__today__ai__pan_overview">
        {isPremium || !isStudyPlanLessThanAMonthOld ? (
          <button className="action__button__today__ai__pan_overview" onClick={handleNewPlan}>
            Get New Plan
          </button>
        ) : (
<button className="action__button__today__ai__pan_overview__locked__premium__" disabled>
  <FaLock className="lock-icon" /> Get New Plan <span>Premium</span>
</button>

        )}

<button 
        className="action__button__today__ai__pan_overview"
        onClick={handleEdit}
        disabled={generating}
      >
        Edit
      </button>
  {/* Task Generation Button */}
    {isPremium ? (
      <button 
        className="action__button__today__ai__pan_overview"
        onClick={() => handleGenerateTasks(todayPlan.AI_task_generation_instructions)}
        disabled={generating}
      >
        {generating ? 'Generating Tasks...' : 'Generate Tasks'}
      </button>
    ) : (
      <button 
        className="action__button__today__ai__pan_overview__locked__premium__"
        disabled
      >
        <FaLock className="lock-icon" /> Generate Tasks <span>Premium</span>
      </button>
    )}



        {taskError && <p className="error">{taskError}</p>}
  {showModal && (
        <div className="tasks__ai_plan__modal__container">
          <div className="tasks__ai_plan__modal__content">
            <h2>Generated Tasks</h2>
            <TaskList tasks={tasks} />
            <button className="got-it__button__tasks__ai_plan__modal" onClick={handleCloseModal}>Got it</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default TodayAiOverview;

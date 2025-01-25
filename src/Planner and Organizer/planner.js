import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './planner_organizer.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import SuccessModal from '../app_modules/SuccessMessage'; // Import the SuccessModal component
import LoadingSpinner from '../app_modules/LoadingSpinner';
import { FaEdit, FaCheck, FaPlus, FaTasks, FaCalendarAlt, FaHighlighter } from 'react-icons/fa'; // Importing icons
import SuccessMessage from '../app_modules/SuccessMessage';
import { useNavigate } from 'react-router-dom';
import InviteFriends from '../help/InviteFriends';
import InvalidPhoneEmail from '../app_modules/InvalidUserModal';
import TipBox from '../Tip box/TipBox';
import FeedbackForm from '../help/FeedbackForm';
import PlannerPageTutorial from './PlannerPageTutorial';


function Planner() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingTask, setEditingTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const formRef = useRef(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const navigate = useNavigate()
    const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility
    const [isGenerating, setIsGenerating] = useState(false);
    const [mainTask, setMainTask] = useState('');
    const [days, setDays] = useState(1);
    const [taskStyle, setTaskStyle] = useState('detailed');
    const [emailReminder, setEmailReminder] = useState(false); // State for email reminder


    useEffect(() => {
        // Check local storage for tutorial completion status
        const completed = localStorage.getItem('plannerPageTutorialComplete');
        if (completed) {
            setShowTutorial(false); // Set showTutorial to false if found
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false); // Hide tutorial when complete
        localStorage.setItem('plannerPageTutorialComplete', 'true'); // Store completion status in local storage
    };


        // Toggle feedback form visibility
        const toggleFeedbackForm = () => {
            setShowFeedbackForm(prev => !prev);
        };
    

    // Format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    // Fetch tasks from API
    const fetchTasks = () => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.fetchTask, { token })
            .then(response => {
                setTasks(response.data);
                setLoading(false); // Stop loading
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
                setLoading(false); // Stop loading even on error
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSaveTask = async () => {
        const token = localStorage.getItem('token');
        const taskData = {
            title,
            description,
            due_date: dueDate,
            priority,
            email_reminder: emailReminder, // Pass the email_reminder value
            token,
        };

        try {
            if (editingTask) {
                // Update existing task
                await axios.post(API_ROUTES.editTask, {
                    id: editingTask.id,
                    ...taskData,
                });

                setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
                showModal('Task updated successfully!');
            } else {
                // Add new task
                const response = await axios.post(API_ROUTES.addTask, taskData);
                setTasks([...tasks, { id: response.data.id, ...taskData }]);
                showModal('Task added successfully! +5 points');
            }

            resetForm();
            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('There was an error with the task operation!', error);
        }
    };


    // Handle task deletion
    const handleDeleteTask = (id) => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.deleteTask, { id, token })
            .then(response => {
                setTasks(tasks.filter(task => task.id !== id));
                showModal('Task completed!');
            })
            .catch(error => {
                console.error('There was an error deleting the task!', error);
            })
            .finally(() => setLoading(false)); // Stop loading
    };

    // Handle date change from calendar
    const onDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = formatDate(date);
        setDueDate(formattedDate);
    };

    // Get tasks for the selected date
    const getTasksForDate = (date) => {
        const formattedDate = formatDate(date);
        const filteredTasks = tasks.filter(task => {
            const taskDate = new Date(task.due_date);
            const taskFormattedDate = formatDate(taskDate);
            return taskFormattedDate === formattedDate;
        });
        return filteredTasks.sort((a, b) => {
            const priorityOrder = { 'Low': 1, 'Normal': 2, 'High': 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    };

    // Get all tasks
    const getAllTasks = () => {
        return tasks.sort((a, b) => {
            const priorityOrder = { 'Low': 1, 'Normal': 2, 'High': 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    };

    // Determine task priority class
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High':
                return 'high-priority';
            case 'Low':
                return 'low-priority';
            case 'Normal':
            default:
                return 'normal-priority';
        }
    };

    // Reset form fields
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setEmailReminder(false);
        setPriority('Normal');
        setEditingTask(null);
    };

    // Show success modal
    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
        }, 3000); // Hide modal after 3 seconds
    };

    // Scroll to the form
    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };




    // Compute statistics
    const today = formatDate(new Date());
    const todayTasks = tasks.filter(task => formatDate(new Date(task.due_date)) === today).length;
    const totalTasks = tasks.length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
    const upcomingTasks = tasks.filter(task => new Date(task.due_date) > new Date()).length;

    const startEditingTask = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        // Format the due date before setting it
        setDueDate(formatDate(new Date(task.due_date)));
        setPriority(task.priority);
        scrollToForm();
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!mainTask || !days) {
          console.error('Please enter a task and a number of days');
          return;
        }
        generateTasks(mainTask, days, taskStyle);
      };
    
      const generateTasks = async (mainTask, days, taskStyle) => {
        setIsGenerating(true);
        try {
          const response = await fetch(API_ROUTES.generateAITasks, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mainTask,
              days,
              taskStyle,
              token: localStorage.getItem('token'),
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to generate tasks');
          }
      
          const data = await response.json();
          setTasks((prevTasks) => [...prevTasks, ...data.tasks]);
          setSuccessMessage('Tasks generated successfully!'); // Set success message
          fetchTasks()
          // Hide success message after 2 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 2000);
        } catch (error) {
          console.error('Error occurred:', error);
        } finally {
          setIsGenerating(false);
        }
      };
      
      
      
    

    return (
        <div className="App-dashboard-planner">
{showTutorial && <PlannerPageTutorial onComplete={handleTutorialComplete} />}
            <h1 className="header-title"><FaCalendarAlt /> Study Planner</h1>
            <div className="top-boxes-container__home__page__component">
    <div className="box__home__page__component box-1__home__page__component">
        <svg className="icon__home__page__component" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="count__home__page__component">{todayTasks}</span>
        <span className="text__planner__data text--1__planner__data">Today's Tasks</span>
    </div>
    <div className="box__home__page__component box-2__home__page__component">
        <svg className="icon__home__page__component" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4V4zm0-2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4z" />
        </svg>
        <span className="count__home__page__component">{totalTasks}</span>
        <span className="text__planner__data text--2__planner__data">Total Tasks</span>
    </div>
    <div className="box__home__page__component box-3__home__page__component">
        <svg className="icon__home__page__component" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 13H5v-2h14v2zm0 5H5v-2h14v2zM5 6h14v2H5V6z" />
        </svg>
        <span className="count__home__page__component">{highPriorityTasks}</span>
        <span className="text__planner__data text--4__planner__data">High Priority</span>
    </div>
    <div className="box__home__page__component box-4__home__page__component">
        <svg className="icon__home__page__component" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
        <span className="count__home__page__component">{upcomingTasks}</span>
        <span className="text__planner__data text--4__planner__data">Upcoming Tasks</span>
    </div>
</div>



            <div className="calendar-container">
                <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    tileClassName={({ date, view }) => {
                        const tasksForDate = getTasksForDate(date);
                        return tasksForDate.length > 0 ? 'react-calendar__tile--has-tasks' : null;
                    }}
                    tileContent={({ date, view }) => view === 'month' && (
                        <div></div>
                    )}
                />
            </div>

            <div className="task-form" ref={formRef}>
                <h2 className="section-title" style={{textAlign: 'center'}}>{editingTask ? <><FaEdit /> Edit Task</> : <><FaPlus /> Add Task</>}</h2>
                <div className="form-group">
                    <label htmlFor="task-title">Title:</label>
                    <input
                        id="task-title"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-description">Description:</label>
                    <textarea
                        id="task-description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="task-due-date">Due Date:</label>
                    <input
                        id="task-due-date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-priority">Priority:</label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-group">
  <label
    style={{ fontSize: '16px', color: '#333' }}
  >
    Email Reminder:
  </label>

  {/* Custom Toggle Switch */}
  <div
    className="email-reminder__planner__toggle__Reminder__btn__container"
    onClick={() => setEmailReminder(!emailReminder)} // Toggle on container click
  >
    <input
      id="email-reminder__planner__toggle__Reminder__btn"
      type="checkbox"
      checked={emailReminder}
      onChange={(e) => setEmailReminder(e.target.checked)} // Toggle state
      className="email-reminder__planner__toggle__Reminder__btn"
    />
    <span className="email-reminder__planner__toggle__Reminder__btn__slider"></span>
  </div>
</div>

                <button onClick={handleSaveTask}>
                    {editingTask ? <><FaEdit /> Update Task</> : <><FaPlus /> Add Task</>}
                </button>
            </div>

            <div className="ai-task-generator__planner__page__ai__gen">
  <div className="form-header__planner__page__ai__gen">
    <h2 className="form-heading__planner__page__ai__gen">
      Generate Tasks Using AI 
    </h2>
  </div>
  
  <form onSubmit={handleGenerate} className="form-container__planner__page__ai__gen">
    <div className="input-group__planner__page__ai__gen">
      <label className="input-label__planner__page__ai__gen">
        Task Description:
        <input
          type="text"
          value={mainTask}
          onChange={(e) => setMainTask(e.target.value)}
          placeholder="E.g., Study for Math test covering chapters 1-3"
          required
          className="input-field__planner__page__ai__gen"
        />
      </label>
      <small className="input-hint__planner__page__ai__gen">
        Be specific. Include the subject, chapters, or details. 
        (e.g., "Study for Math, chapters Integer, Real number" or "Prepare for exams: subjects & chapters.")
      </small>
    </div>

    <div className="input-group__planner__page__ai__gen">
      <label className="input-label__planner__page__ai__gen">
        Days to Complete:
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
          max="10"
          placeholder="Enter number of days"
          className="input-field__planner__page__ai__gen"
          required
        />
      </label>
      <small className="input-hint__planner__page__ai__gen">
        Specify how many days you'll need for this task.
      </small>
    </div>

    <div className="input-group__planner__page__ai__gen">
      <label className="input-label__planner__page__ai__gen">
        <select
          value={taskStyle}
          onChange={(e) => setTaskStyle(e.target.value)}
          className="input-field__planner__page__ai__gen"
        >
          <option value="detailed">Detailed</option>
        </select>
      </label>
    </div>

    <div className="flashcard__set__page__modal-content" style={{ textAlign: 'center' }}>
      <button
        className="flashcard__set__page__modal-generate btn__set__page__buttons"
        type="submit"
        disabled={isGenerating}
      >
        <div className={`sparkle__set__page__buttons ${isGenerating ? 'animating' : ''}`}>
          <svg
            height="24"
            width="24"
            fill="#FFFFFF"
            viewBox="0 0 24 24"
            data-name="Layer 1"
            id="Layer_1"
            className="sparkle__set__page__buttons"
          >
            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
          </svg>
          <span className="text__set__page__buttons">
            {isGenerating ? 'Generating...' : 'Generate'}
          </span>
        </div>
      </button>
    </div>

    {successMessage && (
      <div className="success-message__planner__page__ai__gen">
        {successMessage}
      </div>
    )}
  </form>
</div>


            <div className="task-list">
                <h2 className="section-title" style={{textAlign: 'center'}}><FaCalendarAlt /> Tasks for {formatDate(selectedDate)}</h2>
                <div className="task-container">
                    {getTasksForDate(selectedDate).map(task => (
                        <div key={task.id} className={`task ${getPriorityClass(task.priority)}`}>
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-description" style={{ whiteSpace: 'pre-wrap' }}>{task.description}</p>
                            <p className="task-due-date">Due Date: {formatDate(new Date(task.due_date))}</p>
                            <p className="task-priority">Priority: {task.priority}</p>
                            <button className="Btn__edit__task__planner" onClick={() => {
                                setEditingTask(task);
                                setTitle(task.title);
                                setDescription(task.description);
                                setDueDate(task.due_date);
                                setPriority(task.priority);
                                scrollToForm();
                            }}>Edit 
      <svg className="svg__edit__task__planner" viewBox="0 0 512 512">
        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
    </button>
                            <button onClick={() => handleDeleteTask(task.id)} className='button-edit-dashboard-planner button-dashboard-planner'><FaCheck /> Complete</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="task-list">
                <h2 className="section-title" style={{textAlign: 'center'}}><FaTasks /> All Tasks</h2>
                <div className="task-container">
                    {getAllTasks().map(task => (
                        <div key={task.id} className={`task ${getPriorityClass(task.priority)}`}>
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-description" style={{ whiteSpace: 'pre-wrap' }}>{task.description}</p>
                            <p className="task-due-date">Due Date: {formatDate(new Date(task.due_date))}</p>
                            <p className="task-priority">Priority: {task.priority}</p>
                            <button className="Btn__edit__task__planner" onClick={() => startEditingTask(task)}>Edit 
      <svg className="svg__edit__task__planner" viewBox="0 0 512 512">
        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
    </button>
                            <button onClick={() => handleDeleteTask(task.id)} className='button-edit-dashboard-planner button-dashboard-planner'><FaCheck /> Complete</button>
                        </div>
                    ))}
                </div>
            </div>
           
           
            <FooterNav />
            <InvalidPhoneEmail/>
            {modalVisible && <SuccessMessage message={modalMessage} onClose={() => setModalVisible(false)} />}
        </div>
    );
}

export default Planner;

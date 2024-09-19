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
const navigate = useNavigate()
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
            token
        };
    
        try {
            if (editingTask) {
                // Update existing task
                await axios.post(API_ROUTES.editTask, {
                    id: editingTask.id,
                    ...taskData
                });
    
                setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
                setSuccessMessage('Task updated successfully!');
            } else {
                // Add new task
                const response = await axios.post(API_ROUTES.addTask, taskData);
                setTasks([...tasks, { id: response.data.id, ...taskData }]);
                showModal('Task Added successfully!');
            }
            
            // Reset form and refresh task list
            resetForm();
            setTimeout(() => {
                setSuccessMessage('task Added!'); // Hide message after 3 seconds
            }, 3000);
            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('There was an error with the task operation!', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };
    // Handle task deletion
    const handleDeleteTask = (id) => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.deleteTask, { id, token })
            .then(response => {
                setTasks(tasks.filter(task => task.id !== id));
                showModal('Task deleted successfully!');
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
    useEffect(() => {
        const validateToken = async () => {
          const token = localStorage.getItem('token');
      
          // If no token, redirect to login
          if (!token) {
            navigate('/sign-up');
            return;
          }
      
          try {
            const response = await axios.post(API_ROUTES.userSessionAut, { token });
            if (!response.data.valid) {
              navigate('/sign-up');
            }
          } catch (error) {
            console.error('Error during token validation:', error);
            navigate('/sign-up');
          }
        };
      
        // Delay the validation by 5 seconds
        const timeoutId = setTimeout(() => {
          validateToken();
        }, 500);
      
        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId);
      
      }, [navigate]);



    // Compute statistics
    const today = formatDate(new Date());
    const todayTasks = tasks.filter(task => formatDate(new Date(task.due_date)) === today).length;
    const totalTasks = tasks.length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
    const upcomingTasks = tasks.filter(task => new Date(task.due_date) > new Date()).length;


    return (
        <div className="App-dashboard-planner">
            <h1 className="header-title"><FaCalendarAlt /> Study Planner</h1>
            <div className="card__planner__data">
            <div className="item__planner__data item--1__planner__data">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M7 10l5 5 5-5H7z" fill="rgba(149,149,255,1)"></path>
                </svg>
                <span className="quantity__planner__data">{todayTasks}</span>
                <span className="text__planner__data text--1__planner__data"> Today's Tasks </span>
            </div>
            <div className="item__planner__data item--2__planner__data">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M7 10l5 5 5-5H7z" fill="rgba(252,161,71,1)"></path>
                </svg>
                <span className="quantity__planner__data">{totalTasks}</span>
                <span className="text__planner__data text--2__planner__data"> Total Tasks </span>
            </div>
            <div className="item__planner__data item--3__planner__data">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M12 10l5 5 5-5H12z" fill="rgba(66,193,110,1)"></path>
                </svg>
                <span className="quantity__planner__data">{highPriorityTasks}</span>
                <span className="text__planner__data text--3__planner__data"> High Priority </span>
            </div>
            <div className="item__planner__data item--4__planner__data">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M12 14l5 5 5-5H12z" fill="rgba(220,91,183,1)"></path>
                </svg>
                <span className="quantity__planner__data">{upcomingTasks}</span>
                <span className="text__planner__data text--4__planner__data"> Upcoming Tasks </span>
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
                <button onClick={handleSaveTask}>
                    {editingTask ? <><FaEdit /> Update Task</> : <><FaPlus /> Add Task</>}
                </button>
            </div>
            <div className="task-list">
                <h2 className="section-title" style={{textAlign: 'center'}}><FaCalendarAlt /> Tasks for {formatDate(selectedDate)}</h2>
                <div className="task-container">
                    {getTasksForDate(selectedDate).map(task => (
                        <div key={task.id} className={`task ${getPriorityClass(task.priority)}`}>
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-description">{task.description}</p>
                            <p className="task-due-date">Due Date: {formatDate(new Date(task.due_date))}</p>
                            <p className="task-priority">Priority: {task.priority}</p>
                            <button onClick={() => {
                                setEditingTask(task);
                                setTitle(task.title);
                                setDescription(task.description);
                                setDueDate(task.due_date);
                                setPriority(task.priority);
                                scrollToForm();
                            }} className='button-dashboard-planner'><FaEdit /> Edit</button>
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
                            <p className="task-description">{task.description}</p>
                            <p className="task-due-date">Due Date: {formatDate(new Date(task.due_date))}</p>
                            <p className="task-priority">Priority: {task.priority}</p>
                            <button onClick={() => {
                                setEditingTask(task);
                                setTitle(task.title);
                                setDescription(task.description);
                                setDueDate(task.due_date);
                                setPriority(task.priority);
                                scrollToForm();
                            }} className='button-dashboard-planner'><FaEdit /> Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)} className='button-edit-dashboard-planner button-dashboard-planner'><FaCheck /> Complete</button>
                        </div>
                    ))}
                </div>
            </div>
            <FooterNav />
            {modalVisible && <SuccessMessage message={modalMessage} onClose={() => setModalVisible(false)} />}
        </div>
    );
}

export default Planner;

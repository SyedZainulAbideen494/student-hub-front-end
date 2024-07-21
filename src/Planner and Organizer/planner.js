import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './planner_organizer.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import SuccessModal from '../app_modules/SuccessModal'; // Import the SuccessModal component

function Planner() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingTask, setEditingTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [modalMessage, setModalMessage] = useState(''); // State for modal message
    const formRef = useRef(null); // Reference to the task form

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
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
            });
    };

    // Use fetchTasks in useEffect
    useEffect(() => {
        fetchTasks();
    }, []);

    // Handle task addition or update
    const handleSaveTask = () => {
        const token = localStorage.getItem('token');
        if (editingTask) {
            axios.post(API_ROUTES.editTask, {
                id: editingTask.id,
                title,
                description,
                due_date: dueDate,
                priority,
                token
            })
            .then(response => {
                setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, title, description, due_date: dueDate, priority } : task));
                resetForm();
                showModal('Task updated successfully!');
                scrollToForm(); // Scroll to the form
            })
            .catch(error => {
                console.error('There was an error updating the task!', error);
            });
        } else {
            axios.post(API_ROUTES.addTask, {
                title,
                description,
                due_date: dueDate,
                priority,
                token
            })
            .then(response => {
                setTasks([...tasks, { id: response.data.id, title, description, due_date: dueDate, priority }]);
                resetForm();
                showModal('Task added successfully!');
            })
            .catch(error => {
                console.error('There was an error adding the task!', error);
            });
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
            });
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
        console.log('Showing modal with message:', message);
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

    return (
        <div className="App-dashboard-planner">
            <h1 className="header-title">Study Planner</h1>
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
    <h2 className="section-title">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
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
    <div className="form-actions">
        <button onClick={handleSaveTask}>{editingTask ? 'Save Changes' : 'Add Task'}</button>
        {editingTask && <button onClick={resetForm}>Cancel</button>}
    </div>
</div>
            <div className="task-list">
                <h2 className="section-title">Tasks for {selectedDate.toDateString()}</h2>
                {getTasksForDate(selectedDate).length === 0 ? (
                    <p>No tasks for this date</p>
                ) : (
                    getTasksForDate(selectedDate).map(task => (
                        <div key={task.id} className={`task-item ${getPriorityClass(task.priority)}`}>
                            <h2 className="task-title">{task.title}</h2>
                            <p className="task-description">{task.description}</p>
                            <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                            <p>Priority: {task.priority}</p>
                            <button
    className="button-dashboard-planner button-edit-dashboard-planner"
    onClick={() => {
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date);
        setPriority(task.priority);
        setEditingTask(task);
        scrollToForm(); // Scroll to the form
    }}
>
    Edit
</button>
<button
    className="button-dashboard-planner button-delete-dashboard-planner"
    onClick={() => handleDeleteTask(task.id)}
>
    Delete
</button>
                        </div>
                    ))
                )}
                
                <h2 className="section-title">All Tasks</h2>
                {getAllTasks().length === 0 ? (
                    <p>No tasks available</p>
                ) : (
                    getAllTasks().map(task => (
                        <div key={task.id} className={`task-item ${getPriorityClass(task.priority)}`}>
                            <h2 className="task-title">{task.title}</h2>
                            <p className="task-description">{task.description}</p>
                            <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                            <p>Priority: {task.priority}</p>
                            <button
    className="button-dashboard-planner button-edit-dashboard-planner"
    onClick={() => {
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date);
        setPriority(task.priority);
        setEditingTask(task)
        scrollToForm(); // Scroll to the form
    }}
>
    Edit
</button>
<button
    className="button-dashboard-planner button-delete-dashboard-planner"
    onClick={() => handleDeleteTask(task.id)}
>
    Delete
</button>
                        </div>
                    ))
                )}
            </div>
            {modalVisible && <SuccessModal visible={modalVisible} message={modalMessage} />}
            <FooterNav />
        </div>
    );
}

export default Planner;
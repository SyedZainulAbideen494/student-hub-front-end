import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomTasks.css'; // Ensure this file matches the updated design
import { useParams } from 'react-router-dom';
import { API_ROUTES } from '../../app_modules/apiRoutes';

const RoomTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'normal',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { roomId } = useParams();

  useEffect(() => {
    // Fetch existing tasks for the room
    axios
      .get(`${API_ROUTES.getRoomTasks}/${roomId}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({
      ...taskDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(API_ROUTES.addRoomTasks, { room_id: roomId, ...taskDetails })
      .then((response) => {
        setTasks([...tasks, { ...taskDetails, id: response.data.taskId }]);
        setTaskDetails({
          title: '',
          description: '',
          due_date: '',
          priority: 'normal',
        });
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`${API_ROUTES.deleteRoomTasks}/${taskId}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <div className="room-tasks-container__room__tasks__page">
    {/* Back Button */}
    <button
      className="back-btn__room__tasks__page"
      onClick={() => window.history.back()}
    >
      ←
    </button>
  
    {/* Page Header */}
    <h2 className="header__room__tasks__page">Room Tasks</h2>
  
    {/* Task List */}
    <div className="task-list__room__tasks__page">
      <h3 className="sub-header__room__tasks__page">Tasks</h3>
      {tasks.length === 0 ? (
        <p className="no-tasks__room__tasks__page">No tasks available</p>
      ) : (
        <ul className="task-items__room__tasks__page">
          {tasks.map((task) => (
            <li key={task.id} className="task-item__room__tasks__page">
              <h4 className="task-title__room__tasks__page">{task.title}</h4>
              <p className="task-desc__room__tasks__page">{task.description}</p>
              <p className="task-date__room__tasks__page">
                Due Date: {task.due_date || "N/A"}
              </p>
              <p
                className={`priority__room__tasks__page priority-${task.priority}__room__tasks__page`}
              >
                Priority: {task.priority}
              </p>
              <button
                className="complete-task-btn__room__tasks__page"
                onClick={() => handleDeleteTask(task.id)}
              >
                Complete Task
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  
    {/* Floating Add Task Button */}
    <button
      className="add-task-btn__room__tasks__page"
      onClick={() => setIsModalOpen(true)}
    >
      +
    </button>
  
    {/* Add Task Modal */}
    {isModalOpen && (
      <div className="modal-overlay__room__tasks__page">
        <div className="modal__room__tasks__page">
          <h3 className="modal-header__room__tasks__page">Add Task</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={taskDetails.title}
              onChange={handleInputChange}
              required
              className="modal-input__room__tasks__page"
            />
            <textarea
              name="description"
              placeholder="Description (Optional)"
              value={taskDetails.description}
              onChange={handleInputChange}
              className="modal-textarea__room__tasks__page"
            />
            <input
              type="date"
              name="due_date"
              value={taskDetails.due_date}
              onChange={handleInputChange}
              className="modal-input__room__tasks__page"
            />
            <select
              name="priority"
              value={taskDetails.priority}
              onChange={handleInputChange}
              className="modal-select__room__tasks__page"
              style={{width: '96%'}}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <div className="modal-actions__room__tasks__page">
              <button
                type="button"
                className="cancel-btn__room__tasks__page"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn__room__tasks__page">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default RoomTasks;

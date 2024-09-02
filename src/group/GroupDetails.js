import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GroupDetails.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import SuccessModal from '../app_modules/SuccessModal';
import LeaveGroupModal from './LeaveGroupModal';

const GroupDetailPage = () => {
    const { id } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [memberCount, setMemberCount] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskPriority, setTaskPriority] = useState('normal');

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getGroupDetailsById}/${id}`);
                setGroupDetails(response.data);

                const memberCountResponse = await axios.get(`${API_ROUTES.getGroupMemberCount}/${id}`);
                setMemberCount(memberCountResponse.data.memberCount);

                const memberResponse = await axios.get(`${API_ROUTES.getGroupMembers}/${id}`);
                setMembers(memberResponse.data.members);

                const taskResponse = await axios.get(`${API_ROUTES.getGroupTasks}/${id}`);
                setTasks(taskResponse.data.tasks);

            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [id]);

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleInvite = async () => {
        if (!phoneNumber) {
            setErrorMessage('Phone number is required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_ROUTES.inviteMemberToGroup}/${id}`,
                { phoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPhoneNumber('');
            setErrorMessage('');
            setSuccessMessage('Invitation sent successfully.');
            setIsSuccessModalVisible(true);
            setTimeout(() => setIsSuccessModalVisible(false), 3000);

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleLeaveGroup = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post(
                `${API_ROUTES.leaveGroup}/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.location.href = '/groups';
        } catch (error) {
            setErrorMessage('Failed to leave the group. Please try again.');
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    const handleAddTask = async () => {
        if (!taskTitle || !taskDueDate) {
            setErrorMessage('Title and due date are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_ROUTES.addGroupTask}`,
                { title: taskTitle, description: taskDescription, dueDate: taskDueDate, priority: taskPriority, groupId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTaskTitle('');
            setTaskDescription('');
            setTaskDueDate('');
            setTaskPriority('normal');
            setErrorMessage('');
            setSuccessMessage('Task added successfully.');
            setIsSuccessModalVisible(true);

            // Update tasks list
            const taskResponse = await axios.get(`${API_ROUTES.getGroupTasks}/${id}`);
            setTasks(taskResponse.data.tasks);

            setTimeout(() => setIsSuccessModalVisible(false), 3000);

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Utility function to format the date
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  

    if (!groupDetails) return <div>Loading...</div>;

    return (
        <div className="group-detail-page">
            <header className="page-header">
                <button className="back-button" onClick={() => window.history.back()}>&larr;</button>
                <h1>{groupDetails.name}</h1>
                <p>{groupDetails.description}</p>
                <p>Status: {groupDetails.is_public ? 'Public' : 'Private'}</p>
            </header>

            <section className="members-section">
                <div className="card">
                    <h3 className="section-heading">Members ({memberCount})</h3>
                    <div className="members-container">
                        {members.length > 0 ? (
                            members.map(member => (
                                <div key={member.id} className="member-card">
                                    <p className="member-name">{member.unique_id}</p>
                                </div>
                            ))
                        ) : (
                            <p>No members yet.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="invite-section">
                <div className="card">
                    <h3 className="section-heading">Invite Members</h3>
                    <div className="invite-input-container">
                        <input
                            type="text"
                            className="invite-input"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="Enter phone number"
                        />
                        <button className="invite-button" onClick={handleInvite}>Invite Members</button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>
            </section>

            <section className="task-form">
                <div className="card">
                    <h3 className="section-heading">Tasks</h3>
                    <div className="task-input-container">
                        <input
                            type="text"
                            className="task-input"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Task Title"
                        />
                        <textarea
                            className="task-textarea"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder="Task Description"
                        />
                        <input
                            type="date"
                            className="task-input"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                        />
                        <select
                            className="task-select"
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                        </select>
                        <button className="task-button" onClick={handleAddTask}>Add Task</button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <div className="tasks-list">
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <div key={task.id} className="task-container">
                                    <h4 className="task-title">{task.title}</h4>
                                    <p className="task-description">{task.description}</p>
                                    <p className="task-due-date">Due: {formatDate(new Date(task.due_date))}</p>
                                    <p className="task-priority">Priority: {task.priority}</p>
                                </div>
                            ))
                        ) : (
                            <p>No tasks yet.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="leave-group-section">
                <button className="leave-group-button" onClick={() => setIsLeaveModalVisible(true)}>Leave Group</button>
            </section>

            <footer className="page-footer">
                <p className="quote">"Empowering connections, one group at a time."</p>
                <p className="copyright">© 2024 Edusify. All rights reserved.</p>
            </footer>

            {isSuccessModalVisible && (
                <SuccessModal
                    onClose={closeSuccessModal}
                    message={successMessage}
                />
            )}

            {isLeaveModalVisible && (
                <LeaveGroupModal
                    onConfirm={handleLeaveGroup}
                    onCancel={() => setIsLeaveModalVisible(false)}
                />
            )}
        </div>
    );
};

export default GroupDetailPage;
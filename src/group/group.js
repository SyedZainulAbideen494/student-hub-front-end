import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';
import './GroupsPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import SuccessModal from '../app_modules/SuccessModal';

const GroupsPage = () => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', is_public: true });
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const nav = useNavigate(); // For navigation

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const joinedResponse = await axios.get(API_ROUTES.fetchJoinedGroups, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJoinedGroups(joinedResponse.data);
                const publicResponse = await axios.get(API_ROUTES.fetchPublicGroups);
                setPublicGroups(publicResponse.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    const handleCreateGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_ROUTES.createGroup, newGroup, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await axios.get(API_ROUTES.fetchJoinedGroups, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJoinedGroups(response.data);
            setSuccessMessage('Group created successfully!');
            setIsModalVisible(true);
            setTimeout(() => setIsModalVisible(false), 3000);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_ROUTES.joinGroup}/${groupId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await axios.get(API_ROUTES.fetchJoinedGroups, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJoinedGroups(response.data);
            setSuccessMessage('Joined group successfully!');
            setIsModalVisible(true);
            setTimeout(() => setIsModalVisible(false), 3000);
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    const openGroupChat = (groupId) => {
        nav(`/group-chat/${groupId}`);
    };

    return (
        <div className="groups-container">
            <SuccessModal visible={isModalVisible} message={successMessage} />
            <div className="group-creation-form">
                <h1 className="form-title">Create Group</h1>
                <input
                    type="text"
                    className="group-name-input"
                    placeholder="Group Name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
                <textarea
                    className="group-description-input"
                    placeholder="Description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        className="public-checkbox"
                        checked={newGroup.is_public}
                        onChange={(e) => setNewGroup({ ...newGroup, is_public: e.target.checked })}
                    />
                    <label className="checkbox-label">Public</label>
                </div>
                <button className="group-creation-button" onClick={handleCreateGroup}>Create Group</button>
            </div>
            <div className="groups-list-container">
                <h2 className="groups-list-title">Joined Groups</h2>
                <ul className="groups-list">
                    {joinedGroups.map((group) => (
                        <li key={group.id} className="group-item" onClick={() => openGroupChat(group.id)}>
                            {group.name}
                        </li>
                    ))}
                </ul>
                <h2 className="groups-list-title">Public Groups</h2>
                <ul className="groups-list" style={{ marginBottom: '50px' }}>
                    {publicGroups.map((group) => (
                        <li key={group.id} className="group-item">
                            {group.name}
                            <button className="join-group-button" onClick={() => handleJoinGroup(group.id)}>Join</button>
                        </li>
                    ))}
                </ul>
            </div>
            <FooterNav />
        </div>
    );
};

export default GroupsPage;
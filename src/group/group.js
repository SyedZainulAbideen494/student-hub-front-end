import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';
import './GroupsPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import SuccessModal from '../app_modules/SuccessModal';
import InvitationModal from './InvitationModal'; // New component for invitations

const GroupsPage = () => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', is_public: true });
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [isInvitationModalVisible, setIsInvitationModalVisible] = useState(false);
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

        const fetchInvitations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_ROUTES.fetchInvitations, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInvitations(response.data);
            } catch (error) {
                console.error('Error fetching invitations:', error);
            }
        };

        fetchGroups();
        fetchInvitations();
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
            setShowCreateGroupForm(false);
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

    const handleInvitationResponse = async (groupId, phoneNumber, action) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_ROUTES.respondToInvitation, { groupId, phoneNumber, action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update invitations after response
            const response = await axios.get(API_ROUTES.fetchInvitations, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvitations(response.data);
            setSuccessMessage(`Invitation ${action}ed successfully!`);
            setIsModalVisible(true);
            setTimeout(() => setIsModalVisible(false), 3000);
        } catch (error) {
            console.error('Error responding to invitation:', error);
        }
    };

    const openGroupChat = (groupId) => {
        nav(`/group-chat/${groupId}`);
    };

    return (
        <div className="groups-container">
            <SuccessModal visible={isModalVisible} message={successMessage} />
            <InvitationModal 
                visible={isInvitationModalVisible} 
                invitations={invitations}
                onResponse={handleInvitationResponse}
                onClose={() => setIsInvitationModalVisible(false)} 
            />
            <div className="button-container">
                <button className="nav-button" onClick={() => setShowCreateGroupForm(true)}>Create Group</button>
                <button className="nav-button" onClick={() => setIsInvitationModalVisible(true)}>Invitations</button>
            </div>
            {showCreateGroupForm && (
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
            )}
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
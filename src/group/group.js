import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupsPage.css'; // Import CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const GroupsPage = () => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', is_public: true });

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage

                // Fetch joined groups
                const joinedResponse = await axios.get(API_ROUTES.fetchJoinedGroups, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJoinedGroups(joinedResponse.data);

                // Fetch public groups
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
            const token = localStorage.getItem('token'); // Get token from localStorage

            await axios.post(API_ROUTES.createGroup, newGroup, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh the list of groups after creating a new one
            const response = await axios.get(API_ROUTES.fetchJoinedGroups, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJoinedGroups(response.data);

        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage

            await axios.post(`${API_ROUTES.joinGroup}/${groupId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh the list of joined groups
            const response = await axios.get(API_ROUTES.fetchJoinedGroups, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJoinedGroups(response.data);

        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    return (
        <div className="groups-container">
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
                    <li key={group.id} className="group-item">
                        {group.name}
                    </li>
                ))}
            </ul>
    
            <h2 className="groups-list-title">Public Groups</h2>
            <ul className="groups-list" style={{marginBottom: '50px'}}>
                {publicGroups.map((group) => (
                    <li key={group.id} className="group-item">
                        {group.name}
                        <button className="join-group-button" onClick={() => handleJoinGroup(group.id)}>Join</button>
                    </li>
                ))}
            </ul>
        </div>
        <FooterNav/>
    </div>
    );
};

export default GroupsPage;
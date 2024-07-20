import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupsPage.css'; // Import CSS file
import { API_ROUTES } from '../app_modules/apiRoutes';

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
        <div className="groups-page">
            <div className="create-group">
                <h1>Create Group</h1>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={newGroup.is_public}
                        onChange={(e) => setNewGroup({ ...newGroup, is_public: e.target.checked })}
                    />
                    Public
                </label>
                <button onClick={handleCreateGroup}>Create Group</button>
            </div>

            <div className="groups-list">
                <h2>Joined Groups</h2>
                <ul>
                    {joinedGroups.map((group) => (
                        <li key={group.id}>
                            {group.name}
                        </li>
                    ))}
                </ul>

                <h2>Public Groups</h2>
                <ul>
                    {publicGroups.map((group) => (
                        <li key={group.id}>
                            {group.name}
                            <button onClick={() => handleJoinGroup(group.id)}>Join</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GroupsPage;
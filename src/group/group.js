import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './GroupsPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import SuccessModal from '../app_modules/SuccessModal';
import InvitationModal from './InvitationModal'; 

const GroupsPage = () => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', is_public: true });
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [isInvitationModalVisible, setIsInvitationModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('joined');
    const nav = useNavigate(); 

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const [joinedResponse, publicResponse] = await Promise.all([
                    axios.get(API_ROUTES.fetchJoinedGroups, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(API_ROUTES.fetchPublicGroups)
                ]);
                setJoinedGroups(joinedResponse.data);
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
            const response = await axios.get(API_ROUTES.fetchInvitations, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvitations(response.data);
            setSuccessMessage(`Invitation ${action}ed successfully!`);
            setIsInvitationModalVisible(false);
            setTimeout(() => setIsModalVisible(false), 3000);
        } catch (error) {
            console.error('Error responding to invitation:', error);
        }
    };

    const openGroupChat = (groupId) => {
        nav(`/group-chat/${groupId}`);
    };

    const toggleCreateGroupBtn = () => {
        setShowCreateGroupForm(!showCreateGroupForm);
    };

    const filteredPublicGroups = publicGroups
        .filter(group => !joinedGroups.some(joinedGroup => joinedGroup.id === group.id))
        .filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="groups-container">
            <SuccessModal visible={isModalVisible} message={successMessage} />
            <InvitationModal 
                visible={isInvitationModalVisible} 
                invitations={invitations}
                onResponse={handleInvitationResponse}
                onClose={() => setIsInvitationModalVisible(false)} 
            />
            <header className="header">
                <h1>Groups</h1>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>
            <div className="tab-container">
                <button
                    className={`tab-button ${activeTab === 'joined' ? 'active' : ''}`}
                    onClick={() => setActiveTab('joined')}
                >
                    Joined Groups
                </button>
                <button
                    className={`tab-button ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    Public Groups
                </button>
            </div>
            <div className="button-container" style={{ marginBottom: '30px' }}>
                <button className="join-group-button" onClick={toggleCreateGroupBtn}>Create Group</button>
                <button className="join-group-button" onClick={() => setIsInvitationModalVisible(true)}>Invitations</button>
            </div>
            {showCreateGroupForm && (
                <div className="group-creation-form">
                    <h2 className="form-title">Create Group</h2>
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
                    <button className="join-group-button" onClick={handleCreateGroup}>Create Group</button>
                </div>
            )}
            <div className={`transition-container ${activeTab === 'joined' ? '' : 'hidden'}`}>
                <div className="groups-list-container">
                    <h2 className="groups-list-title">Joined Groups</h2>
                    <ul className="groups-list">
                        {joinedGroups.map((group) => (
                            <li key={group.id} className="group-item" onClick={() => openGroupChat(group.id)}>
                                {group.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={`transition-container ${activeTab === 'public' ? '' : 'hidden'}`}>
                <div className="groups-list-container">
                    <h2 className="groups-list-title">Public Groups</h2>
                    <ul className="groups-list">
                        {filteredPublicGroups.map((group) => (
                            <li key={group.id} className="group-item">
                                <span className="group-name">{group.name}</span>
                                <button className="join-button" onClick={() => handleJoinGroup(group.id)}>Join</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <FooterNav />
        </div>
    );
};

export default GroupsPage;
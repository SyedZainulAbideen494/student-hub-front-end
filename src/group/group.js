import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './GroupsPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import SuccessModal from '../app_modules/SuccessModal';
import InvitationModal from './InvitationModal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers, faGlobe, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

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

    // Filter groups based on the active tab and search term
    const filteredJoinedGroups = joinedGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          
          {/* Header with Create Group */}
          <header className="groups-header">
            <h1>Groups</h1>
            <div className="groups-actions">
              <div className="groups-search-container">
                <input
                  type="text"
                  className="groups-search-input"
                  placeholder="Search groups"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="groups-create-btn-groups" onClick={toggleCreateGroupBtn}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </header>
    
          {/* Tab Section with Icons */}
          <div className="groups-tab-container">
            <button
              className={`groups-tab-button ${activeTab === 'joined' ? 'groups-active' : ''}`}
              onClick={() => setActiveTab('joined')}
            >
              <FontAwesomeIcon icon={faUsers} /> Joined
            </button>
            <button
              className={`groups-tab-button ${activeTab === 'public' ? 'groups-active' : ''}`}
              onClick={() => setActiveTab('public')}
            >
              <FontAwesomeIcon icon={faGlobe} /> Public
            </button>
            <button
              className="groups-tab-button"
              onClick={() => setIsInvitationModalVisible(true)}
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} /> Invitations
              {invitations.length > 0 && (
                <span className="invitation-badge">{invitations.length}</span>
              )}
            </button>
          </div>
    
          {/* Group Creation Form */}
          {showCreateGroupForm && (
            <div className="groups-group-creation-form">
              <h2 className="groups-form-title">Create Group</h2>
              <input
                type="text"
                className="groups-group-name-input"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
              <textarea
                className="groups-group-description-input"
                placeholder="Description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
              <div className="groups-checkbox-container">
                <input
                  type="checkbox"
                  className="groups-public-checkbox"
                  checked={newGroup.is_public}
                  onChange={(e) => setNewGroup({ ...newGroup, is_public: e.target.checked })}
                />
                <label className="groups-checkbox-label">Public</label>
              </div>
              <button className="groups-create-btn" onClick={handleCreateGroup}>Create Group</button>
            </div>
          )}
    
          {/* Group Lists */}
          <div className={`groups-transition-container ${activeTab === 'joined' ? '' : 'hidden'}`}>
            <div className="groups-list-container">
              <h2 className="groups-list-title">Joined Groups</h2>
              <ul className="groups-list">
                {filteredJoinedGroups.map((group) => (
                  <li key={group.id} className="group-item" onClick={() => openGroupChat(group.id)}>
                    {group.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
    
          <div className={`groups-transition-container ${activeTab === 'public' ? '' : 'hidden'}`}>
            <div className="groups-list-container">
              <h2 className="groups-list-title">Public Groups</h2>
              <ul className="groups-list">
                {filteredPublicGroups.map((group) => (
                  <li key={group.id} className="group-item" onClick={() => handleJoinGroup(group.id)}>
                    {group.name}
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

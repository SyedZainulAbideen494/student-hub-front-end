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
import GroupsPageTutorial from './GroupsPageTutorial';
const GroupsPage = () => {
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', is_public: false });
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [isInvitationModalVisible, setIsInvitationModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('joined');
    const nav = useNavigate(); 
    const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility

    useEffect(() => {
        // Check local storage for tutorial completion status
        const completed = localStorage.getItem('groupsPageTutorialComplete');
        if (completed) {
            setShowTutorial(false); // Set showTutorial to false if found
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false); // Hide tutorial when complete
        localStorage.setItem('groupsPageTutorialComplete', 'true'); // Store completion status in local storage
    };

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
{showTutorial && <GroupsPageTutorial onComplete={handleTutorialComplete} />}
  <SuccessModal visible={isModalVisible} message={successMessage} />
  <InvitationModal
    visible={isInvitationModalVisible}
    invitations={invitations}
    onResponse={handleInvitationResponse}
    onClose={() => setIsInvitationModalVisible(false)}
  />

  {/* Header with Create Group */}
  <header className="groups-header">
    <div className="groups-actions">
      <div className="groups-search-container">

        <div className="search__group__search__bar">
    <input type="text" className="search__input__group__search__bar"   placeholder="Search groups"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
    <button className="search__button__group__search__bar">
        <svg className="search__icon__group__search__bar" aria-hidden="true" viewBox="0 0 24 24">
            <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
        </svg>
    </button>
</div>
      </div>
      <button className="groups-create-btn-groups" onClick={toggleCreateGroupBtn}>
        <FontAwesomeIcon icon={faPlus} /> Create
      </button>
    </div>
  </header>

  <div className="container__groups__page__tabs">
  <div className="tabs__groups__page__tabs">
    <input
      type="radio"
      id="radio-1"
      name="tabs"
      checked={activeTab === 'joined'}
      onChange={() => setActiveTab('joined')}
    />
    <label className="tab__groups__page__tabs" htmlFor="radio-1">Joined</label>

   {/*  <input
      type="radio"
      id="radio-2"
      name="tabs"
      checked={activeTab === 'public'}
      onChange={() => setActiveTab('public')}
    />
    <label className="tab__groups__page__tabs" htmlFor="radio-2">Public</label>*/}

    <input
      type="radio"
      id="radio-3"
      name="tabs"
      checked={activeTab === 'invitations'}
      onChange={() => setIsInvitationModalVisible(true)}
    />
    <label className="tab__groups__page__tabs" htmlFor="radio-3">
      Invitations
      <span className="notification__groups__page__tabs">{invitations.length}</span>
    </label>

    <span className="glider__groups__page__tabs"></span>
  </div>
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
     {/* <div className="groups-checkbox-container">
        <input
          type="checkbox"
          id="terms"
          checked={newGroup.is_public}
          onChange={(e) => setNewGroup({ ...newGroup, is_public: e.target.checked })}
          style={{ display: 'none' }}
        />
        <label htmlFor="terms" className="check__terms__box">
          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
            <polyline points="1 9 7 14 15 4"></polyline>
          </svg>
          <label className="groups-checkbox-label">Public</label>
        </label>
      </div>*/}
      <button className="groups-create-btn" onClick={handleCreateGroup}>Create Group</button>
    </div>
  )}

  {/* Group Lists */}
  <div className={`groups-transition-container ${activeTab === 'joined' ? '' : 'hidden'}`}>
    <div className="groups-list-container">
      {filteredJoinedGroups.length === 0 ? (
      <div className="no-group-container">
      <div className="pyramid-loader__no__groups">
        <div className="wrapper__no__groups">
          <span className="side__no__groups side1__no__groups"></span>
          <span className="side__no__groups side2__no__groups"></span>
          <span className="side__no__groups side3__no__groups"></span>
          <span className="side__no__groups side4__no__groups"></span>
          <span className="shadow__no__groups"></span>
        </div>  
      </div>
      <p className="no-group-message">No groups found</p>
    </div>
    
      ) : (
        <ul className="groups-list">
          {filteredJoinedGroups.map((group) => (
            <li key={group.id} className="group-item" onClick={() => openGroupChat(group.id)}>
              {group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  <div className={`groups-transition-container ${activeTab === 'public' ? '' : 'hidden'}`}>
    <div className="groups-list-container">
      {filteredPublicGroups.length === 0 ? (
        <div className="no-group-container">
        <p className="no-group-message">No groups found</p>
      </div>
      ) : (
        <ul className="groups-list">
          {filteredPublicGroups.map((group) => (
            <li key={group.id} className="group-item" onClick={() => handleJoinGroup(group.id)}>
              {group.name}
              <button className="join-btn-group-page">Join</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  <FooterNav />
</div>

      );
    };
    
    export default GroupsPage;

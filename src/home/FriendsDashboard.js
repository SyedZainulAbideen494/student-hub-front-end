import React, { useState, useEffect } from 'react';
import './FriendsDashboard.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FriendWidgetDashboard = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [requests, setRequests] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('friends'); // State to manage active tab
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
        try {
          const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
          const response = await fetch(API_ROUTES.getuserFriendsDashboardWidget, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const data = await response.json();
      
          // Filter out duplicates based on unique IDs
          const uniqueRequests = Array.from(new Set(data.friendRequests.map(a => a.id)))
            .map(id => data.friendRequests.find(a => a.id === id));
      
          const uniqueFriends = Array.from(new Set(data.friends.map(a => a.id)))
            .map(id => data.friends.find(a => a.id === id));
      
          setFriendRequests(uniqueRequests);
          setFriends(uniqueFriends);
          setRequests(uniqueRequests.length);
        } catch (error) {
          console.error('Error fetching friends data:', error);
        }
      };
      

    fetchData();
  }, []);

  const toggleRequestDetails = (request) => {
    if (selectedRequest && selectedRequest.id === request.id) {
      setSelectedRequest(null); // Deselect request
    } else {
      setSelectedRequest(request); // Select new request
    }
  };

  const handleRequestAction = async (action, request) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    
      // Send the action (accept or decline) to the backend
      const response = await fetch(API_ROUTES.friendReqResponse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
          profileUserId: request.sender_id,
          action,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message); // Log success message
  
        // After accepting or declining, fetch the updated data
        const fetchData = async () => {
          try {
            const response = await fetch(API_ROUTES.getuserFriendsDashboardWidget, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            const data = await response.json();
  
            setFriendRequests(data.friendRequests);
            setFriends(data.friends);
            setRequests(data.friendRequests.length);
          } catch (error) {
            console.error('Error fetching updated friends data:', error);
          }
        };
  
        // Refresh the data after the action
        fetchData();
      } else {
        console.error(data.message); // Log error message
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);



  const shareProfile = () => {
    // Your logic to share the profile, e.g., using the Web Share API
    const currentUrl = window.location.origin; // Get the current URL
    const profileUrl = `${currentUrl}/profile/${profile.id}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Profile',
        url: profileUrl, // Share the current URL (or your profile URL here)
      })
      .then(() => console.log('Profile shared successfully'))
      .catch((error) => console.error('Error sharing profile:', error));
    } else {
      // Fallback if the Web Share API is not supported
      alert('Sharing not supported on this device/browser.');
    }
  };

  const goToProfile = (id) => {
    navigate(`/profile/${id}`); // Navigate to the profile page
  };

  return (
<div className="friend__widget__dashboard">
  {/* Header */}
  <div className="friend__widget__dashboard__header">
    <h2 className="friend__widget__dashboard__title">Friends</h2>
    <div className="friend__widget__dashboard__tabs">
      <div
        className={`friend__widget__dashboard__tab ${activeTab === 'friends' ? 'active' : ''}`}
        onClick={() => setActiveTab('friends')}
      >
        Friends
      </div>
      <div
        className={`friend__widget__dashboard__tab ${activeTab === 'requests' ? 'active' : ''}`}
        onClick={() => setActiveTab('requests')}
      >
        Requests ({requests})
      </div>
    </div>
  </div>

  {/* Tab Content */}
  {activeTab === 'requests' && friendRequests.length > 0 && (
    <div className="friend__widget__dashboard__list">
      <h3>Pending Friend Requests</h3>
      {friendRequests.map((request) => (
        <div key={request.id} className="friend__widget__dashboard__item" onClick={() => goToProfile(request.sender_id)}>
          <img
            className="friend__widget__dashboard__avatar"
            src={`${API_ROUTES.displayImg}/${request.sender_avatar}` || 'default-avatar-url'}
          />
          <div className="friend__widget__dashboard__info">
            <span className="friend__widget__dashboard__username">
              {request.sender_unique_id.length > 6
                ? `${request.sender_unique_id.substring(0, 6)}...`
                : request.sender_unique_id}
            </span>
          </div>
          <div className="friend__widget__dashboard__buttons">
            <button onClick={() => handleRequestAction('accept', request)}>Accept</button>
            <button onClick={() => handleRequestAction('decline', request)}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  )}

  {activeTab === 'friends' && (
    <div className="friend__widget__dashboard__list">
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.id} className="friend__widget__dashboard__item" onClick={() => goToProfile(friend.id)}>
            <img
              className="friend__widget__dashboard__avatar"
              src={`${API_ROUTES.displayImg}/${friend.avatar}` || 'default-avatar-url'}
            />
            <div className="friend__widget__dashboard__info">
              <span className="friend__widget__dashboard__username">
                {friend.uniqueId.length > 17
                  ? `${friend.uniqueId.substring(0, 17)}...`
                  : friend.uniqueId}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div>No friends yet</div>
      )}
    </div>
  )}

  {/* Footer */}
  <div className="friend__widget__dashboard__footer">
    {/* New Share My Profile Button */}
    <button className="friend__widget__dashboard__btn-inline" onClick={() => shareProfile()}>
      Share My Profile
    </button>
  </div>
  <span className="friend__widget__intrct">Share your profile to be added as a friend</span>
</div>

  );
};

export default FriendWidgetDashboard;

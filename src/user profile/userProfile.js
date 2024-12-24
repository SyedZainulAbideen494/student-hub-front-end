import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { FaShareAlt, FaArrowLeft, FaBook } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [requestStatus, setRequestStatus] = useState('none'); // Default status is 'none'
  const [token, setToken] = useState(localStorage.getItem('token'));
  const nav = useNavigate();
  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_ROUTES.profileView}/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchRequestStatus = async () => {
      if (token) {  // Only fetch if token is available
        try {
          const response = await fetch(`${API_ROUTES.friendReqStatus}/${userId}`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Send token as Bearer token in headers
            },
          });
          const data = await response.json();
          setRequestStatus(data.status); // Update request status based on the response
        } catch (error) {
          console.error('Error fetching friend request status:', error);
        }
      }
    };

    fetchUserProfile();
    fetchRequestStatus(); // Fetch the request status when the component loads
  }, [userId, token]);  // Re-run when userId or token changes

  const handleShareProfile = () => {
    const link = `${window.location.origin}/profile/${userId}`;
    const message = `Check out this profile on Edusify: ${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleBack = () => {
    nav(-1);
  };

  const handleAddFriend = async () => {
    if (requestStatus === 'none' || requestStatus === 'declined') {
      try {
        const response = await fetch(API_ROUTES.sendFriendRequest, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Send token in the header
          },
          body: JSON.stringify({ profileUserId: userId }),
        });
        const data = await response.json();
        alert(data.message);
        setRequestStatus('pending');  // Update status to 'pending' after sending the request
      } catch (error) {
        console.error('Error sending friend request:', error);
      }
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user__profile__guest">
      {/* Header */}
      <div className="profile__header__guest">
        <button className="back__btn__guest" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h2 className="header__title__guest">{userData.name}</h2>
        <button className="share__btn__guest" onClick={handleShareProfile}>
          <FaShareAlt />
        </button>
      </div>

      <div className="profile__header__bottom__guest">
        <img className="profile__img__guest" src={`${API_ROUTES.displayImg}/${userData.avatar}`} alt="Profile" />
        <p className="bio__guest">{userData.bio}</p>
      </div>

      {/* Add Friend Button */}
      <div className="add-friend-button">
        {requestStatus === 'none' || requestStatus === 'declined' ? (
          <button onClick={handleAddFriend}>Add Friend +</button>
        ) : requestStatus === 'pending' ? (
          <span>Request Sent</span>
        ) : requestStatus === 'accepted' ? (
          <span>Friend Added</span>
        ) : null}
      </div>

      {/* Profile Info */}
      <div className="profile__info__guest">
        <div className="info__block__guest">
          <h3 className="info__title__guest">Room: </h3>
          <p>{userData.room}</p>
        </div>
        <div className="info__block__guest">
          <h3 className="info__title__guest">Leaderboard Points: </h3>
          <p>{userData.leaderboardPoints}</p>
        </div>
        <div className="info__block__guest">
          <h3 className="info__title__guest">Pomodoro Hours: </h3>
          <p>{userData.pomodoroHours}</p>
        </div>
      </div>

      <div className="top__subjects__guest">
        <h3 className="top__subjects__title__guest">Top Subjects</h3>
        <div className="subjects__tags__guest">
          {userData.topSubjects.map((subject, index) => (
            <div key={index} className="subject__tag__guest">
              <span className="subject__icon__guest"><FaBook /></span>
              <span>{subject}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="activity__guest">
        <h3 className="activity__title__guest">Recent Activity</h3>
        <div className="activity__cards__guest">
          <div className="activity__card__guest">
            <p>Highest Quiz Score: {userData.highestQuizScore}</p>
          </div>
          <div className="activity__card__guest">
            <p>Completed Tasks: {userData.completedTasks}</p>
          </div>
          <div className="activity__card__guest">
            <p>Quizzes Attended: {userData.quizzesAttended}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

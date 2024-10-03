import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './ProfileAvatar.css'; // Include any relevant CSS

const ProfileAvatar = () => {
  const [profile, setProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data);
      } catch (err) {
        setError('Error fetching profile data');
      }
    };

    fetchProfileData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('avatar', newAvatar);
      const token = localStorage.getItem('token');

      await axios.post(API_ROUTES.updateAvatar, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      // Re-fetch user profile to update avatar
      const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
      setProfile(data);
      setNewAvatar(null);
      setAvatarPreview(null);
    } catch (err) {
      setError('Error updating avatar');
    }
  };

  const handleCancel = () => {
    setAvatarPreview(null);
    setNewAvatar(null);
  };

  return (
    <div className="profile-avatar-container">
      <img
        className="profile-avatar"
        src={avatarPreview || `${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
        alt="Profile Avatar"
      />

      <input type="file" accept="image/*" onChange={handleAvatarChange} />

      {avatarPreview && (
        <div className="avatar-preview-controls">
          <button onClick={handleAvatarSubmit}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfileAvatar;

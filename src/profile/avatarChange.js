import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './ProfileAvatar.css'; // Include relevant CSS for styling

const ProfileAvatar = () => {
  const [profile, setProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
      setProfile(data);
      setNewAvatar(null);
      setAvatarPreview(null);
    } catch (err) {
      setError('Error updating avatar');
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ROUTES.updateAvatar, { avatar: 'defPic.png' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
      setProfile(data);
      setAvatarPreview(null);
      setNewAvatar(null);
    } catch (err) {
      setError('Error removing avatar');
    }
  };

  const handleCancel = () => {
    setAvatarPreview(null);
    setNewAvatar(null);
  };

  return (
    <div className="profile-avatar-container__change__avatar">
      <div className="avatar-wrapper__change__avatar">
        <img
          className="profile-avatar__change__avatar"
          src={avatarPreview || `${API_ROUTES.displayImg}/${profile.avatar}` || 'default-avatar-url'}
          alt="Profile Avatar"
        />

        {profile.avatar !== 'defPic.png' && (
          <button className="remove-avatar-btn__change__avatar" onClick={handleRemoveAvatar}>
            Remove Avatar
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="file-input__change__avatar"
        id="avatar-input"
        hidden
      />

      {/* Custom button to trigger file input */}
      <label htmlFor="avatar-input" className="custom-file-btn__change__avatar">
        Upload New Avatar
      </label>

      {avatarPreview && (
        <div className="avatar-preview-controls__change__avatar">
          <button className="save-btn__change__avatar" onClick={handleAvatarSubmit}>Save</button>
          <button className="cancel-btn__change__avatar" onClick={handleCancel}>X</button>
        </div>
      )}

      {error && <p className="error__change__avatar">{error}</p>}
    </div>
  );
};

export default ProfileAvatar;

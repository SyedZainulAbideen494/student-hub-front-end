import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import SuccessMessage from '../app_modules/SuccessMessage';
import './ProfileAvatar.css'; // Include relevant CSS for styling

const ProfileAvatar = () => {
  const [profile, setProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

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

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB size limit

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_SIZE || !['image/jpeg', 'image/png'].includes(file.type)) {
      setError('File size or format not allowed');
      return;
    }
    setNewAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const handleAvatarSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('avatar', newAvatar); // Ensure this key matches what the server expects
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(API_ROUTES.updateAvatar, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Ensure the token is valid
        },
      });
      
      if (response.status === 200) {
        setSuccessMessage('Avatar updated successfully!'); // Set success message
        
        // Fetch updated profile
        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data);
        
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating avatar:', err.response ? err.response.data : err.message);
    }
  };
  
  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ROUTES.removeAvatar, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSuccessMessage('Avatar removed successfully!'); // Set success message
      
      // Refresh the profile
      const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
      setProfile(data);
      setAvatarPreview(null);
      setNewAvatar(null);
      
      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

      {/* Render success message if it exists */}
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
    </div>
  );
};

export default ProfileAvatar;

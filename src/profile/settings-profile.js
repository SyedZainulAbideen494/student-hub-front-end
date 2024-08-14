import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './settings-profile.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';
import SuccessModal from '../app_modules/SuccessModal';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('Account');
  const [formData, setFormData] = useState({
    unique_id: '',
    name: '',
    bio: '',
    location: '',
    phone_number: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.post(API_ROUTES.fetchUserProfile, 
            { token },
            { headers: { 'Content-Type': 'application/json' } }
          );
          setFormData({
            unique_id: response.data.unique_id,
            name: response.data.user_name,
            bio: response.data.bio,
            location: response.data.location,
            phone_number: response.data.phone_number,
            avatar: response.data.avatar
          });
        }
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setFormData({ ...formData, avatar: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await axios.post(
          API_ROUTES.removeAvatar,
          { unique_id: formData.unique_id },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setFormData({ ...formData, avatar: 'defPic.png' }); // Set to default picture
        setModalVisible(true); // Show modal on success
        setTimeout(() => setModalVisible(false), 3000); // Hide modal after 3 seconds
      }
    } catch (error) {
      setError('Error removing avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('unique_id', formData.unique_id);
    formDataToSend.append('user_name', formData.name);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('phone_number', formData.phone_number);

    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    } else {
      formDataToSend.append('avatar', formData.avatar); // Send current or default avatar
    }

    try {
      if (token) {
        await axios.put(
          API_ROUTES.editProfile,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        setModalVisible(true); // Show modal on success
        setTimeout(() => setModalVisible(false), 3000); // Hide modal after 3 seconds
      }
    } catch (error) {
      setError('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="27" style={{marginTop:' 10px'}}>
            <path d="M15 3L8 12l7 9" stroke="#000" strokeWidth="2" fill="none" />
          </svg>
        </button>
        <h3>Settings</h3>
      </header>
      <div className="settings-nav">
        {/* Navigation buttons */}
      </div>
      <div className="settings-content">
        {loading && <div className="loader">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {activeSection === 'Account' && (
          <form className="settings-form" onSubmit={handleFormSubmit}>
            <label htmlFor="username">User name</label>
            <input
              type="text"
              id="username"
              name="unique_id"
              value={formData.unique_id}
              onChange={handleInputChange}
            />

            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />

            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />

            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />

            <label htmlFor="avatar">Avatar</label>
            <div className="avatar-section">
              {formData.avatar && <img src={`${API_ROUTES.displayImg}/${formData.avatar}`} alt="avatar" className="avatar-preview" />}
              <label htmlFor="avatar-upload" className="avatar-upload-button">+</label>
              <input
                type="file"
                id="avatar-upload"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              {formData.avatar && (
                <button type="button" className="remove-avatar-button" onClick={handleRemoveAvatar}>Remove</button>
              )}
            </div>

            <button type="submit">Save Changes</button>
          </form>
        )}
        {/* Other sections */}
      </div>
      <SuccessModal visible={modalVisible} message="Profile updated successfully!" />
    </div>
  );
};

export default SettingsPage;
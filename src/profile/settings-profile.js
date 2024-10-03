import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './settings-profile.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';
import SuccessModal from '../app_modules/SuccessModal';
import ProfileAvatar from './avatarChange';

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
  const [initialFormData, setInitialFormData] = useState({}); // Store initial data for comparison
  const [avatarFile, setAvatarFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uniqueIdStatus, setUniqueIdStatus] = useState(''); // State for unique ID validation
  const [hasUniqueIdChanged, setHasUniqueIdChanged] = useState(false); // Track if unique ID has changed
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
          const userData = {
            unique_id: response.data.unique_id,
            name: response.data.user_name,
            bio: response.data.bio,
            location: response.data.location,
            phone_number: response.data.phone_number,
            avatar: response.data.avatar
          };
          setFormData(userData);
          setInitialFormData(userData); // Store initial data for comparison
        }
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (hasUniqueIdChanged) { // Only check unique ID if it's been changed
      const checkUniqueId = async () => {
        try {
          const response = await fetch(API_ROUTES.checkUniqueId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unique_id: formData.unique_id }),
          });
          if (response.ok) {
            setUniqueIdStatus('available');
          } else {
            setUniqueIdStatus('taken');
          }
        } catch (error) {
          console.error('Error checking unique_id:', error);
          setUniqueIdStatus('error');
        }
      };
      checkUniqueId();
    }
  }, [formData.unique_id, hasUniqueIdChanged]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'unique_id') {
      setHasUniqueIdChanged(value !== initialFormData.unique_id); // Check if unique_id has changed
      setUniqueIdStatus(''); // Reset status while typing
    }
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
        setAvatarFile(null); // Clear the file
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
  
    // Ensure unique_id check only fails if the user changed it to a taken ID
    if (uniqueIdStatus === 'taken') {
      setError('Unique ID is not available');
      return; // Prevent form submission if unique ID is not available
    }
  
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
  
    const formDataToSend = new FormData();
  
    // Always send all form fields, whether changed or not
    formDataToSend.append('unique_id', formData.unique_id || initialFormData.unique_id);
    formDataToSend.append('user_name', formData.name || initialFormData.name);
    formDataToSend.append('bio', formData.bio || initialFormData.bio);
    formDataToSend.append('location', formData.location || initialFormData.location);
    formDataToSend.append('phone_number', formData.phone_number || initialFormData.phone_number);
  
    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    } else if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar); // Send the existing avatar if it's not changed
    }
  
  
    try {
      if (token) {
        await axios.put(
          API_ROUTES.editProfile,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        setModalVisible(true); // Show success modal
        setTimeout(() => setModalVisible(false), 3000); // Hide after 3 seconds
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
      <button className="back-button" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="27" style={{ marginTop: '10px' }}>
                <path d="M15 3L8 12l7 9" stroke="#000" strokeWidth="2" fill="none" />
            </svg>
        </button>
        <h3>Settings</h3>
      </header>
      <div className="settings-nav">
        {/* Navigation buttons */}
      </div>
      <div className="settings-content">
       
        {loading && <div className="loader"></div>}
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
              placeholder={uniqueIdStatus === 'taken' ? 'Unique ID already taken' : ''}
              style={{ borderColor: uniqueIdStatus === 'taken' ? 'red' : 'initial' }}
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

            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />



            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
      <SuccessModal visible={modalVisible} message="Profile updated successfully!" />
    </div>
  );
};

export default SettingsPage;


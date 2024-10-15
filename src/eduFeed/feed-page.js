import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EduFeed.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import Stories from './story/stories';

const EduFeed = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner or animation here
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="eduFeed__main__page">
      {/* Header */}
      <header className="eduFeed__header__main__page">
        <div className="eduFeed__logo__main__page">Edusify</div>
        <img
          className="profile-avatar__eduFeed__main__page"
          src={`${API_ROUTES.displayImg}/${profile?.avatar}` || 'default-avatar-url'} 
          alt="Profile Avatar"
        />
      </header>

      {/* Main Content */}
      <main className="eduFeed__main_content__main__page">
        {/* Placeholder for stories component */}
        <div className="eduFeed__stories__main__page">
          <Stories/>
        </div>

        {/* Placeholder for posts component */}
        <div className="eduFeed__posts__main__page">
          <p>Posts component will go here</p>
        </div>
      </main>
    </div>
  );
};

export default EduFeed;

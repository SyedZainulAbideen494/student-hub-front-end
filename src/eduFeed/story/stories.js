import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { API_ROUTES } from '../../app_modules/apiRoutes';
import './stories.css'

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);


  useEffect(() => {
    // Fetch user's profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });  // Token in body
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error fetching profile');
      }
    };

    // Fetch stories from users the current user follows
    const fetchStories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_ROUTES.fetchUserStories, { token });  // Token in body
        setStories(response.data.stories);
      } catch (err) {
        setError('Failed to fetch stories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchStories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="stories__eduFeed__main__page">
      <div className="story__add__eduFeed__main__page">
        {profile && (
          <div className="story__add__container__eduFeed__main__page">
            <FontAwesomeIcon icon={faPlusCircle} className="add__icon__eduFeed__main__page" />
            <p>Add Story</p>
          </div>
        )}
      </div>

      {/* Displaying stories from followed users */}
      <div className="stories__list__eduFeed__main__page">
        {stories.length > 0 ? (
          stories.map((story, index) => (
            <div key={index} className="story__item__eduFeed__main__page">
              <img
                src={`${story.avatar}`}
                alt={`${story.user_name}'s story`}
                className="story__avatar__eduFeed__main__page"
              />
              <p>{story.user_name}</p>
            </div>
          ))
        ) : (
          <p>No stories available.</p>
        )}
      </div>
    </div>
  );
};

export default Stories;

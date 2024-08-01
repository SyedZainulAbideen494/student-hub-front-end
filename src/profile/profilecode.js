import React from 'react';
import './ProfilePage.css';

const dummyProfile = {
  name: 'Anne Adams',
  username: '@anne.adams99',
  location: 'San Jose, CA',
  stats: {
    fans: 24000,
    following: 582,
    posts: 2129,
    stories: 91
  },
  photos: [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150'
  ]
};

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <header>
        <h1>&larr;</h1>
      </header>
      <div className="profile">
        <img className="avatar"src={`${API_ROUTES.displayImg}/${profile.avatar || 'default-avatar-url'}`} alt="avatar" />
        <h2>{profile.name}</h2>
        <p>{profile.username}</p>
        <p>{profile.location}</p>
        <div className="stats">
          <div> Fans</div>
          <div> Following</div>
          <div> Posts</div>
          <div> Stories</div>
        </div>
        <div className="actions">
          <button className="follow">Follow</button>
          <button className="message">Message</button>
        </div>
      </div>
      <div className="media">
        <div className="tabs">
          <button>Photo</button>
          <button>Video</button>
          <button>About</button>
          <button>Favorite</button>
        </div>
        <div className="photos">
        
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
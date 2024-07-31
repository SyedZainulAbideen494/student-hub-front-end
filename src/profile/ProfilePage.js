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
        <img className="avatar" src="https://via.placeholder.com/80" alt="avatar" />
        <h2>{dummyProfile.name}</h2>
        <p>{dummyProfile.username}</p>
        <p>{dummyProfile.location}</p>
        <div className="stats">
          <div>{dummyProfile.stats.fans} Fans</div>
          <div>{dummyProfile.stats.following} Following</div>
          <div>{dummyProfile.stats.posts} Posts</div>
          <div>{dummyProfile.stats.stories} Stories</div>
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
          {dummyProfile.photos.map((photo, index) => (
            <img key={index} src={photo} alt="profile" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

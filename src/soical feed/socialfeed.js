import React, { useState } from 'react';
import { FaPoll, FaSearch, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './socialfeed.css';
import FooterNav from '../app_modules/footernav';

const SocialFeed = () => {
  const dummyPosts = [
    {
      id: 1,
      user: 'Angelina Hall',
      avatar: 'https://i.pinimg.com/236x/79/4f/84/794f8458e51353f262fb1610999a3395.jpg',
      time: '2 hours ago',
      content: 'I have just spent 3 amazing days in my home town!',
      image: 'https://i.pinimg.com/236x/79/4f/84/794f8458e51353f262fb1610999a3395.jpg',
      likes: 1500,
      comments: 841,
      shares: 227
    }
    // Add more posts as needed
  ];

  const dummyStories = [
    { id: 1, name: 'Krista Artis', image: 'https://i.pinimg.com/236x/79/4f/84/794f8458e51353f262fb1610999a3395.jpg' },
    { id: 2, name: 'Imogen', image: 'https://i.pinimg.com/236x/79/4f/84/794f8458e51353f262fb1610999a3395.jpg' },
    { id: 3, name: 'Anne Adams', image: 'https://i.pinimg.com/236x/79/4f/84/794f8458e51353f262fb1610999a3395.jpg' },
    { id: 4, name: 'Oliver Smith', image: 'https://i.pinimg.com/236x/79/4f/84/794f8458e51353f262fb1610999a3395.jpg' },
    // Add more stories as needed
  ];

  return (
    <div className="social-feed-page">
      <div className="header">
        <h1 className="header-title">Edusify</h1>
      </div>
      <div className="stories-container">
        <div className="stories">
          <div className="story add-story">+</div>
          {dummyStories.map(story => (
            <div key={story.id} className="story">
              <img src={story.image} alt={story.name} className="story-image"/>
              <span className="story-name">{story.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="new-post">
        <div className="new-post-avatar"></div>
        <input type="text" placeholder="Write something here..." className="new-post-input"/>
      </div>
      <div className="posts">
        {dummyPosts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <img src={post.avatar} alt="avatar" className="post-avatar"/>
              <div>
                <h2 className="post-user">{post.user}</h2>
                <span className="post-time">{post.time}</span>
              </div>
            </div>
            <p className="post-content">{post.content}</p>
            <img src={post.image} alt="post" className="post-image"/>
            <div className="post-footer">
              <span className="post-likes"><FaThumbsUp /> {post.likes}</span>
              <span className="post-comments"><FaComment /> {post.comments}</span>
              <span className="post-shares"><FaShare /> {post.shares}</span>
            </div>
          </div>
        ))}
      </div>
      <FooterNav/>
    </div>
  );
}

export default SocialFeed;
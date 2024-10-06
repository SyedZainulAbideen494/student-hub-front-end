import React, { useState, useEffect } from 'react';
import './ExploreCard.css'; // Import the CSS file

const ExploreCard = () => {
  // Define multiple features and their respective links
  const features = [
    {
      title: "Trend: Add Your Study Setup to Social Feed",
      description: "Showcase your study setup and inspire others by posting it on the social feed.",
      link: "/social-feed"
    },
    {
      title: "Make Notes Using AI",
      description: "Generate quick and effective notes with our AI-powered note-making tool.",
      link: "/ai"
    },
    {
      title: "Post Your Study Tips on Social Feed",
      description: "Share your study tips and strategies with the community to help others excel.",
      link: "/social-feed"
    },
    {
      title: "Trend: Share Your Progress",
      description: "Post your study progress and motivate others on the social feed.",
      link: "/social-feed"
    },
    {
      title: "Get Feedback on Your Study Routine",
      description: "Ask for feedback from the community to improve your study routine.",
      link: "/social-feed"
    },
    {
      title: "Find Study Groups",
      description: "Connect with peers who are studying similar subjects through the social feed.",
      link: "/social-feed"
    },
    {
      title: "Trend: Share a Day in Your Study Life",
      description: "Create a post about a typical study day and inspire others in the community.",
      link: "/social-feed"
    }
  ];
  

  const [currentFeature, setCurrentFeature] = useState(features[0]);

  useEffect(() => {
    // Shuffle and display a random feature when the component mounts
    const randomFeature = features[Math.floor(Math.random() * features.length)];
    setCurrentFeature(randomFeature);
  }, []);

  const handleExploreMore = () => {
    // Redirect or navigate to the specific link for the current feature
    window.location.href = currentFeature.link;
  };

  return (
    <div className="explore-card">
      <div className="explore-card-content">
        <h3 className="explore-card-title">{currentFeature.title}</h3>
        <p className="explore-card-description">
          {currentFeature.description}
        </p>
        <button
          className="go-page-home-component-btn"
          onClick={handleExploreMore}
        >
          Explore More
        </button>
      </div>
    </div>
  );
};

export default ExploreCard;

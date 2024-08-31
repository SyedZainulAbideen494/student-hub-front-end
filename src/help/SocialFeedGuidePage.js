import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const SocialFeedGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Social Feed</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Stay connected with your peers and share updates through the Social Feed feature!</p>
        </section>
        <section className="blog-content-help-page">
          <h3>Using the Social Feed Feature</h3>
          <ol>
            <li>
              <strong>Access the Social Feed:</strong> Click on "Social Feed" in the navigation bar below. This will take you to the Social Feed page where you can view posts and interact with them.
            </li>
            <li>
              <strong>Switch Between Tabs:</strong> You can choose between "For You" and "Following" tabs at the top of the page:
              <ul>
                <li><strong>For You:</strong> See posts from everyone, including general tips, updates, and notes shared by the community.</li>
                <li><strong>Following:</strong> View posts specifically from users you follow.</li>
              </ul>
            </li>
            <li>
              <strong>Post a New Update:</strong> Below the tabs, you’ll find a section where you can create a new post. 
              <ul>
                <li>Type your message in the text area.</li>
                <li>Add images if desired.</li>
                <li>Click "Send" to share your post with others.</li>
              </ul>
            </li>
            <li>
              <strong>Interact with Posts:</strong> Scroll through the feed to view posts. You can like and comment on posts to engage with the content and participate in discussions.
            </li>
          </ol>
        </section>
        <section className="blog-tips-help-page">
          <h3>Tips for Using the Social Feed</h3>
          <ul>
            <li>Be respectful and supportive in your posts and comments to foster a positive community.</li>
            <li>Use the "For You" tab to discover new tips and updates that might be useful for your studies.</li>
            <li>Engage with posts from people you follow to keep up with their latest updates and insights.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default SocialFeedGuidePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './commentsPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const CommentsPage = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`${API_ROUTES.fetchEducribeComments}/${id}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      await axios.post(`${API_ROUTES.addEduscribeComment}/${id}`, { token, comment: commentInput });
      setCommentInput('');
      const { data } = await axios.get(`${API_ROUTES.fetchEducribeComments}/${id}`);
      setComments(data);
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="comments-page">
      <button className="back-button" onClick={handleBackClick}>
        &larr; Back
      </button>
      <h2 className="comments-heading">Comments</h2>
      <div className="comment-input-container">
        <textarea
          className="comment-input"
          value={commentInput}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
        />
        <button className="comment-submit-button" onClick={handleCommentSubmit}>
          Submit
        </button>
      </div>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <img
                src={`${API_ROUTES.displayImg}/${comment.avatar}`}
                alt="Profile Avatar"
                className="comment-avatar"
              />
              <div className="comment-info">
                <span className="comment-username">{comment.user_name}</span>
                <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsPage;
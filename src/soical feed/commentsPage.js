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
     <button onClick={handleBackClick} className='back-button__comments__section'>
  <svg className='back-button__comments__section__svg' height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
  <span>Back</span>
</button>
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
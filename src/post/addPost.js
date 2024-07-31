import React, { useState } from 'react';
import axios from 'axios';
import './PostForm.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found');
        return;
      }
      
      const response = await axios.post(API_ROUTES.addPost, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      setTitle('');
      setContent('');
      setImages([]);
    } catch (error) {
      setMessage('Error creating post');
      console.error(error);
    }
  };

  return (
    <div className="post-form-container-add-post">
      <h2 className="post-form-title-add-post">Create a New Post</h2>
      <form className="post-form-add-post" onSubmit={handleSubmit}>
        <div className="form-group-add-post">
          <label className="form-label-add-post">Title:</label>
          <input
            type="text"
            className="form-input-add-post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>
        <div className="form-group-add-post">
          <label className="form-label-add-post">Content:</label>
          <textarea
            className="form-textarea-add-post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            required
          />
        </div>
        <div className="form-group-add-post">
          <label className="form-label-add-post">Images:</label>
          <input
            type="file"
            multiple
            className="form-file-input-add-post"
            onChange={handleFileChange}
          />
          <div className="file-preview-add-post">
            {Array.from(images).map((file, index) => (
              <div key={index} className="file-preview-item-add-post">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="file-preview-img-add-post"
                />
                <p className="file-preview-name-add-post">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button-add-post">Create Post</button>
      </form>
      {message && <p className="response-message-add-post">{message}</p>}
    </div>
  );
};

export default PostForm;
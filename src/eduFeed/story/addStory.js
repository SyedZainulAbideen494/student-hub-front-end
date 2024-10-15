import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Importing the text editor
import 'react-quill/dist/quill.snow.css'; // Importing the styles
import { API_ROUTES } from '../../app_modules/apiRoutes';

const CreateStory = () => {
  const [storyType, setStoryType] = useState('text');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Handle file selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token'); // Get token from local storage

    const formData = new FormData();
    formData.append('token', token);
    formData.append('storyType', storyType);
    formData.append('content', content);

    // If a file is selected, append it to form data
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(API_ROUTES.addStory, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });

      setSuccessMessage(response.data.message);
      setContent('');
      setFile(null);
      setError(null);
    } catch (err) {
      console.error('Error uploading story:', err);
      setError('Failed to upload story');
    }
  };

  return (
    <div className="create-story-container">
      <h2>Create a Story</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Story Type:
          <select value={storyType} onChange={(e) => setStoryType(e.target.value)}>
            <option value="text">Text</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="note">Note</option>
            <option value="quiz">Quiz</option>
          </select>
        </label>

        {storyType === 'text' && (
          <ReactQuill value={content} onChange={setContent} />
        )}

        {(storyType === 'photo' || storyType === 'video') && (
          <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateStory;

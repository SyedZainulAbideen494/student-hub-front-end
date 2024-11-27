import React, { useState } from 'react';
import axios from 'axios';

const YoutubeCaption = () => {
    const [videoId, setVideoId] = useState('');
    const [captions, setCaptions] = useState('');
  
    const fetchCaptions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/captions/${videoId}`);
        setCaptions(response.data.captions.map(c => c.text).join('\n'));
      } catch (err) {
        console.error('Failed to fetch captions:', err);
      }
    };
  
    return (
      <div>
        <h1>YouTube Captions Fetcher</h1>
        <input
          type="text"
          placeholder="Enter YouTube Video ID"
          value={videoId}
          onChange={e => setVideoId(e.target.value)}
        />
        <button onClick={fetchCaptions}>Fetch Captions</button>
        {captions && (
          <div>
            <h3>Captions:</h3>
            <textarea value={captions} readOnly rows="10" cols="50" />
          </div>
        )}
      </div>
    );
  }

export default YoutubeCaption;

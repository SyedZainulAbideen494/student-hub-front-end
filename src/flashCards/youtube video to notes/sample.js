import React, { useState } from 'react';
import axios from 'axios';

function YtVidDownload() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setError('Please provide a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/download/yt/video?url=${url}`, {
        responseType: 'blob',
      });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.download = 'video.mp4';
      link.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error downloading video');
    }
  };

  return (
    <div className="App">
      <h1>YouTube Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Downloading...' : 'Download Video'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default YtVidDownload;

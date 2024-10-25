import React from 'react';
import { useParams, Link } from 'react-router-dom';
import YouTube from 'react-youtube';

const VideoPage = () => {
  const { videoId } = useParams();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Video Player</h1>
      <YouTube videoId={videoId} opts={{ width: '100%', height: '500px', playerVars: { autoplay: 1 } }} />
      
      {/* Placeholder for additional content */}
      <div style={{ marginTop: '20px', backgroundColor: 'black', color: 'white', padding: '20px', minHeight: '200px' }}>
        <p>Additional content will go here.</p>
      </div>

      <Link to="/" style={{ display: 'block', marginTop: '20px', color: 'blue' }}>Back to Search</Link>
    </div>
  );
};

export default VideoPage;

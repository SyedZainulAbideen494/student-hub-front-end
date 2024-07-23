import React from 'react';

const clientId = '0aac6cb1ec104103a5e2e5d6f9b490e7';
const redirectUri = 'http://localhost:3000/callback'; // Ensure this matches your Node.js redirect URI

const SpotifyAuth = () => {
  const handleLogin = () => {
    const scope = 'user-read-playback-state user-modify-playback-state';
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  return (
    <div>
      <h1>Spotify Authentication</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default SpotifyAuth;
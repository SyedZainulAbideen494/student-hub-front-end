import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Callback = () => {
  const location = useLocation();

  useEffect(() => {
    const fetchToken = async () => {
      const code = new URLSearchParams(location.search).get('code');
      try {
        await axios.get(`http://localhost:8080/auth/spotify?code=${code}`);
        window.location.href = '/';
      } catch (error) {
        console.error('Error during Spotify callback:', error);
        alert('Error during Spotify callback');
      }
    };

    fetchToken();
  }, [location]);

  return <div>Loading...</div>;
};

export default Callback;
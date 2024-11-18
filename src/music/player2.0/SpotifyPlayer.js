import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpotifyPlayer from 'react-spotify-web-playback';
import './music.css'; // Import a separate CSS file for custom styling

const MusicPlayer = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);  // Store playlists
  const [recommendedTracks, setRecommendedTracks] = useState([]);  // Store recommended tracks
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shuffle, setShuffle] = useState(false);  // Shuffle state
  const [repeat, setRepeat] = useState(false);  // Repeat state

  useEffect(() => {
    // Automatically get access and refresh tokens from URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    const refresh = params.get('refresh_token');
    
    if (token && refresh) {
      setAccessToken(token);
      setRefreshToken(refresh);
      fetchTopTracks(token);
      fetchPlaylists(token);
      fetchRecommendedTracks(token);
    } else {
      handleLogin(); // Automatically trigger login if tokens are not found
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/login/spotify"; // Redirect to your backend for Spotify login
  };

  // Fetch top tracks
  const fetchTopTracks = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user playlists
  const fetchPlaylists = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommended tracks
  const fetchRecommendedTracks = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 5,  // Number of recommended tracks
          seed_genres: 'pop',  // You can use other seeds like 'rock', 'hip-hop', etc.
        },
      });
      setRecommendedTracks(response.data.tracks);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search query and update results
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: query,
            type: 'track',
            limit: 5, // Limit search results to 5
          },
        });
        setSearchResults(response.data.tracks.items);
      } catch (error) {
        console.error('Error searching tracks:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/refresh_token',
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  if (!accessToken) {
    return (
      <div className="loading-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="music-player-container__music__player__Spotify">
      <h1 className="page-title__music__player__Spotify">Spotify Player</h1>

      {/* Search Bar */}
      <div className="search-bar-container__music__player__Spotify">
        <input
          type="text"
          className="search-input__music__player__Spotify"
          placeholder="Search for tracks..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>


      {/* Search Results */}
      <div className="search-results__music__player__Spotify">
        {loading && <div className="loading-spinner__music__player__Spotify">🔄 Loading...</div>}
        {searchResults.length > 0 && (
          <div>
            <h3 className="search-results-title__music__player__Spotify">Search Results:</h3>
            <ul className="search-results-list__music__player__Spotify">
              {searchResults.map((track) => (
                <li key={track.id} className="track-item__music__player__Spotify">
                  <button className="track-item-button__music__player__Spotify" onClick={() => setTracks([track])}>
                    <img src={track.album.images[0].url} alt={track.name} className="album-cover__music__player__Spotify" />
                    <span className="track-name__music__player__Spotify">{track.name}</span> -{' '}
                    <span className="track-artist__music__player__Spotify">{track.artists.map(artist => artist.name).join(', ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Spotify Player */}
      {tracks.length > 0 && (
        <div className="spotify-player-container__music__player__Spotify">
          <SpotifyPlayer
            token={accessToken}
            uris={tracks.map(track => track.uri)}
            play={true}
            styles={{
              bgColor: "#121212",
              color: "#fff",
              loaderColor: "#1db954",
              sliderColor: "#1db954",
              trackArtistColor: "#b3b3b3",
              trackNameColor: "#fff",
              buttonColor: "#1db954",
              buttonHoverColor: "#1aa34d",
              trackBackgroundColor: "#181818",
              trackHoverBackgroundColor: "#333",
            }}
            callback={(state) => {
              // Handle changes in player state (for example, shuffle or repeat changes)
            }}
            shuffle={shuffle}
            repeat={repeat}
          />
        </div>
      )}

      {/* Controls */}
      <div className="controls__music__player__Spotify">
        <button onClick={() => setShuffle(!shuffle)} className="shuffle-button__music__player__Spotify">
          {shuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
        </button>
        <button onClick={() => setRepeat(!repeat)} className="repeat-button__music__player__Spotify">
          {repeat ? 'Disable Repeat' : 'Enable Repeat'}
        </button>
      </div>

      {/* Refresh Access Token */}
      <div className="refresh-button-container__music__player__Spotify">
        <button className="refresh-button__music__player__Spotify" onClick={refreshAccessToken}>Refresh Access Token</button>
      </div>

      {/* Spotify Footer */}
      <footer className="spotify-footer__music__player__Spotify">
        <div className="spotify-logo__music__player__Spotify">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify Logo" />
        </div>
        <p className="footer-text__music__player__Spotify">Made with love for Spotify API</p>
      </footer>
    </div>
  );
};

export default MusicPlayer;

import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './music.css';

const Music = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const fetchTrack = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.item) {
        setTrack(response.data.item);
      } else {
        setTrack(null); // Handle cases where no track is currently playing
      }
    } catch (error) {
      console.error('Error fetching track:', error);
    }
  };

  const playPause = async () => {
    const action = isPlaying ? 'pause' : 'play';
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/${action}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchQuery,
          type: 'track',
          limit: 10,
        },
      });

      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const playTrack = async (uri) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchTrack(accessToken); // Update the currently playing track
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPlaylistTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  const playPlaylist = async (uris) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchTrack(accessToken); // Update the currently playing track
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  // Extract access token from URL params when the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      fetchTrack(token); // Fetch the currently playing track
      fetchPlaylists(); // Fetch user playlists
    }
  }, []);

  return (
    <div className="music-container">
      {!accessToken ? (
        <button onClick={() => window.location.href = 'http://localhost:8080/login/spotify'} className="login-button">
          Login with Spotify
        </button>
      ) : (
        <div className="player">
          <h1>Now Playing: {track ? track.name : 'Nothing is playing'}</h1>
          <button onClick={playPause} className="play-pause-button">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <div className="search">
            <input
              type="text"
              placeholder="Search for a track..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={searchTracks}>
              <FaSearch />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h2>Search Results</h2>
              <ul>
                {searchResults.map((result) => (
                  <li key={result.id} onClick={() => playTrack(result.uri)}>
                    {result.name} by {result.artists.map((artist) => artist.name).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="playlists">
            <h2>Your Playlists</h2>
            <ul>
              {playlists.map((playlist) => (
                <li
                  key={playlist.id}
                  onClick={() => fetchPlaylistTracks(playlist.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
          </div>

          {playlistTracks.length > 0 && (
            <div className="playlist-tracks">
              <h2>Playlist Tracks</h2>
              <ul>
                {playlistTracks.map(({ track }) => (
                  <li key={track.id} onClick={() => playTrack(track.uri)}>
                    {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Music;

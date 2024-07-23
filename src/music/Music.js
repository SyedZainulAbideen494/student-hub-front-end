import React, { useState, useEffect } from 'react';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaPlus, FaSearch } from 'react-icons/fa';
import './music.css';

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotifyAccessToken') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('spotifyRefreshToken') || '');
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomSongs, setRandomSongs] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    const refresh = params.get('refresh_token');

    if (token && refresh) {
      setAccessToken(token);
      setRefreshToken(refresh);
      localStorage.setItem('spotifyAccessToken', token);
      localStorage.setItem('spotifyRefreshToken', refresh);
      loadSpotifySDK(token);
      fetchUserPlaylists(token);
      fetchRandomSongs(token);
      scheduleTokenRefresh(refresh);
    } else if (accessToken && refreshToken) {
      loadSpotifySDK(accessToken);
      fetchUserPlaylists(accessToken);
      fetchRandomSongs(accessToken);
      scheduleTokenRefresh(refreshToken);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchTracks(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadSpotifySDK = (token) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        player.addListener('initialization_error', ({ message }) => {
          console.error(message);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error(message);
        });

        player.addListener('account_error', ({ message }) => {
          console.error(message);
        });

        player.addListener('player_state_changed', state => {
          if (!state) return;

          const currentTrack = state.track_window.current_track;
          if (currentTrack) {
            setSelectedTrack(currentTrack);
            setIsPlaying(!state.paused);
            if (queue.length > 0) {
              setQueue(prevQueue => prevQueue.slice(1)); // Remove the played song from the queue
              setCurrentQueueIndex(0);
            }
          }
        });

        player.connect();
      };
    };

    document.body.appendChild(script);
  };

  const fetchUserPlaylists = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching playlists: ${response.statusText}`);
      }

      const data = await response.json();
      setPlaylists(data.items); // Save playlists to state
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const scheduleTokenRefresh = (refreshToken) => {
    setTimeout(() => refreshAccessToken(refreshToken), 3600 * 1000 - 60000); // Refresh the token 1 minute before it expires
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(API_ROUTES.refreshSpotifyToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Error refreshing access token');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;
      localStorage.setItem('spotifyAccessToken', newAccessToken);
      setAccessToken(newAccessToken);

      if (player) {
        player.getOAuthToken(cb => cb(newAccessToken));
      }

      scheduleTokenRefresh(refreshToken); // Schedule the next token refresh
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Redirect to login if refreshing fails
      window.location.href = API_ROUTES.loginSpotify;
    }
  };

  const playPlaylist = async (playlistId) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching playlist tracks: ${response.statusText}`);
      }

      const data = await response.json();
      const tracks = data.items.map(item => item.track);
      if (tracks.length > 0) {
        playSong(tracks[0].uri); // Play the first track in the playlist
        setQueue(tracks); // Set the queue to the playlist tracks
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const fetchRandomSongs = async (token) => {
    try {
      const playlistId = '37i9dQZF1DXcBWIGoYBM5M';
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching random songs: ${response.statusText}`);
      }

      const data = await response.json();
      setRandomSongs(data.items.map(item => item.track));
    } catch (error) {
      console.error('Error fetching random songs:', error);
    }
  };

  const searchTracks = async (query) => {
    if (!query) return;
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setSearchResults(data.tracks.items);
    } catch (error) {
      console.error('Error searching for tracks:', error);
    }
  };

  const playSong = (spotifyUri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotifyUri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };

  const handlePlayPause = async () => {
    if (!player) return;

    const state = await player.getCurrentState();
    if (!state) return;

    if (state.paused) {
      player.resume();
    } else {
      player.pause();
    }
  };

  const handlePlayNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[currentQueueIndex];
      setCurrentQueueIndex((prevIndex) => (prevIndex + 1) % queue.length);
      playSong(nextTrack.uri);
      setSelectedTrack(nextTrack);
      setIsPlaying(true);
    }
  };

  const handlePlayPrevious = () => {
    if (queue.length > 0) {
      const prevTrackIndex = (currentQueueIndex - 1 + queue.length) % queue.length;
      const prevTrack = queue[prevTrackIndex];
      setCurrentQueueIndex(prevTrackIndex);
      playSong(prevTrack.uri);
      setSelectedTrack(prevTrack);
      setIsPlaying(true);
    }
  };

  const addToQueue = (track) => {
    setQueue((prevQueue) => [...prevQueue, track]);
  };

  const playRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * randomSongs.length);
    playSong(randomSongs[randomIndex].uri);
  };

  return  (
    <div className="spotify-player">
    <header className="header">
      <h1>Spotify Player</h1>
    </header>
    {selectedTrack && (
      <section className="now-playing-card">
        <img className="album-cover" src={selectedTrack.album.images[0].url} alt={selectedTrack.name} />
        <div className="track-info">
          <span className="track-name">{selectedTrack.name}</span><br/>
          <span className="artist-name">{selectedTrack.artists.map(artist => artist.name).join(', ')}</span>
        </div>
      </section>
    )}
    <section className="controls">
      <button className="icon-button" onClick={handlePlayPrevious}><FaStepBackward size={18} /></button>
      <button className="icon-button" onClick={handlePlayPause}>{isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}</button>
      <button className="icon-button" onClick={handlePlayNext}><FaStepForward size={18} /></button>
      <button className="icon-button" onClick={playRandomTrack}><FaRandom size={18} /></button>
    </section>
    <section className="search">
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a track"
          className="search-input"
        />
        <button className="icon-button" type="submit"><FaSearch size={18} /></button>
      </form>
    </section>
    <section className="search-results">
      {searchResults.map((track) => (
        <div className="search-result" key={track.id}>
          <img className="album-cover" src={track.album.images[0].url} alt={track.name} />
          <div className="track-details">
            <span className="track-name">{track.name}</span><br/>
            <span className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</span>
          </div>
          <button className="icon-button" onClick={() => addToQueue(track)}><FaPlus size={16} /></button>
          <button className="icon-button" onClick={() => playSong(track.uri)}><FaPlay size={16} /></button>
        </div>
      ))}
    </section>
    <FooterNav />
  </div>
  );
};

export default SpotifyPlayer;
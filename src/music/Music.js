import React, { useState, useEffect } from 'react';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaTrash, FaRandom, FaPlus } from 'react-icons/fa';
import './music.css';

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotifyAccessToken') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('spotifyRefreshToken') || '');
  const [deviceId, setDeviceId] = useState(localStorage.getItem('spotifyDeviceId') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomSongs, setRandomSongs] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(JSON.parse(localStorage.getItem('spotifySelectedTrack')) || null);
  const [isPlaying, setIsPlaying] = useState(JSON.parse(localStorage.getItem('spotifyIsPlaying')) || false);
  const [queue, setQueue] = useState(JSON.parse(localStorage.getItem('spotifyQueue')) || []);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(JSON.parse(localStorage.getItem('spotifyCurrentQueueIndex')) || 0);
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
      fetchRandomSongs(token);
      fetchUserPlaylists(token);
      scheduleTokenRefresh(refresh);
    } else if (accessToken && refreshToken) {
      loadSpotifySDK(accessToken);
      fetchRandomSongs(accessToken);
      fetchUserPlaylists(accessToken);
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

  useEffect(() => {
    localStorage.setItem('spotifySelectedTrack', JSON.stringify(selectedTrack));
    localStorage.setItem('spotifyIsPlaying', JSON.stringify(isPlaying));
    localStorage.setItem('spotifyQueue', JSON.stringify(queue));
    localStorage.setItem('spotifyCurrentQueueIndex', JSON.stringify(currentQueueIndex));
  }, [selectedTrack, isPlaying, queue, currentQueueIndex]);

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

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          localStorage.setItem('spotifyDeviceId', device_id);
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
              setQueue(prevQueue => prevQueue.slice(1));
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
      setPlaylists(data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const scheduleTokenRefresh = (refreshToken) => {
    // Refresh the token every 10 minutes
    setInterval(() => refreshAccessToken(refreshToken), 10 * 60 * 1000); // 10 minutes in milliseconds
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

      scheduleTokenRefresh(refreshToken);
    } catch (error) {
      console.error('Error refreshing access token:', error);
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
        playSong(tracks[0].uri);
        setQueue(tracks);
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
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        setIsPlaying(prev => !isPlaying);
      } else {
        console.error(`Error performing ${isPlaying ? 'pause' : 'play'} operation`);
      }
    } catch (error) {
      console.error(`Error performing ${isPlaying ? 'pause' : 'play'} operation:`, error);
    }
  };

  const handleNext = async () => {
    try {
      if (queue.length > 0) {
        // Play the next song in the queue
        const nextTrackIndex = (currentQueueIndex + 1) % queue.length;
        setCurrentQueueIndex(nextTrackIndex);
        const nextTrack = queue[nextTrackIndex];
        playSong(nextTrack.uri);
        setIsPlaying(true);
      } else {
        // Queue is empty, play a random song
        const randomTrack = randomSongs[Math.floor(Math.random() * randomSongs.length)];
        if (randomTrack) {
          playSong(randomTrack.uri);
          setQueue([randomTrack]); // Optionally add the random track to the queue
          setCurrentQueueIndex(0);
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };
  
  const handlePrevious = async () => {
    try {
      if (queue.length > 0) {
        // Play the previous song in the queue
        const previousTrackIndex = (currentQueueIndex - 1 + queue.length) % queue.length;
        setCurrentQueueIndex(previousTrackIndex);
        const previousTrack = queue[previousTrackIndex];
        playSong(previousTrack.uri);
        setIsPlaying(true);
      } else {
        // Queue is empty, play a random song
        const randomTrack = randomSongs[Math.floor(Math.random() * randomSongs.length)];
        if (randomTrack) {
          playSong(randomTrack.uri);
          setQueue([randomTrack]); // Optionally add the random track to the queue
          setCurrentQueueIndex(0);
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  const handleAddToQueue = (track) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const handleRemoveFromQueue = (index) => {
    setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
  };



  const handleRandomPlay = () => {
    // Implement play random track functionality
  };


  return (
    <div className="player-container">
    {/* Header */}
    <p className="login-message">
      If the music player is not responding, <a href={API_ROUTES.loginSpotify}>click here</a>
    </p>
    <header className="spotify-player-header search-bar">
      <h1>Spotify Player</h1>
      {/* Now Playing Card */}
      {selectedTrack && (
        <div className="current-track">
          <img src={selectedTrack.album.images[0].url} alt={selectedTrack.name} />
          <div>
            <h2>{selectedTrack.name}</h2>
            <p>{selectedTrack.artists.map((artist) => artist.name).join(', ')}</p>
          </div>
          <section className="controls player-controls">
            <button onClick={handlePrevious}><FaStepBackward /></button>
            <button onClick={handlePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
            <button onClick={handleNext}><FaStepForward /></button>
            <button onClick={handleRandomPlay}><FaRandom /></button>
          </section>
        </div>
      )}
      <input
        type="text"
        placeholder="Search for a track..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </header>
    {/* Search Results */}
    {searchResults.length > 0 && (
      <section className="search-results">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((track) => (
            <li key={track.id} className="search-result-item">
              <img src={track.album.images[0].url} alt={track.name} />
              <div>
                <h3>{track.name}</h3>
                <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
              <button onClick={() => playSong(track.uri)}><FaPlay /></button>
              <button onClick={() => handleAddToQueue(track)}><FaPlus /></button>
            </li>
          ))}
        </ul>
      </section>
    )}
    {/* Queue */}
    {queue.length > 0 && (
      <section className="queue">
        <h2>Queue</h2>
        <ul>
          {queue.map((track, index) => (
            <li key={track.id} className={`queue-item ${index === currentQueueIndex ? 'current' : ''}`}>
              <img src={track.album.images[0].url} alt={track.name} />
              <div>
                <h3>{track.name}</h3>
                <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
              <button onClick={() => handleRemoveFromQueue(index)} className='remove-queue-btn'><FaTrash /></button>
            </li>
          ))}
        </ul>
        <button className="clear-queue-btn" onClick={() => setQueue([])}>Clear Queue</button>
      </section>
    )}
    {/* Playlists */}
    {playlists.length > 0 && (
      <section className="playlists">
        <h2>Your Playlists</h2>
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id} className="playlist-item">
              <img src={playlist.images[0]?.url || 'default-image-url'} alt={playlist.name} />
              <div>
                <h3>{playlist.name}</h3>
                <p>{playlist.tracks.total} tracks</p>
              </div>
              <button onClick={() => playPlaylist(playlist.id)}>Play</button>
            </li>
          ))}
        </ul>
      </section>
    )}
    <FooterNav />
  </div>
  );
};

export default SpotifyPlayer;
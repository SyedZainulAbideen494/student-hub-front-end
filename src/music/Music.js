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
    setTimeout(() => refreshAccessToken(refreshToken), 3600 * 1000 - 60000);
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
    if (!player) return;

    try {
      const state = await player.getCurrentState();
      if (!state) return;

      if (state.paused) {
        await player.resume();
        setIsPlaying(true);
      } else {
        await player.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error in handlePlayPause:", error);
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
    const randomTrack = randomSongs[randomIndex];
    playSong(randomTrack.uri);
    setSelectedTrack(randomTrack);
  };

  const playSongFromSearch = (uri) => {
    playSong(uri);
    setIsPlaying(true);
  };

  return (
    <div className="player-wrapper">
      {!accessToken && <h2><a href={API_ROUTES.loginSpotify}>Login</a></h2>}
      <div className="player-container">
        <div className="now-playing-music">
          {selectedTrack && (
            <div className="track-info-music">
              <img className="album-cover spinning" src={selectedTrack.album.images[0]?.url} alt="Album Cover" /><br/>
              <div className="track-details-music">
                <h3>{selectedTrack.name}</h3><br/>
                <p>{selectedTrack.artists.map(artist => artist.name).join(', ')}</p>
              </div>
              <div className="player-controls-music">
                <button onClick={handlePlayPrevious}><FaStepBackward /></button>
                <button onClick={handlePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                <button onClick={handlePlayNext}><FaStepForward /></button>
                <button onClick={playRandomTrack}><FaRandom /></button>
              </div>
            </div>
          )}
        </div>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a song"
          />
          <button onClick={() => searchTracks(searchQuery)}><FaSearch /></button>
        </div>
        {searchQuery.length > 0 ? (
          <div className="search-results">
            {searchResults.map(track => (
              <div className="search-result-item" key={track.id}>
                <img className="album-cover" src={track.album.images[0]?.url} alt="Album Cover" />
                <div className="track-details">
                  <h4>{track.name}</h4>
                  <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
                <div className="track-actions">
                  <button onClick={() => playSongFromSearch(track.uri)}><FaPlay /></button>
                  <button onClick={() => addToQueue(track)}><FaPlus /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="playlists">
          {playlists.map(playlist => (
            <div className="playlist-item" key={playlist.id}>
              <img className="album-cover" src={playlist.images[0]?.url} alt="Playlist Cover" />
              <div className="playlist-details">
                <h4>{playlist.name}</h4>
                <p>{playlist.tracks.total} songs</p>
              </div>
              <button onClick={() => playPlaylist(playlist.id)}><FaPlay /> Play</button>
            </div>
          ))}
        </div>
        )}
      </div>
      <FooterNav />
    </div>
  );
};

export default SpotifyPlayer;

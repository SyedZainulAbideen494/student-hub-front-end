import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState('');
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomSongs, setRandomSongs] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNowPlayingVisible, setIsNowPlayingVisible] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('spotifyAccessToken');
    const storedRefreshToken = localStorage.getItem('spotifyRefreshToken');

    if (storedToken) {
      setAccessToken(storedToken);
      loadSpotifySDK(storedToken);
      fetchUserPlaylists(storedToken);
      fetchRandomSongs(storedToken);
    } else {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (token && refreshToken) {
        localStorage.setItem('spotifyAccessToken', token);
        localStorage.setItem('spotifyRefreshToken', refreshToken);
        setAccessToken(token);
        loadSpotifySDK(token);
        fetchUserPlaylists(token);
        fetchRandomSongs(token);
      }
    }
  }, []);

  useEffect(() => {
    if (accessToken && player) {
      refreshAccessToken(); // Refresh token if needed
    }
  }, [accessToken, player]);

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
      console.log('Playlists:', data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchRandomSongs = async (token) => {
    try {
      const playlistId = '37i9dQZF1DXcBWIGoYBM5M'; // Discover Weekly playlist
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

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('spotifyRefreshToken');
    if (!refreshToken) return;

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
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    searchTracks(e.target.value);
  };

  const handlePlayNext = (currentTrackUri) => {
    // Logic to play next song
  };

  const handlePlayPrevious = () => {
    // Logic to play previous song
  };

  const toggleNowPlayingVisibility = () => {
    setIsNowPlayingVisible(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyRefreshToken');
    setAccessToken('');
    setDeviceId('');
    setPlayer(undefined);
    // Redirect or update UI as needed
  };

  return (
    <Container>
      <Title>Spotify Player</Title>
      {!accessToken && <LoginLink href={API_ROUTES.loginSpotify}>Login to Spotify</LoginLink>}
      {accessToken && (
        <Content>
          <SearchBar 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a track"
          />
          {searchQuery ? (
            <>
              <SectionTitle>Search Results</SectionTitle>
              <Tracks>
                {searchResults.map(track => (
                  <TrackItem key={track.id}>
                    <TrackImage src={track.album.images[0]?.url} alt={track.name} />
                    <TrackInfo>
                      <TrackName>{track.name}</TrackName>
                      <TrackArtists>{track.artists.map(artist => artist.name).join(', ')}</TrackArtists>
                    </TrackInfo>
                    <PlayButton 
                      onClick={() => playSong(track.uri)}
                      isPlaying={selectedTrack && selectedTrack.uri === track.uri && isPlaying}
                    >
                      ▶
                    </PlayButton>
                  </TrackItem>
                ))}
              </Tracks>
            </>
          ) : (
            <>
              <SectionTitle>Random Songs</SectionTitle>
              <Tracks>
                {randomSongs.map(track => (
                  <TrackItem key={track.id}>
                    <TrackImage src={track.album.images[0]?.url} alt={track.name} />
                    <TrackInfo>
                      <TrackName>{track.name}</TrackName>
                      <TrackArtists>{track.artists.map(artist => artist.name).join(', ')}</TrackArtists>
                    </TrackInfo>
                    <PlayButton 
                      onClick={() => playSong(track.uri)}
                      isPlaying={selectedTrack && selectedTrack.uri === track.uri && isPlaying}
                    >
                      ▶
                    </PlayButton>
                  </TrackItem>
                ))}
              </Tracks>
            </>
          )}
          <FooterNav />
        </Content>
      )}
    </Container>
  );
};

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
background-color: #121212;
color: #fff;
min-height: 100vh;
padding: 20px;
`;

const Title = styled.h1`
margin-bottom: 20px;
`;

const LoginLink = styled.a`
color: #1DB954;
font-size: 18px;
text-decoration: none;
border: 1px solid #1DB954;
padding: 10px 20px;
border-radius: 50px;
transition: background-color 0.3s, color 0.3s;

&:hover {
  background-color: #1DB954;
  color: #fff;
}
`;

const Content = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
max-width: 800px;
`;

const SearchBar = styled.input`
width: 100%;
padding: 10px;
border-radius: 50px;
border: none;
margin-bottom: 20px;
font-size: 16px;
`;

const SectionTitle = styled.h2`
align-self: flex-start;
margin: 20px 0;
`;

const Tracks = styled.div`
display: flex;
flex-direction: column;
width: 100%;
`;

const TrackItem = styled.div`
display: flex;
align-items: center;
margin-bottom: 10px;
background-color: #282828;
padding: 10px;
border-radius: 10px;
`;

const TrackImage = styled.img`
width: 60px;
height: 60px;
border-radius: 10px;
margin-right: 10px;
`;

const TrackInfo = styled.div`
flex: 1;
display: flex;
flex-direction: column;
`;

const TrackName = styled.span`
font-size: 16px;
font-weight: bold;
`;

const TrackArtists = styled.span`
color: #b3b3b3;
`;

const spin = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const PlayButton = styled.button`
background: none;
border: none;
color: #1DB954;
font-size: 24px;
cursor: pointer;
transition: color 0.3s;

${({ isPlaying }) => isPlaying && css`
  animation: ${spin} 2s linear infinite;
`}

&:hover {
  color: #fff;
}
`;

export default SpotifyPlayer;
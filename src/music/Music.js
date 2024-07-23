import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NowPlaying from './nowPlaying'; // Import the NowPlaying component
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState('');
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomSongs, setRandomSongs] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      loadSpotifySDK(token);
      fetchUserPlaylists(token);
      fetchRandomSongs(token);
    }
  }, []);

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
      console.log('Playlists:', data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
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

  const playRandomTrack = () => {
    if (randomSongs.length > 0) {
      const randomTrack = randomSongs[Math.floor(Math.random() * randomSongs.length)];
      playSong(randomTrack.uri);
      setSelectedTrack(randomTrack);
      setIsPlaying(true);
    }
  };

  const addToQueue = (track) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const playFromQueue = () => {
    if (queue.length > 0) {
      const trackToPlay = queue[currentQueueIndex];
      playSong(trackToPlay.uri);
      setSelectedTrack(trackToPlay);
      setIsPlaying(true);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueIndex(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    searchTracks(e.target.value);
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
          {selectedTrack && (
            <NowPlaying 
              track={selectedTrack}
              isPlaying={isPlaying}
              onPlayPause={() => player.togglePlay()}
              onPlayNext={handlePlayNext}
              onPlayPrevious={handlePlayPrevious}
              onPlayRandom={playRandomTrack}
              onPlayFromQueue={playFromQueue}
              onClearQueue={clearQueue} // Pass clearQueue function
            />
          )}
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
                    <QueueButton onClick={() => addToQueue(track)}>Add to Queue</QueueButton>
                  </TrackItem>
                ))}
              </Tracks>
            </>
          ) : (
            <>
              <SectionTitle>Random Tracks</SectionTitle>
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
                    <QueueButton onClick={() => addToQueue(track)}>Add to Queue</QueueButton>
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

// Styled Components
const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
`;

const LoginLink = styled.a`
  font-size: 1.2em;
  color: #1DB954;
`;

const Content = styled.div`
  margin: 0 auto;
  max-width: 800px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const Tracks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  background: #f9f9f9;
`;

const TrackImage = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 10px;
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackName = styled.div`
  font-size: 1.2em;
`;

const TrackArtists = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const PlayButton = styled.button`
  background: ${props => props.isPlaying ? '#1DB954' : '#ddd'};
  color: #fff;
  border: none;
  padding: 10px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

const QueueButton = styled.button`
  background: #1DB954;
  color: #fff;
  border: none;
  padding: 10px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

export default SpotifyPlayer;
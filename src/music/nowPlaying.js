import React from 'react';
import styled from 'styled-components';

const NowPlaying = ({ track, isPlaying, onPlayPrevious, onPlayNext, isVisible, onToggleVisibility }) => {
  if (!track) {
    return null; // Return null if no track is selected
  }

  return (
    <Container isVisible={isVisible}>
      <Header>
        <h2>Now Playing</h2>
        <button onClick={onToggleVisibility}>Close</button>
      </Header>
      <Content>
        <TrackImage src={track.album.images[0]?.url} alt={track.name} />
        <TrackInfo>
          <TrackName>{track.name}</TrackName>
          <TrackArtists>{track.artists.map(artist => artist.name).join(', ')}</TrackArtists>
        </TrackInfo>
      </Content>
      <Controls>
        <button onClick={onPlayPrevious}>Previous</button>
        <button onClick={isPlaying ? () => {} : () => {}}>Play/Pause</button>
        <button onClick={onPlayNext}>Next</button>
      </Controls>
    </Container>
  );
};

const Container = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #181818;
  padding: 10px;
  color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  button {
    background: none;
    border: none;
    color: #1DB954;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
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
  font-size: 18px;
  font-weight: bold;
`;

const TrackArtists = styled.span`
  color: #b3b3b3;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;

  button {
    background: none;
    border: none;
    color: #1DB954;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }
`;

export default NowPlaying;
import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaForward, FaBackward, FaRandom, FaList } from 'react-icons/fa';

const NowPlaying = ({ track, isPlaying, onPlayPause, onPlayNext, onPlayPrevious, onPlayRandom, onPlayFromQueue }) => {
  if (!track) return null;

  return (
    <Container>
      <TrackImage src={track.album.images[0]?.url} alt={track.name} />
      <TrackInfo>
        <TrackName>{track.name}</TrackName>
        <TrackArtists>{track.artists.map(artist => artist.name).join(', ')}</TrackArtists>
      </TrackInfo>
      <Controls>
        <ControlButton onClick={onPlayPrevious}>
          <FaBackward size={20} />
        </ControlButton>
        <ControlButton onClick={onPlayPause}>
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </ControlButton>
        <ControlButton onClick={onPlayNext}>
          <FaForward size={20} />
        </ControlButton>
        <ControlButton onClick={onPlayRandom}>
          <FaRandom size={20} />
        </ControlButton>
        <ControlButton onClick={onPlayFromQueue}>
          <FaList size={20} />
        </ControlButton>
      </Controls>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #121212;
  border-radius: 8px;
  color: #fff;
  max-width: 100%;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  @media (min-width: 600px) {
    flex-direction: row;
    padding: 15px;
  }
`;

const TrackImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 10px;
  @media (min-width: 600px) {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    margin-bottom: 0;
  }
`;

const TrackInfo = styled.div`
  text-align: center;
  @media (min-width: 600px) {
    text-align: left;
    flex: 1;
  }
`;

const TrackName = styled.div`
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 5px;
  @media (min-width: 600px) {
    font-size: 1.2em;
  }
`;

const TrackArtists = styled.div`
  color: #aaa;
  font-size: 0.9em;
  @media (min-width: 600px) {
    font-size: 1em;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  @media (min-width: 600px) {
    margin-left: auto;
    margin-top: 0;
  }
`;

const ControlButton = styled.button`
  background-color: #1DB954;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 8px;
  margin: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.2s;
  
  &:hover {
    background-color: #1AAE4D;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(1);
  }
  
  @media (min-width: 600px) {
    padding: 10px;
  }
`;

export default NowPlaying;
import React, { useState, useRef, useEffect } from "react";
import './music.css';
import { FaPlay, FaPause, FaBackward, FaForward, FaSearch } from 'react-icons/fa';

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const openDB = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("EdusifyMusicDB", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("tracks")) {
          db.createObjectStore("tracks", { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  const addTrackToDB = async (track) => {
    const db = await openDB();
    const transaction = db.transaction("tracks", "readwrite");
    const store = transaction.objectStore("tracks");
    store.add(track);
  };

  const fetchTracksFromDB = async () => {
    const db = await openDB();
    const transaction = db.transaction("tracks", "readonly");
    const store = transaction.objectStore("tracks");
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newTracks = files.map((file) => ({
      name: file.name,
      file,
      image: "https://via.placeholder.com/150",
    }));

    for (const track of newTracks) {
      await addTrackToDB(track);
    }

    const allTracks = await fetchTracksFromDB();
    setTracks(allTracks);
  };

  const generateTrackUrl = (track) => {
    return URL.createObjectURL(track.file);
  };

  const playTrack = (index) => {
    setCurrentIndex(index);
    if (audioRef.current) {
      const track = tracks[index];
      if (track.file) {
        audioRef.current.src = generateTrackUrl(track);
        audioRef.current.play().catch((err) => {
          setError("Failed to play the audio. Please try again.");
          console.error("Audio play error:", err);
        });
      } else {
        setError("Invalid audio file.");
      }
    }
  };

  const playNextTrack = () => {
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  const playPreviousTrack = () => {
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
  };

  useEffect(() => {
    const loadTracks = async () => {
      const storedTracks = await fetchTracksFromDB();
      setTracks(storedTracks);
    };

    loadTracks();
  }, []);

  return (
    <div className="__edusify__music_player">
      <header className="__edusify__music_player__header">
        <button className="__edusify__music_player__back-btn">←</button>
      </header>

      <div className="__edusify__music_player__now-playing">
        <div className="__edusify__music_player__album-cover">
          <img
            src={currentIndex !== null ? tracks[currentIndex].image : "https://via.placeholder.com/150"}
            alt="Album Cover"
          />
        </div>
        <div className="__edusify__music_player__track-info">
          <h2>{currentIndex === null ? "Nothing Playing" : tracks[currentIndex].name}</h2>
          <div className="__edusify__music_player__controls">
            <button onClick={playPreviousTrack}>
              <FaBackward />
            </button>
            <button onClick={() => audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()}>
              {audioRef.current && audioRef.current.paused ? <FaPlay /> : <FaPause />}
            </button>
            <button onClick={playNextTrack}>
              <FaForward />
            </button>
          </div>
          <div className="__edusify__music_player__progress">
            <input type="range" min="0" max="100" value="0" />
            <div className="__edusify__music_player__duration">
              <span>0:00</span> / <span>3:30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="__edusify__music_player__track-list">
        <div className="__edusify__music_player__search">
          <FaSearch />
          <input type="text" placeholder="Search songs..." />
        </div>

        <ul>
          {tracks.map((track, index) => (
            <li key={track.id || index} onClick={() => playTrack(index)} className={currentIndex === index ? '__edusify__music_player__active' : ''}>
              <div className="__edusify__music_player__track">
                <img src={track.image} alt="Album Cover" />
                <div className="__edusify__music_player__track-details">
                  <span>{track.name}</span>
                  <span>3:30</span>
                </div>
                <button className="__edusify__music_player__track-btn">
                  {currentIndex === index ? <FaPause /> : <FaPlay />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <input
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="__edusify__music_player__file-input"
      />
      <audio
        ref={audioRef}
        className="__edusify__music_player__audio-player"
        onEnded={playNextTrack}
        onError={(e) => setError("Failed to load the audio file.")}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;

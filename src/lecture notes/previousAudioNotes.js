import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './AudioNotes.css';

const AudioNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAudioNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_ROUTES.fetchPreviousAudioNotes, {
          headers: {
            Authorization: token,
          },
        });
        setNotes(response.data.notes);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioNotes();
  }, []);

  return (
    <div className="container__prev__class__lect__page">
      <div className="header__prev__class__lect__page">
        <button className="back__btn__prev__class__lect__page" onClick={() => navigate(-1)}>
          <svg height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
        <h2 className="title__prev__class__lect__page">Your AI Summaries</h2>
      </div>

      {loading ? (
        <p className="loading__prev__class__lect__page">Fetching lectures...</p>
      ) : notes.length === 0 ? (
        <p className="no__notes__prev__class__lect__page">No lectures found.</p>
      ) : (
        <ul className="list__prev__class__lect__page">
         {notes.map((note) => (
  <li key={note.note_id} className="item__prev__class__lect__page">
    <div className="icon__wrapper__prev__class__lect__page">
      <svg
        height="28"
        width="28"
        viewBox="0 0 24 24"
        className="icon__ai__audio__recorder"
      >
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a9eff" />
            <stop offset="100%" stopColor="#cb7eff" />
          </linearGradient>
        </defs>
        <path
          fill="url(#aiGradient)"
          d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"
        />
      </svg>
    </div>
    <div className="right__col__prev__class__lect__page">
      <button
        className="btn__view__summary__prev__class__lect__page"
        onClick={() => navigate(`/note/view/${note.note_id}`)}
      >
        View AI Summary
      </button>
      <div className="timestamp__prev__class__lect__page">
        {new Date(note.created_at).toLocaleString()}
      </div>
    </div>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default AudioNotes;

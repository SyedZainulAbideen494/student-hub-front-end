import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            console.log('Fetching notes from server...');
            try {
                const response = await axios.get('http://localhost:8080/api/notes/canvas/get');
                console.log('Response:', response);
                setNotes(response.data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Your Notes</h1>
            {notes.length === 0 ? (
                <p>No notes available.</p>
            ) : (
                <ul>
                    {notes.map(note => (
                        <li key={note.id}>
                            <div>
                                <h3>Note {note.id}</h3>
                                <p>{note.notes.text}</p>
                                {note.image && <img src={note.image} alt={`Drawing ${note.id}`} style={{ width: '200px' }} />}
                                <p>Created at: {new Date(note.created_at).toLocaleString()}</p>
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotesList;


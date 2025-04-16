import React, { useState, useEffect } from 'react';
import { FaStickyNote, FaEye, FaThumbtack, FaTrash } from 'react-icons/fa';
import NoContentCardStickyNote from './nocontentStickyNote';
import './StudyNotes.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import NoContentCardFace from './nocontentcard';

const StudyNotes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', description: '', color: '#ffffff', fontColor: '#000000' });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewNote, setViewNote] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(API_ROUTES.getStickyNotes, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            if (!response.ok) throw new Error('Failed to fetch notes');
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await fetch(API_ROUTES.addStickyNote, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, ...newNote })
            });
            fetchNotes();
            setNewNote({ title: '', description: '', color: '#ffffff', fontColor: '#000000' });
            setModalOpen(false);
        } catch (error) {
            console.error('Failed to add note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_ROUTES.deleteStickyNote}/${noteId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            fetchNotes();
            setViewNote(null);
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

   const togglePinNote = async (noteId) => {
        const token = localStorage.getItem('token');
        const note = notes.find(n => n.id === noteId);
        const updatedNote = { ...note, pinned: !note.pinned }; // Toggle pinned state

        try {
            await fetch(`${API_ROUTES.updateStickyNote}/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, pinned: updatedNote.pinned ? 1 : 0 }) // 1 for pinned, 0 for unpinned
            });
            fetchNotes();
            setSnackbarMessage(updatedNote.pinned ? 'Note pinned!' : 'Note unpinned!');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 3000); // Show for 3 seconds
        } catch (error) {
            console.error('Failed to pin/unpin note:', error);
        }
    };
    

    useEffect(() => {
        fetchNotes();
    }, []);

    const closeModal = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setViewNote(null);
        }
    };

    return (
        <div className='section__home__page__component'>
            <div className="section-header">
                <h2><FaStickyNote /> Sticky Notes</h2>
            </div>

            {loading ? (
                <p>Loading notes...</p>
            ) : (
                <ul className="event-list__home__page__component__sticky__notes">
                {notes.length > 0 ? (
                    notes.sort((a, b) => (b.pinned - a.pinned)) // Sort pinned notes to the top
                         .map((note) => (
<li 
    key={note.id} 
    className="note-item" 
    style={{ backgroundColor: note.color, color: note.fontColor }}
>
    <strong className="note-title">{note.title}</strong>
    <div className="note-actions">
        <button 
            onClick={() => setViewNote(note)} 
            className="view-note-btn"
            style={{ color: note.fontColor }} // Set button color to custom font color
        >
            <FaEye /> 
        </button>
        <button 
            onClick={() => togglePinNote(note.id)} 
            className={`pin-note-btn ${note.pinned ? 'pinned_note_stick' : 'unpinned_note_stick'}`} // Add class based on pin state
            style={{ color: note.pinned ? 'gold' : note.fontColor }} // Color based on pin state
        >
            <FaThumbtack />
        </button>
    </div>
</li>

                         ))
                ) : (
                    <NoContentCardFace />
                )}
                <button 
                    onClick={() => setModalOpen(true)} 
                    className='go-page-home-component-btn'
                >
                    Add Note
                </button>
            </ul>
            )}

            {modalOpen && (
                <div className="modal__create__sticky__note__Section">
                    <div className="modal-content__create__sticky__note__Section">
                        <span 
                            className="close__create__sticky__note__Section" 
                            onClick={() => setModalOpen(false)}
                        >
                            &times;
                        </span>
                        <h2 className="title__create__sticky__note">Add New Note</h2>
                        <form onSubmit={handleAddNote}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                required
                                className="input__create__sticky__note"
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={newNote.description}
                                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                                className="textarea__create__sticky__note"
                            />
                            <div className="color-picker-group__create__sticky__note">
                                <div>
                                    <label>Note Color:</label>
                                    <input
                                        type="color"
                                        value={newNote.color}
                                        onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
                                        className="color-picker__create__sticky__note"
                                    />
                                </div>
                                <div>
                                    <label>Font Color:</label>
                                    <input
                                        type="color"
                                        value={newNote.fontColor}
                                        onChange={(e) => setNewNote({ ...newNote, fontColor: e.target.value })}
                                        className="font-color-picker__create__sticky__note"
                                    />
                                </div>
                            </div>
                            <div className='bookmarkBtn__save__sticky__note-container'>
                                <button className="bookmarkBtn__save__sticky__note">
                                    <span className="IconContainer__save__sticky__note">
                                        <svg viewBox="0 0 384 512" height="0.9em" className="icon__save__sticky__note">
                                            <path
                                                d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"
                                            ></path>
                                        </svg>
                                    </span>
                                    <p className="text__save__sticky__note" type="submit">Save</p>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewNote && (
                <div className="modal__view__note__Section" onClick={() => setViewNote(null)}>
                    <div 
    className="modal-content__view__note__Section" 
    style={{ backgroundColor: viewNote.color, color: viewNote.fontColor }}
    onClick={(e) => e.stopPropagation()}
>
    <span 
        className="close__view__note__Section" 
        onClick={() => setViewNote(null)}
    >
        &times;
    </span>
    <h2>{viewNote.title}</h2>
    <p style={{ whiteSpace: 'pre-wrap' }}>{viewNote.description}</p> {/* Preserve line breaks */}
    <button 
        onClick={() => handleDeleteNote(viewNote.id)} 
        className="delete-note-btn"
        style={{ color: viewNote.fontColor }}
    >
        <FaTrash/>
    </button>
</div>

                </div>
            )}

{snackbarVisible && (
                <div className={`snackbar ${snackbarVisible ? 'show' : ''}`}>
                    {snackbarMessage}
                </div>
            )}
        </div>
    );
};

export default StudyNotes;

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
                <div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  }}
>
  <div
    style={{
      backgroundColor: 'rgba(30, 30, 30, 0.85)',
      padding: '30px',
      borderRadius: '16px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      position: 'relative',
      overflowY: 'auto',
      maxHeight: '90%',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}
  >
    <span
      onClick={() => setModalOpen(false)}
      style={{
        position: 'absolute',
        top: '15px',
        right: '20px',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#ccc',
        cursor: 'pointer',
        transition: 'color 0.3s',
      }}
      onMouseOver={(e) => (e.target.style.color = '#fff')}
      onMouseOut={(e) => (e.target.style.color = '#ccc')}
    >
      &times;
    </span>

    <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: '600', fontSize: '1.8rem', color: '#e0e0e0' }}>
      Add New Note
    </h2>

    <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <input
        type="text"
        placeholder="Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        required
        style={{
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: '#fff',
          fontSize: '1rem',
          outline: 'none',
        }}
      />
      <textarea
        placeholder="Description (optional)"
        value={newNote.description}
        onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
        style={{
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: '#fff',
          fontSize: '1rem',
          outline: 'none',
          minHeight: '100px',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          marginTop: '10px',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>
          <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Note Color</label>
          <input
            type="color"
            value={newNote.color}
            onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
            style={{
              marginTop: '8px',
              width: '48px',
              height: '48px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Font Color</label>
          <input
            type="color"
            value={newNote.fontColor}
            onChange={(e) => setNewNote({ ...newNote, fontColor: e.target.value })}
            style={{
              marginTop: '8px',
              width: '48px',
              height: '48px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#0a84ff',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#006fe6')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#0a84ff')}
        >
          Save
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

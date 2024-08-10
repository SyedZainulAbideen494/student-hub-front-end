import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import './noteDetailsPage.css';

const NoteDetailPage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getNote}/${id}`);
                setNote(response.data);
                setTitle(response.data.title);
                setDescription(response.data.description);
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = response.data.headings; // Set editor content
                }
            } catch (error) {
                setError('Error fetching note details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    useEffect(() => {
        if (editMode && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                    ],
                },
            });

            // Set editor content for editing
            quillRef.current.root.innerHTML = note?.headings || '';
        }
    }, [editMode, note]);

    const handleBackClick = () => {
        nav('/notes');
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this note?');
        if (confirmDelete) {
            try {
                await axios.delete(`${API_ROUTES.deleteNote}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                alert('Note deleted successfully!');
                nav('/notes');
            } catch (error) {
                console.error('Error deleting note:', error);
                alert('Failed to delete note.');
            }
        }
    };

    const handleUpdateClick = async (e) => {
        e.preventDefault();

        const updatedNote = {
            title,
            description,
            headings: quillRef.current.root.innerHTML, // Get editor content
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_ROUTES.updateNote}/${id}`, updatedNote, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Note updated successfully!');
            setEditMode(false);
        } catch (error) {
            console.error('Error updating note:', error);
            alert('Failed to update note.');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!note) return <div className="no-note">No note found.</div>;

    return (
        <div className="note-detail-page">
            <div className="note-header-note-detail-page">
                <button className="back-button-note-detail-page" onClick={handleBackClick}>
                    <span className="arrow-note-detail-page">&#8592;</span> Back
                </button>
                <h1>{editMode ? 'Edit Note' : note.title}</h1>
            </div>
            {editMode ? (
                <form onSubmit={handleUpdateClick} className="edit-note-form">
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group note-content-quill-note-detail-page">
                        <label htmlFor="headings">Content:</label>
                        <div ref={editorRef}></div> {/* Quill editor container */}
                    </div>
                    <button type="submit" className="download-button">Save Changes</button>
                    <button type="button" onClick={handleEditToggle} className="download-button">Cancel</button>
                </form>
            ) : (
                <div className="note-content-note-detail-page">
                    <p className="note-description-note-detail-page">{note.description}</p>
                    <div dangerouslySetInnerHTML={{ __html: note.headings }} />
                </div>
            )}
            <div className="note-actions-note-detail-page">
                <button onClick={handleEditToggle} className="download-button">{editMode ? 'Cancel' : 'Edit'}</button>
                <button onClick={handleDeleteClick} className="download-button">Delete</button>
            </div>
        </div>
    );
};

export default NoteDetailPage;
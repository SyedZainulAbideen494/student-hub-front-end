import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import './noteDetailsPage.css';
import SuccessModal from '../app_modules/SuccessModal'; // Import the SuccessModal component
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const NoteDetailPage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [noteUserId, setNoteUserId] = useState('') 
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
                setNoteUserId(response.data.user_id)
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
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(API_ROUTES.fetchUserProfile, {
                    token: token
                });

                setUserId(response.data.id);
                if (note && response.data.id === noteUserId) {
                    setCanEdit(true);
                } else {
                    setCanEdit(false);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [note]);

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
                setModalMessage('Note deleted successfully!');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    nav('/notes');
                }, 3000); // Close the modal after 3 seconds and then navigate
            } catch (error) {
                console.error('Error deleting note:', error);
                setModalMessage('Failed to delete note.');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 3000); // Close the modal after 3 seconds
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
            await axios.put(`${API_ROUTES.updateNote}/${id}`, updatedNote, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setModalMessage('Note updated successfully!');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000); // Close the modal after 3 seconds
            setEditMode(false);
        } catch (error) {
            console.error('Error updating note:', error);
            setModalMessage('Failed to update note.');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000); // Close the modal after 3 seconds
        }
    };



    const handleDownloadPDF = async () => {
    if (note) {
        const content = document.querySelector('.note-content-note-detail-page');

        // Use html2canvas to capture the content as a canvas
        const canvas = await html2canvas(content, { scale: 2 }); // Increase scale for better quality
        const imgData = canvas.toDataURL('image/png');

        // Create a PDF
        const doc = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add the first page
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if content exceeds one page
        while (heightLeft >= 0) {
            position -= pageHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        const randomNum = Math.floor(1000000 + Math.random() * 9000000);
        const filename = `${note.title}_${randomNum}_eduify.pdf`;
        doc.save(filename);
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
            <div className="note-actions-note-detail-page" style={{textAlign: 'center'}}>
            <button onClick={handleDownloadPDF} className="download-button">Download PDF</button>
            </div>
            {canEdit && (
                <div className="note-actions-note-detail-page">
                    <button onClick={handleEditToggle} className="download-button">{editMode ? 'Cancel' : 'Edit'}</button>
                    <button onClick={handleDeleteClick} className="download-button">Delete</button>
                    
                </div>
            )}
            <SuccessModal visible={showModal} message={modalMessage} />
        </div>
    );
};

export default NoteDetailPage;

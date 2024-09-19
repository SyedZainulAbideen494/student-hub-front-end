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
    const [downloads, setDownloads] = useState(0);  // State to store the download count
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [images, setImages] = useState([]);
    const [noteUserId, setNoteUserId] = useState('') 
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getNote}/${id}`);
                const noteData = response.data;
    
                setNote(noteData);
                setTitle(noteData.title);
                setDescription(noteData.description);
                setDownloads(noteData.downloads || 0);  // Set downloads count
                setNoteUserId(noteData.user_id);
    
                // Assuming images are part of noteData
                setImages(noteData.images || []); // Set images from noteData
    
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = noteData.headings; // Set editor content
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
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const margin = 10;
            let yOffset = margin;
    
            // Function to add content to PDF with handling for page breaks
            const addContent = (htmlElement) => {
                return new Promise((resolve, reject) => {
                    html2canvas(htmlElement, { scale: 2 }).then(canvas => {
                        const imgData = canvas.toDataURL('image/png');
                        const imgWidth = pageWidth - 2 * margin;
                        const imgHeight = canvas.height * imgWidth / canvas.width;
                        const pageHeight = doc.internal.pageSize.height;
    
                        let heightLeft = imgHeight;
                        let position = yOffset;
    
                        doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
    
                        while (heightLeft >= 0) {
                            doc.addPage();
                            position = heightLeft - imgHeight;
                            doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }
    
                        resolve();
                    }).catch(err => reject(err));
                });
            };
    
            // Add content to PDF
            try {
                await addContent(content);
                const randomNum = Math.floor(1000000 + Math.random() * 9000000);
                const filename = `${note.title}_${randomNum}_eduify.pdf`;
                doc.save(filename);

                // Increment download count
                await axios.post(`${API_ROUTES.incrementDownloadCount}/${id}`);
                
                // Update the download count in state after incrementing
                setDownloads(downloads + 1);
            } catch (error) {
                console.error('Error generating PDF or updating download count:', error);
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!note) return <div className="no-note">No note found.</div>;

    return (
        <div className="note-detail-page">
            <div className="note-header-note-detail-page">
                <button className="back-button-note-detail-page" onClick={handleBackClick}>
                    <span className="arrow-note-detail-page">&#8592;</span> 
                </button><br/>
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
                        <div ref={editorRef} id="headings" />
                    </div>
                    <button type="submit" className="save-button">Save Note</button>
                </form>
            ) : (
                <div className="note-content-note-detail-page">
                    <h2>{note.description}</h2>
                    <div dangerouslySetInnerHTML={{ __html: note.headings }} />
                </div>
            )}

            {images.length > 0 && (
                <div className="note-images">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={`${API_ROUTES.getNoteImage}/${image.id}`}
                            alt={`Note Image ${index + 1}`}
                            className="note-image"
                        />
                    ))}
                </div>
            )}

            {canEdit && !editMode && (
                <div className="button-container-note-detail-page">
                    <button className="download-button" onClick={handleEditToggle}>
                        Edit Note
                    </button>
                    <button className="bin__delete__flashacrd__btn">🗑</button>
<div className="div__delete__flashacrd__btn" onClick={handleDeleteClick}>
  <small>
    <i></i>
  </small>
</div>
                </div>
            )}
            <div className="download-container">
                <button className="download-button" onClick={handleDownloadPDF}>Download PDF</button>
                <div className="download-count">
                    <span>Downloads: {downloads}</span> {/* Display download count */}
                </div>
            </div>
            {showModal && <SuccessModal message={modalMessage} />}
        </div>
    );
};

export default NoteDetailPage;

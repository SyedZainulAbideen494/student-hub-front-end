import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './flashCards.css';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GroupModal from './GroupModal';
import { FaSave, FaSearch, FaEye, FaShare } from 'react-icons/fa';
import SuccessModal from '../app_modules/SuccessModal';

const FlashcardsPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFlashcardId, setSelectedFlashcardId] = useState(null);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const nav = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [editingFlashcard, setEditingFlashcard] = useState(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control the SuccessModal visibility
    const [successMessage, setSuccessMessage] = useState(''); // State to store the success message

    const handleEditClick = (id) => {
        const flashcard = notes.find(note => note.id === id);
        setTitle(flashcard.title);
        setDescription(flashcard.description);
        setIsPublic(flashcard.is_public);
        setEditorContent(flashcard.headings);
        setEditingFlashcard(id);
        setEditMode(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('isPublic', isPublic);
        formData.append('token', token);
        formData.append('headings', editorContent);

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            await axios.put(`${API_ROUTES.addFlashCard}/${editingFlashcard}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Flashcard updated successfully!');
            setEditMode(false);
            setEditingFlashcard(null);
            setTitle('');
            setDescription('');
            setImages([]);
            setIsPublic(true);
            setEditorContent('');
            setSuccessMessage('Flashcard updated successfully!');
            setShowSuccessModal(true); // Show the success modal
        } catch (error) {
            console.error('Error updating flashcard:', error);
            alert('Failed to update flashcard.');
        }
    };

    const handleDeleteClick = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this flashcard?');
        if (confirmDelete) {
            try {
                await axios.delete(`${API_ROUTES.addFlashCard}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                alert('Flashcard deleted successfully!');
                setNotes(notes.filter(note => note.id !== id));
            } catch (error) {
                console.error('Error deleting flashcard:', error);
                alert('Failed to delete flashcard.');
            }
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Fetch joined groups
                const joinedResponse = await axios.get(API_ROUTES.fetchJoinedGroups, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJoinedGroups(joinedResponse.data)
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
    
        fetchGroups();
    }, []);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(API_ROUTES.getUserNotes, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNotes(response.data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        const fetchGroups = async () => {
            try {
                const response = await axios.get(API_ROUTES.getUserGroups, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        if (token) {
            fetchNotes();
            fetchGroups();
        }
    }, [token]);

    const handleFileChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('isPublic', isPublic);
        formData.append('token', token);
        formData.append('headings', editorContent);
    
        images.forEach((image) => {
            formData.append('images', image);
        });
    
        try {
            const response = await axios.post(API_ROUTES.addFlashCard, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                // Log success and update state
                console.log('Flashcard saved successfully!');
                setSuccessMessage('Flashcard saved successfully!');
                setShowSuccessModal(true);
                // Clear form inputs
                setTitle('');
                setDescription('');
                setImages([]);
                setIsPublic(true);
                setEditorContent('');
            } else {
                console.error('Failed to save flashcard.');
                alert('Failed to save flashcard.');
            }
        } catch (error) {
            console.error('Error saving flashcard:', error);
            alert('Failed to save flashcard.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery) ||
        note.description.toLowerCase().includes(searchQuery)
    );

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const handleViewClick = (id) => {
        nav(`/note/view/${id}`);
    };

    const handleShareClick = (flashcardId) => {
        console.log('Selected Flashcard ID:', flashcardId); // Check this log
        setSelectedFlashcardId(flashcardId);
        setShowModal(true);
    };
    

    const handleShareToGroup = async (groupId) => {
        try {
            await axios.post(API_ROUTES.shareFlashCard, { id: selectedFlashcardId, groupId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error sharing flashcard:', error);
            alert('Failed to share flashcard.');
        }
        setShowModal(false);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleQuickShare = (platform) => {
        if (!selectedFlashcardId) {
            console.error('No flashcard selected for sharing.');
            return;
        }
        
        const flashcardUrl = `${window.location.origin}/note/view/${selectedFlashcardId}`;
        console.log('Flashcard URL:', flashcardUrl); // Check this log
        
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(flashcardUrl)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(flashcardUrl);
            alert('Link copied to clipboard!');
        }
    };
    

    const safeParseJSON = (jsonString) => {
        try {
            if (!jsonString || jsonString.trim() === '') {
                return [];
            }
            return JSON.parse(jsonString) || [];
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return [];
        }
    };

    return (
        <div className="flashcards-page">
      {showSuccessModal && (
    <div className="modal-overlay-flashcard-save">
        <div className="modal-content-flashcard-save">
            <div className="modal-header-flashcard-save">
                <h2>Success!</h2>
            </div>
            <div className="modal-body-flashcard-save">
                <p>Your flashcard has been successfully created!</p>
            </div>
            <div className="modal-footer-flashcard-save">
                <button className="close-button-flashcard-save" onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
        </div>
    </div>
)}
            <h1>Create Flashcard</h1>
            <form onSubmit={handleSubmit} className="flashcard-form-flashcards-page">
                <div className="form-group-flashcards-page">
                    <label htmlFor="title">Name:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="description">Provide a brief description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="images">Images:</label>
<div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
  <div className="md:flex">
    <div className="w-full p-3">
      <div
        className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
      >
        <div className="absolute flex flex-col items-center">
          <img
            alt="File Icon"
            className="mb-3"
            src="https://img.icons8.com/dusk/64/000000/file.png"
          />
          <span className="block text-gray-500 font-semibold">
            Drag &amp; drop your files here
          </span>
          <span className="block text-gray-400 font-normal mt-1">
            or click to upload
          </span>
        </div>

        <input
          name="file-upload"
          className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          id="images"
          onChange={handleFileChange}
          multiple
        />
      </div>
    </div>
  </div>
  </div>

                </div>
                <div className="form-group-flashcards-page">
  <label htmlFor="isPublic">Public:</label>
  <div>
    <input
      type="checkbox"
      id="isPublic"
      checked={isPublic}
      onChange={(e) => setIsPublic(e.target.checked)}
      style={{ display: 'none' }}
    />
    <label htmlFor="isPublic" className="check__flashcard__public">
      <svg width="18px" height="18px" viewBox="0 0 18 18">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
        <polyline points="1 9 7 14 15 4"></polyline>
      </svg>
    </label>
  </div>
</div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="headings">Content:</label>
                    <ReactQuill
                        value={editorContent}
                        onChange={setEditorContent}
                        modules={quillModules}
                    />
                </div>
                <button type="submit"><FaSave /> Save Flashcard</button>
            </form>
            <div className="search-bar-flashcards-page">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="button"><FaSearch /></button>
            </div>
            <div className="flashcard-list-flashcards-page">
                {filteredNotes.map(note => (
                    <div key={note.id} className="flashcard-item-flashcards-page">
                        <h2>{note.title}</h2>
                        <p>{formatDate(note.created_at)}</p>
                        {note.images && safeParseJSON(note.images).map((image, index) => (
                            <img
                                key={index}
                                src={`/uploads/${image}`}
                                alt={`Flashcard image ${index + 1}`}
                            />
                        ))}
                        <div className="flashcard-actions-flashcards-page">
                            <button onClick={() => handleViewClick(note.id)}><FaEye /> View</button>
                            <button onClick={() => handleShareClick(note.id)}><FaShare /> Share</button>
                        </div>
                    </div>
                ))}
            </div>
            <FooterNav />
            {showModal && (
                <GroupModal
    groups={joinedGroups}
    onClose={() => setShowModal(false)}
    onShare={handleShareToGroup}
    flashcardId={selectedFlashcardId} // Ensure this is set correctly
/>
            )}

        </div>
    );
};
const quillModules = {
  toolbar: {
    container: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }] // Add font color and background color
    ],
    handlers: {
      'background': function(value) {
        const quill = this.quill;
        quill.format('background', value);
      },
      'color': function(value) { // Handler for font color
        const quill = this.quill;
        quill.format('color', value);
      }
    }
  }
};


export default FlashcardsPage
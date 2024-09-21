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


const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
          <label
            htmlFor="file-upload"
            style={{
              display: 'block',
              position: 'relative',
              height: '12rem',
              border: '2px solid #3b82f6',
              backgroundColor: '#ffffff', // White background
              borderRadius: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s ease-in-out',
              textAlign: 'center', // Center the text
              overflow: 'hidden' // Hide overflow to avoid any unwanted display
            }}
            className="flex justify-center items-center hover:shadow-xl"
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <img
                alt="File Icon"
                style={{ marginBottom: '0.75rem' }}
                src="https://img.icons8.com/dusk/64/000000/file.png"
              />
              <span style={{ display: 'block', color: '#6b7280', fontWeight: '600' }}>
                Drag &amp; drop your images here
              </span>
              <span style={{ display: 'block', color: '#9ca3af', marginTop: '0.25rem' }}>
                or click to upload
              </span>
            </div>

            <input
              type="file"
              id="file-upload"
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0',
                opacity: '0',
                cursor: 'pointer'
              }}
              onChange={handleFileChange}
              multiple
            />
          </label>
        </div>
      </div>
    </div>
      {/* Preview selected images */}
      {images.length > 0 && (
                    <div className="image-preview__flashcard__add__images">
                        <h3>Selected Images:</h3>
                        <div className="image-preview-container__flashcard__add__images">
                        {images.map((image, index) => (
            <div key={index} className="image-thumbnail__flashcard__add__images">
                <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected image ${index + 1}`}
                />
                <button
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                >
                    &times; {/* Represents the "x" symbol */}
                </button>
            </div>
        ))}
                        </div>
                    </div>
                )}
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  {filteredNotes.map(note => (
  <div
  key={note.id}
  style={{
    cursor: 'pointer',
    transition: 'all 0.5s',
    transform: 'translateY(0)',
    width: '18rem', // Width remains fixed
    backgroundColor: '#F9FAFB', // Equivalent to bg-neutral-50 in Tailwind
    borderRadius: '0.5rem', // Equivalent to rounded-lg in Tailwind
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Equivalent to shadow-xl in Tailwind
    display: 'flex',
    flexDirection: 'column', // Ensures content and buttons stack vertically
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes content to the top and buttons to the bottom
    gap: '1rem', // Spacing between elements inside the card
    padding: '1rem', // Equivalent to px-4 in Tailwind
    margin: '1rem 0', // Adds vertical spacing between cards
    transform: 'translateY(0)',
    minHeight: '8rem', // Minimum height for the card
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-0.5rem)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
  <svg
  style={{
    stroke: '#A78BFA', // Equivalent to stroke-purple-300 in Tailwind
    flexShrink: 0,
    borderRadius: '50%',
  }}
  height="50"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 24 24"
  width="50"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M19 22H8a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v16a2 2 0 01-2 2zM6 2h1v20H6zM11 5h6M11 9h6M11 13h6"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  />
</svg>

    <div style={{ flexGrow: 1, marginLeft: '1rem' }}>
      <span style={{ fontWeight: 'bold', color: '#A78BFA' }}>{note.title}</span>
      <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {note.description}
      </p>
    </div>
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', marginTop: 'auto' }}>
  <button
    onClick={() => handleViewClick(note.id)}
    className="share__btn__flashcard__card"
    style={{
      fontSize: '14px', // Smaller font size
      padding: '0.6em 1em', // Smaller padding
    }}
  >
    <div className="svg-wrapper-1">
      <div className="svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="currentColor" d="M12 8.5C9.243 8.5 7 10.743 7 13s2.243 4.5 5 4.5 5-2.243 5-4.5S14.757 8.5 12 8.5zM12 15c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM12 4.5C6.261 4.5 1 9.761 1 15s5.261 10.5 11 10.5S23 20.239 23 15 17.739 4.5 12 4.5z"></path>
        </svg>
      </div>
    </div>
    <span>View</span>
  </button>
  <button
    onClick={() => handleShareClick(note.id)}
    className="share__btn__flashcard__card"
    style={{
      fontSize: '14px', // Smaller font size
      padding: '0.6em 1em', // Smaller padding
    }}
  >
    <div className="svg-wrapper-1">
      <div className="svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
        </svg>
      </div>
    </div>
    <span>Send</span>
  </button>
</div>

</div>

  ))}
</div>


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
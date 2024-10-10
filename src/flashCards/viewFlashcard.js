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
import LoadingSpinner from '../app_modules/LoadingSpinner';
import { FaPlus } from 'react-icons/fa';
import NotesPageTutorial from './NotesPageTutorial';

const ViewFlashCard = () => {
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
    const [loading, setLoading] = useState(true); // Loading state
    const [noNotes, setNoNotes] = useState(false); // State for no notes
    const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility

    useEffect(() => {
        // Check local storage for tutorial completion status
        const completed = localStorage.getItem('notesPageTutorialComplete');
        if (completed) {
            setShowTutorial(false); // Set showTutorial to false if found
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false); // Hide tutorial when complete
        localStorage.setItem('notesPageTutorialComplete', 'true'); // Store completion status in local storage
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
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await axios.get(API_ROUTES.getUserNotes, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNotes(response.data);
                setNoNotes(response.data.length === 0); // Check if there are no notes
            } catch (error) {
                console.error('Error fetching notes:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
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



    const handleCraeteFalshCardsClick = () => {
        nav('/notes/create')
      }
      

    return (
            <div className="flashcards-page">
                  {/* Create Button */}
              {/* Button Group */}
              {showTutorial && <NotesPageTutorial onComplete={handleTutorialComplete} />}
      <div className="button-container__main__page__flashcard__page">
        {/* View Button */}
        <button
          className='btn__main__page__flashcard__page active__main__page__flashcard__page'
         
        >
          <FaEye className="btn-icon__main__page__flashcard__page" /> My Notes
        </button>

        {/* Create Button */}
        <button
          className='btn__main__page__flashcard__page'
          onClick={handleCraeteFalshCardsClick}
        >
          <FaPlus className="btn-icon__main__page__flashcard__page" /> Create 
        </button>
      </div>
                {/* Search Bar */}
                <div className="search-bar-flashcards-page">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button type="button"><FaSearch /></button>
                </div>
                
                {/* Loading or No Notes Messages */}
                {loading ? (
                    <div className="loading-message"><LoadingSpinner/></div>
                ) : noNotes ? (
                    <div className="no-notes-message">No notes found. Please create Notes.</div>
                ) : (
                    <div className="flashcard-list-flashcards-page">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.5s',
                                        transform: 'translateY(0)',
                                        width: '18rem',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '1rem',
                                        padding: '1rem',
                                        margin: '1rem 0',
                                        minHeight: '8rem',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-0.5rem)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {/* Note Content */}
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                        <svg
                                            style={{ stroke: '#A78BFA', flexShrink: 0 }}
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
                        {note.description.length > 20 ? note.description.substring(0, 20) + "..." : note.description}
                    </p>
                </div>
                                    </div>
    
                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', marginTop: 'auto' }}>
                                        <button
                                            onClick={() => handleViewClick(note.id)}
                                            className="share__btn__flashcard__card"
                                            style={{ fontSize: '14px', padding: '0.6em 1em' }}
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
                                            style={{ fontSize: '14px', padding: '0.6em 1em' }}
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
                )}
    
                {/* Footer Navigation */}
                <FooterNav />
    
                {/* Group Modal */}
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



export default ViewFlashCard
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
import SubjectModal from './SubjectModal ';  // Create this modal


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
    const [showSubjectModal, setShowSubjectModal] = useState(false); 
    const [activeSection, setActiveSection] = useState('subjects');
    const [subjects, setSubjects] = useState([]);

 
     const handleNotesClick = () => {
         setActiveSection('notes');
     };
 
     const handleSubjectsClick = () => {
         setActiveSection('subjects');
     };
     
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

        const fetchSubjects = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await axios.get(API_ROUTES.fetchsubjects, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSubjects(response.data);
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
            fetchSubjects()
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
        console.log('Selected Flashcard ID:', flashcardId); // Check the log
        setSelectedFlashcardId(flashcardId); // Ensure the flashcardId is set
        setShowModal(true); // Then open the modal
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
      
      const openSubjectModal = () => setShowSubjectModal(true); // Open modal
      const closeSubjectModal = () => setShowSubjectModal(false); // Close modal
  
      const handleCreateSubject = (subjectName) => {
        // Your logic to create the subject goes here
    
        // Close the modal after creating the subject
        closeSubjectModal();
    
        // Refresh the page
        window.location.reload();
    };
    

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
          <FaPlus className="btn-icon__main__page__flashcard__page" /> Create Note
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
                <div className="section-toggle">
                <button 
                    className={`toggle-btn ${activeSection === 'subjects' ? 'active' : ''}`} 
                    onClick={handleSubjectsClick}
                >
                    Subjects
                </button>
                <button 
                    className={`toggle-btn ${activeSection === 'notes' ? 'active' : ''}`} 
                    onClick={handleNotesClick}
                >
                    Notes
                </button>
            </div>
            {activeSection === 'subjects' && (
                <div className="subjects-section">
    {/* Check if there are subjects available */}
    {subjects.length === 0 ? (
        <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    border: '1px solid #E5E7EB', // Softer border color
    borderRadius: '0.75rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
    margin: '1rem', // Space around the message
    maxWidth: '400px', // Limit width to keep it compact
    textAlign: 'center', // Center align content within the box
}}>
    <p style={{
        color: '#4B5563', // Darker gray for better readability
        fontSize: '15px', // Balanced font size
        fontWeight: '600', // Slightly bolder for emphasis
        lineHeight: '1.5', // Improve readability
        marginBottom: '1.5rem', // Increase space below the message
    }}>
        add your first subject.
    </p>
    <button
        onClick={openSubjectModal}
        style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#2563EB', // Deep blue for primary button
            color: 'white', // White text for contrast
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)', // Add subtle button shadow
            transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'} // Darken on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'} // Reset on leave
    >
        Add Subject
    </button>
</div>

    ) : (
        <div className="subject-list">
            {subjects.map(subject => (
              <div
              key={subject.id}
              style={{
                  cursor: 'pointer',
                  transition: 'all 0.5s',
                  transform: 'translateY(0)',
                  width: '18rem',
                  backgroundColor: '#FFFFFF', // White background
                  borderRadius: '25px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center', // Center items horizontally
                  justifyContent: 'center', // Center items vertically
                  gap: '1rem',
                  padding: '10px',
                  margin: '1rem auto', // Center card horizontally with 'auto' margins
                  minHeight: '8rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-0.5rem)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              onClick={() => nav(`/subject/${subject.id}`)} // Navigate to the subject page
          >
              {/* Subject Content */}
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
                          d="M19 0H5C3.3 0 2 1.3 2 3v18c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zm1 21c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v18zm-7-2h-4v-1h4v1zm3-3H9v-1h6v1zm0-3H9v-1h6v1zm0-3H9V8h6v1zm4-6H5v16h14V3z"
                          fill="#A78BFA" // Keep icon color
                      />
                  </svg>
                  <div style={{ flexGrow: 1, marginLeft: '1rem', textAlign: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: '#A78BFA' }}>{subject.name}</span>
                  </div>
              </div>
          </div>
          
            ))}
        </div>
    )}

    <button className='btn__floating__create__note__flashcard__page' onClick={openSubjectModal}>
        <FaPlus className="icon__floating__create__note__flashcard__page" />
    </button>
</div>

            )}
            
            {activeSection === 'notes' && (
  <div className="notes-section">
    {/* Loading or No Notes Messages */}
    {loading ? (
      <div className="loading-message"><LoadingSpinner /></div>
    ) : (
      <>
        {filteredNotes.length === 0 ? (
          <div className="no-notes-message">
            No notes found. Please create Notes. If you have created, please try refreshing the page.
          </div>
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
                    <svg style={{ stroke: '#A78BFA', flexShrink: 0 }} height="50" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 22H8a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v16a2 2 0 01-2 2zM6 2h1v20H6zM11 5h6M11 9h6M11 13h6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>

                    <div style={{ flexGrow: 1, marginLeft: '1rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#A78BFA' }}>{note.title}</span>
                      <p style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {note.description.length > 20 ? note.description.substring(0, 20) + "..." : note.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', marginTop: 'auto' }}>
                    <button onClick={() => handleViewClick(note.id)} className="share__btn__flashcard__card" style={{ fontSize: '14px', padding: '0.6em 1em' }}>
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

                    <button onClick={() => handleShareClick(note.id)} className="share__btn__flashcard__card" style={{ fontSize: '14px', padding: '0.6em 1em' }}>
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
      </>
    )}
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
        flashcardId={selectedFlashcardId} // Pass the selected flashcard ID here
    />
)}

    {showSubjectModal && (
                <SubjectModal
                    onClose={closeSubjectModal}
                    onCreate={handleCreateSubject}
                />
            )}
        </div>
    );
};



export default ViewFlashCard
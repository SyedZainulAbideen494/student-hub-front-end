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
import BookOpenAnimation from '../app_modules/loaders/bookOpen';
import { FaLock } from 'react-icons/fa';

const NoteDetailPage = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [loadingFlashcards, setLoadingFlashcards] = useState(false);
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
    const [subjects, setSubjects] = useState([]);
    const [isPremium, setIsPremium] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(''); // For storing selected subject
    const [loadingMindMap, setLoadingMindMap] = useState(false);
    const navigate = useNavigate();


    // Fetch the subjects on component mount
    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ROUTES.fetchsubjects, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSubjects(response.data); // Assuming response.data is an array of { id, subject }
            setSelectedSubject(response.data.length > 0 ? response.data[0].id : ''); // Set default selected subject to the first one
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
            .then(response => setIsPremium(response.data.premium))
            .catch(() => setIsPremium(false));
        } else {
          setIsPremium(false);
        }
      }, []);

    
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`${API_ROUTES.getNote}/${id}`);
                const noteData = response.data;
    
                setNote(noteData);
                setTitle(noteData.title);
                setDescription(noteData.description);
                setDownloads(noteData.download_count || 0);  // Set downloads count
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

// Define quillModules outside the useEffect for reusability
const quillModules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['clean'],
        [{ color: [] }, { background: [] }] // Add font color and background color
      ],
      handlers: {
        background: function (value) {
          const quill = this.quill;
          quill.format('background', value);
        },
        color: function (value) { // Handler for font color
          const quill = this.quill;
          quill.format('color', value);
        }
      }
    }
  };
  
  // Your useEffect hook
  useEffect(() => {
    if (editMode && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: quillModules,  // Use the predefined quillModules
      });
  
      // Set editor content for editing
      quillRef.current.root.innerHTML = note?.headings || '';
    }
  }, [editMode, note]);

    const handleBackClick = () => {
        nav(-1);
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
                    nav('/notes/view');
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
            subject: selectedSubject, // Add selected subject
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

    const generateQuizFromNotes = async (e) => {
        e.preventDefault();
        setLoadingQuiz(true);
        setError(null);
    
        // Get the note data from the state (assuming note is in setNote)
        const notesContent = note.headings; // Get the note headings directly from the state
        const subject = note.title; // Use note.title as the subject
    
        // Validation check for missing fields
        if (!notesContent || !subject) {
            alert('Please provide notes content and subject before generating the quiz.');
            setLoadingQuiz(false);
            return;
        }
    
        // Clean the HTML from the notes (remove all HTML tags)
        const cleanedNotes = notesContent.replace(/<\/?[^>]+(>|$)/g, "");
    
        // Assuming you have a subject and topic defined, adjust as needed
        const token = localStorage.getItem('token');
        console.log(token);
        const formData = new FormData();
        formData.append('notes', cleanedNotes); // Send cleaned notes
        formData.append('subject', subject); // Send note.title as subject
        formData.append('token', token); // Attach user token for authentication
    
        try {
            // Make a POST request to the backend to generate the quiz
            const response = await fetch(API_ROUTES.generateQuizFromNotes, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to generate quiz from notes, please try again.');
            }
    
            const data = await response.json();
            // Assuming the backend returns a `quizId`
            navigate(`/quiz/${data.quizId}`);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoadingQuiz(false);
        }
    };
    
    
    const generateFlashcardsFromNotes = async (e) => {
        e.preventDefault();
        setLoadingFlashcards(true);
        setError(null);
      
        const token = localStorage.getItem('token');
        const { headings, title: subject } = note; // Extract fields
      
        if (!headings || !subject) {
          alert('Please provide note headings and subject before generating flashcards.');
          setLoadingFlashcards(false);
          return;
        }
      
        const payload = { headings, subject };
      
        try {
          const response = await fetch(API_ROUTES.generateFlashcardsFromNotes, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            throw new Error('Failed to generate flashcards from notes.');
          }
      
          const data = await response.json();
          console.log('Generated Flashcards:', data.flashcards);
          nav(`/flashcard/set/${data.flashcardSetId}`); // Navigate to the newly created set
        } catch (err) {
          console.error('Error:', err);
          setError(err.message);
        } finally {
          setLoadingFlashcards(false);
        }
      };
      
      const generateMindMapFromNotes = async (e) => {
        e.preventDefault();
        setLoadingMindMap(true);
        setError(null);
      
        const token = localStorage.getItem('token');
        const { headings, title: subject } = note; // Extract fields
      
        if (!headings || !subject) {
          alert('Please provide note headings and subject before generating Mindmap.');
          setLoadingFlashcards(false);
          return;
        }
      
        const payload = { headings, subject };
      
        try {
          const response = await fetch(API_ROUTES.generateMindMapFromMagic, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            throw new Error('Failed to generate flashcards from notes.');
          }
      
          const data = await response.json();
          console.log('Generated Flashcards:', data.mindmapId);
          nav(`/mindmap/${data.mindmapId}`); // Navigate to the newly created set
        } catch (err) {
          console.error('Error:', err);
          setError(err.message);
        } finally {
            setLoadingMindMap(false);
        }
      };
      
      
      

    if (loading) return <div 
    className="loading" 
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      position: 'absolute',
      top: '0',
      left: '0'
    }}
  >
    <BookOpenAnimation />
  </div>
  ;
    if (error) return <div className="error">{error}</div>;
    if (!note) return <div className="no-note">No note found.</div>;

    return (
        <div className="note-detail-page">
             

            <div className="note-header-note-detail-page">
                <button className="back-button-note-detail-page" onClick={handleBackClick}>
                    <span className="arrow-note-detail-page">&#8592;</span> 
                </button>
                {isPremium ? (
  <div className="note-btn-container">
    {[
      { label: "Generate Quiz", onClick: generateQuizFromNotes, loading: loadingQuiz },
      { label: "Generate Mind Map", onClick: generateMindMapFromNotes, loading: loadingMindMap },
      { label: "Generate Flashcards", onClick: generateFlashcardsFromNotes, loading: loadingFlashcards },
    ].map(({ label, onClick, loading }, index) => (
      <div key={index} className="centered-button-container__notes__page__Details" style={{ marginTop: index !== 0 ? "8px" : "0px" }}>
        <button className="flashcard__set__page__modal-generate btn__set__page__buttons" disabled={loading} onClick={onClick}>
          <div className={`sparkle__set__page__buttons ${loading ? "animating" : ""}`}>
            <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" className="sparkle__set__page__buttons">
              <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
            <span className="text__set__page__buttons">{loading ? "Generating..." : ` ${label}`}</span>
          </div>
        </button>
      </div>
    ))}
  </div>
) : (
  <div className="note-btn-container__notes__page__Details">
    {["Generate Flashcards", "Generate Mind Map", "Generate Quiz"].map((label, index) => (
      <button key={index} className="action__button__today__ai__pan_overview__locked__premium__" disabled>
        <FaLock className="lock-icon" style={{ marginRight: "10px" }} /> {label} <span>Premium</span>
      </button>
    ))}
  </div>
)}

<br/>
                <h1 style={{textAlign: 'center'}}>{editMode ? 'Edit Note' : note.title}</h1>



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
                    <div className="form-group-flashcards-page" style={{
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.5rem', // Space below the dropdown
    fontFamily: 'Arial, sans-serif', // Font style
}}>
    <label htmlFor="subject" style={{
        fontSize: '1rem',
        color: '#4B5563', // Soft dark gray for the label
        marginBottom: '0.5rem', // Space below the label
    }}>Subject:</label>
    <select
        id="subject"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        style={{
            padding: '0.5rem 1rem', // Padding for a comfortable click area
            borderRadius: '10px', // Rounded corners for cuteness
            border: '1px solid #D1D5DB', // Light border
            backgroundColor: '#FFFBF0', // Soft cream background
            color: '#3B82F6', // Bright blue text
            fontSize: '1rem', // Font size
            fontWeight: '500', // Medium font weight
            cursor: 'pointer', // Pointer cursor on hover
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition
            outline: 'none', // Remove outline on focus
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        }}
        onFocus={(e) => e.target.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.3)'} // Shadow on focus
        onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'} // Reset shadow on blur
    >
        {/* Add "None" option at the top */}
        <option value="0" style={{
            backgroundColor: '#FFFBF0', // Soft background for options
            color: '#3B82F6', // Bright blue text for options
        }}>
            None
        </option>
        {/* Map through subjects */}
        {subjects.map((subject) => (
            <option key={subject.id} value={subject.id} style={{
                backgroundColor: '#FFFBF0', // Soft background for options
                color: '#3B82F6', // Bright blue text for options
            }}>
                {subject.name}
            </option>
        ))}
    </select>
</div>

                    <div className="form-group note-content-quill-note-detail-page">
                        <label htmlFor="headings">Content:</label>
                        <div ref={editorRef} id="headings" />
                    </div>
<button type="submit" className="btn__Save__flashcard btn-1__Save__flashcard">Save Note</button>
                </form>
            ) : (
                <div className="note-content-note-detail-page">
<div
  dangerouslySetInnerHTML={{
    __html: note.headings.replace(/```html|```/g, ''),
  }}
/>
                    
{images.length > 0 && (
                        <div className="image-gallery">
                            {images.map((img, index) => (
                                <img 
                                    key={index}
                                    src={`${API_ROUTES.displayImg}/${img}`} 
                                    alt={`Note image ${index + 1}`}
                                    className="image-item"
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}


            {canEdit && !editMode && (
                <div className="button-container-note-detail-page">
                    <button className="edit-button__edit__flashcard__btn" onClick={handleEditToggle}>
  <svg className="edit-svgIcon__edit__flashcard__btn" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
</button>
                    <button className="button__delete__flashcard" onClick={handleDeleteClick}>
  <svg viewBox="0 0 448 512" className="svgIcon__delete__flashcard"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
</button>
                </div>
            )}
            <div className="download-container">
                <button className="Btn__download-button" onClick={handleDownloadPDF}>
   <svg className="svgIcon__download-button" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
   <span className="icon2__download-button"></span>
   <span className="tooltip__download-button">Downloading</span>
</button>
                <div className="download-count" style={{marginTop: '10px'}}>
                    <span>Downloads: {downloads}</span> {/* Display download count */}
                </div>
            </div>
            {showModal && <SuccessModal message={modalMessage} />}
        </div>
    );
};

export default NoteDetailPage;

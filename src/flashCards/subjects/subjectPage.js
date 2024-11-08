import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for routing
import { API_ROUTES } from '../../app_modules/apiRoutes';
import BookOpenAnimation from '../../app_modules/loaders/bookOpen';

const Subjects = () => {
    const { subjectId } = useParams(); // Get subjectId from URL parameters
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjectName, setSubjectName] = useState(''); // State for subject name
    const [error, setError] = useState('');
    const nav = useNavigate();

    const token = localStorage.getItem('token'); // Assuming you're storing the JWT in local storage

    const fetchFlashcards = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const response = await axios.get(`${API_ROUTES.fetchSubjectNotes}/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Send token for authorization
                },
            });
            setFlashcards(response.data); // Set the fetched flashcards
            if (response.data.length > 0) {
                setSubjectName(response.data[0].subject_name); // Get subject name from response
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            setError('Failed to load flashcards.'); // Handle error
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchFlashcards(); // Fetch flashcards when component mounts
    }, [subjectId]);

    const handleViewClick = (id) => {
        nav(`/note/view/${id}`);
    };

    const handleBackClick = () => {
        nav(`/notes/view/`);
    };

    const handleAddNoteClick = () => {
        nav('/notes/create')
        console.log("Add your first note button clicked");
    };

    const handleDeleteSubject = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this subject?');
        if (!confirmDelete) return; // If user cancels, do nothing

        try {
            await axios.delete(`${API_ROUTES.subjectDelete}/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // Redirect to /notes/view after successful deletion
            nav('/notes/view');
        } catch (error) {
            console.error('Error deleting subject:', error);
            setError('Failed to delete subject.'); // Handle error
        }
    };

    if (loading) return <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: '#F9FAFB'
    }}><BookOpenAnimation/></div>; // Display loading message
    if (error) return <div>{error}</div>; // Display error message

    return (
        <div className="flashcards-page">
            {/* Header Section */}
            <div className="flashcards__subject__header" style={{ display: 'flex', alignItems: 'center', padding: '0.9rem 1rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center', marginBottom:' 50px' }}>
                <button onClick={handleBackClick} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <svg style={{ stroke: '#A78BFA', height: '20', width: '20' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18l-6-6 6-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                </button>
                <h1 style={{ color: 'black', fontSize: '1.25rem', margin: 0 }}>{subjectName || 'Subject'}</h1> {/* Display subject name or default to 'Subject' */}
                <button   style={{
    position: 'absolute',  // Position it absolutely within its container
    top: '10px',           // Adjust for vertical positioning
    right: '10px',         // Adjust for horizontal positioning   // Optional: remove background     // Optional: remove border for cleaner look
    padding: '0px',          // Remove padding for SVG
    cursor: 'pointer'      // Change cursor to pointer on hover
  }} className="button__delete__flashcard" onClick={handleDeleteSubject}>
  <svg viewBox="0 0 448 512" className="svgIcon__delete__flashcard"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
</button>
            </div>

            <div className="flashcards-list">
                {flashcards.length === 0 ? ( // Check if there are no flashcards
                    <div style={{ textAlign: 'center', margin: '2rem' }}>
                        <p>No notes here. Add your first note!</p>
                        <button onClick={handleAddNoteClick} className="btn-add-note" style={{ padding: '0.6em 1em', backgroundColor: '#A78BFA', color: '#FFF', borderRadius: '0.5rem', border: 'none' }}>
                            Add Note
                        </button>
                    </div>
                ) : (
                    flashcards.map((flashcard) => (
                        <div key={flashcard.id} style={{
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
                        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-0.5rem)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>

                            {/* Note Content */}
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                <svg style={{ stroke: '#8bdee9', flexShrink: 0 }} height="50" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="50" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 22H8a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v16a2 2 0 01-2 2zM6 2h1v20H6zM11 5h6M11 9h6M11 13h6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>

                                <div style={{ flexGrow: 1, marginLeft: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'black' }}>{flashcard.title}</span>
                                    <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {flashcard.description.length > 20 ? flashcard.description.substring(0, 20) + "..." : flashcard.description}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', marginTop: 'auto' }}>
                                <button onClick={() => handleViewClick(flashcard.id)} className="share__btn__flashcard__card" style={{ fontSize: '14px', padding: '0.6em 1em' }}>
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Subjects;

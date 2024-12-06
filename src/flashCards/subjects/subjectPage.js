import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for routing
import { API_ROUTES } from '../../app_modules/apiRoutes';
import BookOpenAnimation from '../../app_modules/loaders/bookOpen';
import './subjectPage.css'
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

const Subjects = () => {
    const { subjectId } = useParams(); // Get subjectId from URL parameters
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjectName, setSubjectName] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();

    const token = localStorage.getItem('token');

    const fetchFlashcards = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_ROUTES.fetchSubjectNotes}/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setFlashcards(response.data);
            if (response.data.length > 0) {
                setSubjectName(response.data[0].subject_name);
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            setError('Failed to load flashcards.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcards();
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
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_ROUTES.subjectDelete}/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            nav('/notes/view');
        } catch (error) {
            console.error('Error deleting subject:', error);
            setError('Failed to delete subject.');
        }
    };

    if (loading) return <div className="loading__subject__Page__"><BookOpenAnimation /></div>;
    if (error) return <div className="error__subject__Page__">{error}</div>;

    return (
        <div className="flashcards__subject__Page__">
            {/* Header Section */}
            <div className="flashcards__subject__header__subject__Page__">
    <button onClick={handleBackClick} className="back__btn__subject__Page__">
        <FaArrowLeft />
    </button>
    <h1 className="subject__title__subject__Page__">{subjectName || 'Subject'}</h1>
    <button className="delete__btn__subject__Page__" onClick={handleDeleteSubject}>
        <FaTrash />
    </button>
</div>


            <div className="flashcards-list__subject__Page__">
                {flashcards.length === 0 ? (
                    <div className="no-notes__subject__Page__">
                        <p>No notes here. Add your first note!</p>
                        <button onClick={handleAddNoteClick} className="add-note__btn__subject__Page__">Add Note</button>
                    </div>
                ) : (
                    flashcards.map((flashcard) => (
                        <div key={flashcard.id} className="flashcard__card__subject__Page__" onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-0.5rem)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="flashcard__content__subject__Page__">
                                <svg className="flashcard__icon__subject__Page__" height="50" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="50" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 22H8a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v16a2 2 0 01-2 2zM6 2h1v20H6zM11 5h6M11 9h6M11 13h6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                                <div className="flashcard__details__subject__Page__">
                                    <span className="flashcard__title__subject__Page__">{flashcard.title}</span>
                                    <p className="flashcard__description__subject__Page__">
                                        {flashcard.description.length > 20 ? flashcard.description.substring(0, 20) + "..." : flashcard.description}
                                    </p>
                                </div>
                            </div>

<div className='flashcard__actions__subject__Page__'>

                            <button onClick={() => handleViewClick(flashcard.id)}  className="button__view__btn__subject__page">
      View
      <div className="hoverEffect__view__btn__subject__page">
        <div></div>
      </div>
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

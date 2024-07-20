import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './flashCards.css';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FlashcardsPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const nav = useNavigate();

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

        if (token) {
            fetchNotes();
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
            await axios.post(API_ROUTES.addFlashCard, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Flashcard saved successfully!');
            setTitle('');
            setDescription('');
            setImages([]);
            setIsPublic(true);
            setEditorContent('');
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

    const handleShareClick = async (id) => {
        const siteURL = 'https://dropment.online';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out Dropment!',
                    text: `Discover cool motivational clips and download them for free to grow your Instagram page at Dropment.`,
                    url: siteURL
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            const shareText = `Check out Dropment: Discover cool motivational clips and download them for free to grow your Instagram page at ${siteURL}`;
            const shareURL = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
            window.location.href = shareURL;
        }
    };

    const safeParseJSON = (jsonString) => {
        try {
            // Ensure jsonString is valid and parseable
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
            <h1>Create Flashcard</h1>
            <form onSubmit={handleSubmit} className="flashcard-form-flashcards-page">
                <div className="form-group-flashcards-page">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="images">Images:</label>
                    <input
                        type="file"
                        id="images"
                        onChange={handleFileChange}
                        multiple
                    />
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="isPublic">Public:</label>
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="headings">Content:</label>
                    <ReactQuill
                        value={editorContent}
                        onChange={setEditorContent}
                        modules={quillModules}
                    />
                </div>
                <button type="submit">Save Flashcard</button>
            </form>
            <div className="search-bar-flashcards-page">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
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
                            <button onClick={() => handleViewClick(note.id)}>View</button>
                            <button onClick={() => handleShareClick(note.id)}>Share</button>
                        </div>
                    </div>
                ))}
            </div>
            <FooterNav />
        </div>
    );
};

const quillModules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['clean']
    ],
};

export default FlashcardsPage;
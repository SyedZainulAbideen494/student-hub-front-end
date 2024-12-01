import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './ResourcesPage.css';
import { API_ROUTES } from '../../app_modules/apiRoutes';

const ResourcesPage = ({ onBack }) => {
    const { roomId } = useParams(); // Correctly destructure roomId from useParams
    const [activeTab, setActiveTab] = useState('all');
    const [resources, setResources] = useState([]);
    const nav = useNavigate();

    // Fetch resources based on the active tab and roomId
    const fetchResources = async () => {
        try {
            const response = await fetch(API_ROUTES.fetchRoomResources, {
                method: 'POST', // Change to POST request
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify({
                    roomId: roomId, // Send roomId
                    type: activeTab, // Send activeTab as type
                }),
            });
            const data = await response.json();
            setResources(data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [activeTab, roomId]); // Re-fetch when activeTab or roomId changes

    const handleAttendQuiz = (quizId) => {
        window.location.href = `/quiz/${quizId}`;
    };

    const handleViewNote = (noteId) => {
        window.location.href = `/note/view/${noteId}`;
    };

    const handleBack = () => {
        nav(-1);
    };

    // Sort resources by created_at in descending order (most recent first)
    const sortedResources = [...resources].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="resources-page__resources__page__rooms">
            <div className="header__resources__page__rooms">
                <button className="back-btn__resources__page__rooms" onClick={handleBack}>
                    <FaArrowLeft />
                </button>
                <h2 className="header-title__resources__page__rooms">Resources</h2>
            </div>

            <div className="toggle-buttons__resources__page__rooms">
                <button
                    className={`toggle-btn__resources__page__rooms ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All
                </button>
                <button
                    className={`toggle-btn__resources__page__rooms ${activeTab === 'note' ? 'active' : ''}`}
                    onClick={() => setActiveTab('note')}
                >
                    Notes
                </button>
                <button
                    className={`toggle-btn__resources__page__rooms ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    Quizzes
                </button>
            </div>

            <div className="resources-list__resources__page__rooms">
                {sortedResources.length > 0 ? (
                    sortedResources.map((resource) => (
                        <div key={resource.resource_id} className="resource-item__resources__page__rooms">
                            <h3>{resource.title}</h3>
                            <p>Shared by {resource.user_name}</p>

                            <div className="resource-buttons-container">
                                {resource.type === 'quiz' && (
                                    <button
                                        className="attend-btn__resources__page__rooms"
                                        onClick={() => handleAttendQuiz(resource.resource_id)}
                                    >
                                        Attend Quiz
                                    </button>
                                )}
                                {resource.type === 'note' && (
                                    <button
                                        className="view-btn__resources__page__rooms"
                                        onClick={() => handleViewNote(resource.resource_id)}
                                    >
                                        View Note
                                    </button>
                                )}
                            </div>

                            <p className="created-at__resources__page__rooms">
                                {new Date(resource.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="no-resources__resources__page__rooms">No resources available.</p>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;

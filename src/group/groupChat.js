import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupChat.css'; // Import CSS file for styling
import { API_ROUTES } from '../app_modules/apiRoutes';
import GroupDetailModal from './GroupDetails';
import SuccessModal from '../app_modules/SuccessModal';

const DiscussionBoard = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [groupDetails, setGroupDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [flashcardDetailsMap, setFlashcardDetailsMap] = useState({});
    const [userNameMap, setUserNameMap] = useState({});
    const [memberCount, setMemberCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isMember, setIsMember] = useState(null); // Null means not checked yet

    const messagesEndRef = useRef(null); // Ref for the end of the messages container

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                // Check user membership
                await checkUserMembership();

                if (isMember === null) return; // Wait for the membership check to complete

                if (!isMember) {
                    // User is not a member, show an appropriate message
                    return;
                }

                // Fetch group details if the user is a member
                const response = await axios.get(`${API_ROUTES.getGroupDetailsById}/${id}`);
                setGroupDetails(response.data);
                setMessages(response.data.messages);

                const flashcardIds = response.data.messages
                    .filter(message => message.type === 'flashcard')
                    .map(message => message.content);

                const flashcardDetails = await Promise.all(
                    flashcardIds.map(flashcardId =>
                        axios.get(`${API_ROUTES.getNote}/${flashcardId}`).then(res => ({
                            id: flashcardId,
                            details: res.data
                        }))
                    )
                );

                const flashcardDetailsMap = flashcardDetails.reduce((acc, { id, details }) => {
                    acc[id] = details;
                    return acc;
                }, {});

                setFlashcardDetailsMap(flashcardDetailsMap);

                const userIds = response.data.messages
                    .map(message => message.sender);

                const uniqueUserIds = [...new Set(userIds)];

                const userNames = await Promise.all(
                    uniqueUserIds.map(userId => {
                        const token = localStorage.getItem('token');
                        return axios.get(`${API_ROUTES.getUserByToken}/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                            params: { userId }
                        }).then(res => ({
                            userId,
                            userName: res.data.user_name
                        }));
                    })
                );

                const userNameMap = userNames.reduce((acc, { userId, userName }) => {
                    acc[userId] = userName;
                    return acc;
                }, {});

                setUserNameMap(userNameMap);

                // Fetch member count
                const memberCountResponse = await axios.get(`${API_ROUTES.getGroupMemberCount}/${id}`);
                setMemberCount(memberCountResponse.data.memberCount);

                // Fetch group members
                const memberResponse = await axios.get(`${API_ROUTES.getGroupMembers}/${id}`);
                setMembers(memberResponse.data.members);

            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [id, isMember]);

    useEffect(() => {
        // Scroll to the bottom of the messages container when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const checkUserMembership = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_ROUTES.checkUserMembership}`, { 
                token, 
                groupId: id 
            });

            if (response.data.isMember) {
                setIsMember(true);
            } else {
                setIsMember(false);
            }
        } catch (error) {
            console.error('Error checking user membership:', error);
            setIsMember(false);
        }
    };

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_ROUTES.sendGroupMessages}/${id}`,
                { content: newMessage, type: 'message' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, { content: newMessage, sender: 'Me', type: 'message' }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBackBtn = () => {
        nav('/groups');
    };

    const handleOpenFlashcard = (flashcardId) => {
        nav(`/note/view/${flashcardId}`);
    };

    const handleOpenQuiz = (quizId) => {
        nav(`/quiz/${quizId}`);
    };

    const handleGroupDetailsBtn = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInviteMembers = async (phoneNumber) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_ROUTES.inviteMemberToGroup}/${id}`, { phoneNumber }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage('Invitation sent successfully.');
            setIsSuccessModalVisible(true);
            setTimeout(() => {
                setIsSuccessModalVisible(false);
            }, 3000);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'An error occurred while sending the invitation.');
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    return (
        <div className="discussion-group-container">
            {isMember === null ? (
                <p>Loading...</p> // Show a loading message while checking membership
            ) : isMember ? (
                <>
                    <header className="discussion-header" onClick={handleGroupDetailsBtn}>
                        <button className="back-button" onClick={handleBackBtn}>←</button>
                        <div className="group-info">
                            <h2 className="group-name">{groupDetails?.name}</h2>
                            <span className="member-count">{memberCount} Members</span>
                        </div>
                    </header>
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div key={index} className="message">
                                <div className="message-header">
                                    <span className="message-sender">{userNameMap[message.sender] || 'Unknown'}</span>
                                    <span className="message-timestamp">{new Date(message.created_at).toLocaleString()}</span>
                                </div>
                                {message.type === 'flashcard' ? (
                                    <div className="flashcard-message-card">
                                        <div className="flashcard-header">
                                            <h3>{flashcardDetailsMap[message.content]?.title || 'Flashcard'}</h3>
                                        </div>
                                        <div className="flashcard-content">
                                            <button className="open-flashcard-button" onClick={() => handleOpenFlashcard(message.content)}>
                                                Open Flashcard
                                            </button>
                                        </div>
                                    </div>
                                ) : message.type === 'quiz' ? (
                                    <div className="quiz-message-card">
                                        <div className="quiz-header">
                                            <h3>Quiz</h3>
                                        </div>
                                        <div className="quiz-content">
                                            <button className="open-flashcard-button" onClick={() => handleOpenQuiz(message.content)}>
                                                Take Quiz
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="message-content">{message.content}</div>
                                )}
                            </div>
                        ))}
                        {/* Scroll to bottom */}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="message-input-container">
                        <input
                            type="text"
                            className="message-input"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button className="send-button" onClick={handleSendMessage}>Send</button>
                    </div>

                    {/* Render modal if showModal is true */}
                    {showModal && (
                        <GroupDetailModal
                            groupDetails={groupDetails}
                            members={members}
                            onClose={handleCloseModal}
                            onInvite={handleInviteMembers}
                        />
                    )}

                    {/* Render success modal if isSuccessModalVisible is true */}
                    {isSuccessModalVisible && (
                        <SuccessModal message={successMessage} onClose={closeSuccessModal} />
                    )}
                </>
            ) : (
                <p>You are not a member of this group.</p>
            )}
        </div>
    );
};

export default DiscussionBoard;
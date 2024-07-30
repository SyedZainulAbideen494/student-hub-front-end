import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupChat.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import GroupDetailModal from './GroupDetails';
import SuccessModal from '../app_modules/SuccessModal';
import { FaArrowLeft, FaBook, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

const DiscussionBoard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [groupDetails, setGroupDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [replyToMessageId, setReplyToMessageId] = useState(null);
    const [flashcardDetailsMap, setFlashcardDetailsMap] = useState({});
    const [userNameMap, setUserNameMap] = useState({});
    const [memberCount, setMemberCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isMember, setIsMember] = useState(null);
    const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null); // Track the last message timestamp

    const inputRef = useRef(null); // Create a ref for the input
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                await checkUserMembership();

                if (isMember === null) return;

                if (!isMember) return;

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
                            headers: { Authorization: `Bearer ${token}` }
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

                const memberCountResponse = await axios.get(`${API_ROUTES.getGroupMemberCount}/${id}`);
                setMemberCount(memberCountResponse.data.memberCount);

                const memberResponse = await axios.get(`${API_ROUTES.getGroupMembers}/${id}`);
                setMembers(memberResponse.data.members);

                // Set initial timestamp for polling
                if (response.data.messages.length > 0) {
                    const lastMessage = response.data.messages[response.data.messages.length - 1];
                    setLastMessageTimestamp(new Date(lastMessage.created_at).toISOString());
                }

            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [id, isMember]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(); // Automatically scroll to bottom without smooth animation
    }, [messages]);

    useEffect(() => {
        const pollMessages = async () => {
            if (isMember) {
                try {
                    const response = await axios.get(`${API_ROUTES.getGroupDetailsById}/${id}`, {
                        params: { after: lastMessageTimestamp } // Fetch messages after the last message timestamp
                    });
                    const newMessages = response.data.messages;

                    if (newMessages.length > 0) {
                        setMessages(prevMessages => [...prevMessages, ...newMessages]);
                        const lastMessage = newMessages[newMessages.length - 1];
                        setLastMessageTimestamp(new Date(lastMessage.created_at).toISOString());
                    }
                } catch (error) {
                    console.error('Error polling messages:', error);
                }
            }
        };

        // Poll every 5 seconds
        const intervalId = setInterval(pollMessages, 2500);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [id, isMember, lastMessageTimestamp]);

    const checkUserMembership = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_ROUTES.checkUserMembership}`, { 
                token, 
                groupId: id 
            });

            setIsMember(response.data.isMember);
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
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSendReply = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_ROUTES.sendGroupMessages}/${id}`,
                { content: replyMessage, type: 'message', parentId: replyToMessageId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReplyMessage('');
            setReplyToMessageId(null);
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    useEffect(() => {
        if (replyToMessageId) {
            inputRef.current?.scrollIntoView(); // Scroll input into view when replying
        }
    }, [replyToMessageId]);

    const handleBackBtn = () => {
        navigate('/groups');
    };

    const handleOpenFlashcard = (flashcardId) => {
        navigate(`/note/view/${flashcardId}`);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const showSuccessModal = (message) => {
        setSuccessMessage(message);
        setIsSuccessModalVisible(true);
        setTimeout(() => {
            setIsSuccessModalVisible(false);
        }, 2000);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    const handleInviteMembers = async (phoneNumber) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_ROUTES.inviteMemberToGroup}/${id}`, { phoneNumber }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showSuccessModal('Invitation sent successfully.');
        } catch (error) {
            console.error('Error sending invitation:', error);
        }
    };

    const handleGroupDetailsBtn = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    return (
        <div className="group-chat">
            <div className="group-header">
                <button className="header-btn" onClick={handleBackBtn}><FaArrowLeft /></button>
                <h1 onClick={openModal}>{groupDetails ? groupDetails.name : 'Loading...'}</h1>
            </div>
            {isMember === false ? (
                <div className="not-a-member">
                    <p>You are not a member of this group. Join to view and participate in the discussion.</p>
                </div>
            ) : (
                <div className="group-chat-container">
                    <div className="messages-container">
                        {messages.map(message => (
                            <div className="message-card" key={message.id}>
                                <div className="message-header">
                                    <strong>{userNameMap[message.sender] || 'Unknown'}</strong>
                                </div>
                                <div className="message-content">
                                    <p>{message.type === 'flashcard' ? (
                                        <button onClick={() => handleOpenFlashcard(message.content)}>
                                            {flashcardDetailsMap[message.content]?.title || 'Flashcard'}
                                        </button>
                                    ) : (
                                        message.content
                                    )}</p>
                                </div>
                                {message.replies && message.replies.length > 0 && (
                                    <div className="replies-container">
                                        {message.replies.map(reply => (
                                            <div className="reply-card" key={reply.id}>
                                                <div className="reply-header">
                                                    <strong>{userNameMap[reply.sender] || 'Unknown'}</strong>
                                                </div>
                                                <div className="reply-content">
                                                    {reply.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div>
                                    <button className="reply-btn" onClick={() => setReplyToMessageId(message.id)}>Reply</button>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="message-input-container">
                        {replyToMessageId ? (
                            <div className="reply-section">
                                <button onClick={() => setReplyToMessageId(null)}>
                                    <FaArrowLeft />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type your reply..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    ref={inputRef}
                                />
                                <button onClick={handleSendReply}>Send Reply</button>
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                ref={inputRef}
                            />
                        )}
                        <button className='send-btn' onClick={replyToMessageId ? handleSendReply : handleSendMessage}>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            )}
            {showModal && (
                <GroupDetailModal
                    onClose={handleCloseModal}
                    groupDetails={groupDetails}
                    onInviteMember={handleInviteMembers}
                    onQuizClick={handleOpenQuiz}
                    onSuccessMessage={showSuccessModal}
                />
            )}
            {isSuccessModalVisible && (
                <SuccessModal
                    onClose={closeSuccessModal}
                    message={successMessage}
                />
            )}
        </div>
    );
};

export default DiscussionBoard;

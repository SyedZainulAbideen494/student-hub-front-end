import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupChat.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import GroupDetailModal from './GroupDetails';
import SuccessModal from '../app_modules/SuccessModal';
import Message from './Message';
import MessageInput from './MessageInput';
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        const intervalId = setInterval(pollMessages, 5000);

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
      
          // Scroll input into view and trigger animation
          if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            inputRef.current.classList.add('input-animate');
            // Remove animation class after 0.5 seconds
            setTimeout(() => {
              inputRef.current.classList.remove('input-animate');
            }, 500);
          }
        } catch (error) {
          console.error('Error sending reply:', error);
        }
    };

    useEffect(() => {
        if (replyToMessageId) {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
          <div className="header">
            <button onClick={handleBackBtn} className="back-btn">
              <FaArrowLeft />
            </button>
            <h1>{groupDetails?.name || 'Loading...'}</h1>
            <button onClick={handleGroupDetailsBtn} className="details-btn">
              Details
            </button>
            <button onClick={openModal} className="members-btn">
              Members ({memberCount})
            </button>
          </div>
      
          <div className="chat-box">
            <div className="message-list">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  userName={userNameMap[message.sender]}
                  flashcardDetails={flashcardDetailsMap[message.content]}
                  onReplyClick={() => setReplyToMessageId(message.id)}
                  onFlashcardClick={() => handleOpenFlashcard(message.content)}
                  onQuizClick={() => handleOpenQuiz(message.content)}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
      
            <div className="message-input-container">
              <MessageInput
                value={replyToMessageId ? replyMessage : newMessage}
                onChange={(e) => replyToMessageId ? setReplyMessage(e.target.value) : setNewMessage(e.target.value)}
                onSend={replyToMessageId ? handleSendReply : handleSendMessage}
                ref={inputRef}
              />
            </div>
          </div>
      
          {showModal && (
            <GroupDetailModal
              groupDetails={groupDetails}
              members={members}
              onInviteMembers={handleInviteMembers}
              onClose={handleCloseModal}
            />
          )}
      
          {isSuccessModalVisible && (
            <SuccessModal message={successMessage} onClose={closeSuccessModal} />
          )}
        </div>
    );
};

export default DiscussionBoard;
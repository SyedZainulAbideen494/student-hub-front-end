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
    const nav = useNavigate()
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

            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [id, isMember]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            setMessages([...messages, { content: newMessage, sender: 'Me', type: 'message' }]);
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
          setMessages(messages.map(message => 
            message.id === replyToMessageId 
            ? { ...message, replies: [...message.replies, { content: replyMessage, sender: 'Me', type: 'message' }] }
            : message
          ));
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
      
      // Scroll input into view when replyToMessageId changes
      useEffect(() => {
        if (replyToMessageId) {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, [replyToMessageId]);

    const handleBackBtn = () => {
        navigate('/groups');
    };

    const handleOpenFlashcard = (flashcardId) => {
        navigate(`/note/${flashcardId}`);
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
        nav(`/quiz/${quizId}`);
    };

    return  (
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
                      <p>{message.content}</p>
                      {message.type === 'flashcard' && (
                        <button className="flashcard-btn" onClick={() => handleOpenFlashcard(message.content)}>
                          <FaBook /> Open Flashcard
                        </button>
                      )}
                      {message.type === 'quiz' && (
                        <button className="quiz-btn" onClick={() => handleOpenQuiz(message.content)}>
                          <FaQuestionCircle /> Take Quiz
                        </button>
                      )}
                    </div>
                    <div className="replies-container">
                      {message.replies && message.replies.map(reply => (
                        <div key={reply.id} className="reply">
                          <strong>{userNameMap[reply.sender] || 'Unknown'}</strong>
                          <p>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                    <button className="reply-btn" onClick={() => setReplyToMessageId(message.id)}>Reply</button>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="message-input-container">
  <input
    ref={inputRef} // Attach ref here
    type="text"
    value={replyToMessageId ? replyMessage : newMessage}
    onChange={e => replyToMessageId ? setReplyMessage(e.target.value) : setNewMessage(e.target.value)}
    placeholder={replyToMessageId ? "Type your reply here..." : "Type your message here..."}
    className="input-field" // Updated class name for the input
  />
  <button 
    className={replyToMessageId ? "reply-btn-input-sedn" : "send-btn"} // Conditional class for button
    onClick={replyToMessageId ? handleSendReply : handleSendMessage}
  >
    <FaArrowRight />
  </button>
</div>
            </div>
          )}
          {showModal && (
            <GroupDetailModal
              groupDetails={groupDetails}
              members={members}
              onClose={handleCloseModal}
              onInvite={handleInviteMembers}
            />
          )}
          <SuccessModal
            isOpen={isSuccessModalVisible}
            onRequestClose={closeSuccessModal}
            message={successMessage}
          />
        </div>
      );
};

export default DiscussionBoard;
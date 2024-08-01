import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GroupDetails.css'; // Import CSS for styling
import { API_ROUTES } from '../app_modules/apiRoutes';
import SuccessModal from '../app_modules/SuccessModal'; // Import SuccessModal for success messages
import { Link } from 'react-router-dom';

const GroupDetailPage = () => {
    const { id } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [memberCount, setMemberCount] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                // Fetch group details
                const response = await axios.get(`${API_ROUTES.getGroupDetailsById}/${id}`);
                setGroupDetails(response.data);

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
    }, [id]);

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleInvite = async () => {
        if (!phoneNumber) {
            setErrorMessage('Phone number is required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_ROUTES.inviteMemberToGroup}/${id}`,
                { phoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPhoneNumber('');
            setErrorMessage('');
            setSuccessMessage('Invitation sent successfully.');
            setIsSuccessModalVisible(true);

            // Hide success modal after 3 seconds
            setTimeout(() => {
                setIsSuccessModalVisible(false);
            }, 3000);

        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    if (!groupDetails) return <div>Loading...</div>;

    return (
<div className="group-detail-page">
    <header className="page-header">
        <button className="back-button" onClick={() => window.history.back()}>&larr;</button><br/><br/><br/>
        <h1>{groupDetails.name}</h1>
        <p>{groupDetails.description}</p>
        <p>Status: {groupDetails.is_public ? 'Public' : 'Private'}</p>
    </header>

    <section className="members-section">
        <div className="card">
            <h3 className="section-heading">Members ({memberCount})</h3>
            <div className="members-container">
                {members.length > 0 ? (
                    members.map(member => (
                        <div key={member.id} className="member-card">
                            <p className="member-name">{member.user_name}</p>
                        </div>
                    ))
                ) : (
                    <p>No members yet.</p>
                )}
            </div>
        </div>
    </section>

    <section className="invite-section">
        <div className="card">
            <h3 className="section-heading">Invite Members</h3>
            <div className="invite-input-container">
                <input
                    type="text"
                    className="invite-input"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter phone number"
                />
                <button className="invite-button" onClick={handleInvite}>Invite Members</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    </section>

    <footer className="page-footer">
        <p className="quote">"Empowering connections, one group at a time."</p>
        <p className="copyright">© 2024 Edusify. All rights reserved.</p>
    </footer>

    {isSuccessModalVisible && (
        <SuccessModal
            onClose={closeSuccessModal}
            message={successMessage}
        />
    )}
</div>
    );
};

export default GroupDetailPage;
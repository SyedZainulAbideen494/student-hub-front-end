// GroupsGuidePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const GroupsGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Collaborative Study Groups</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Boost your learning by collaborating with peers using Edusify's Study Groups feature!</p>
        </section>
        <section className="blog-content-help-page">
          <h3>Getting Started with Study Groups</h3>
          <ol>
            <li>
              <strong>Navigate to the Groups Page:</strong> Click on the "Groups" tab in the navigation bar below to access the Groups page. You will see a header with the "Groups" title and a search bar to search for either joined groups or public groups you can join.
            </li>
            <li>
              <strong>Create a New Group:</strong> To create a new group, click the "+" icon next to the search bar on the top header. This will open the "Create Group" component.
              <ul>
                <li>Fill in the <strong>Group Name</strong> and add a description about the group.</li>
                <li>Select whether the group is <strong>Public</strong> or <strong>Private</strong>. If you check the box, the group will be public; otherwise, it will remain private.</li>
                <li>Click the "Create Group" button to create your group.</li>
              </ul>
            </li>
            <li>
              <strong>Join a Public Group:</strong> Click on the "Public Group" button next to "Joined Group" to see all available public groups. You can search by name and click the "Join" button to join them.
            </li>
          </ol>

          <h3>Features within Groups</h3>
          <ul>
            <li>Share flashcards created using Edusify.</li>
            <li>Share quizzes created on Edusify.</li>
            <li>Chat with your friends and group members.</li>
          </ul>

          <h3>Inviting Members to Your Group</h3>
          <p>
            To invite someone to your group, click on the group name to be redirected to the group's page. At the bottom, you will find an option to invite members. Enter the mobile number of the user you wish to invite (the number they used while creating their Edusify account), and click "Invite".
          </p>
          <ul>
            <li>If the user is already in the group, they will not receive an invitation.</li>
            <li>If the user does not have an Edusify account, you won't be able to invite them.</li>
            <li>If the group is private and you are not the admin, you cannot invite users.</li>
          </ul>

          <h3>Managing Group Invitations</h3>
          <p>
            To accept or decline group invitations, go to the "Invitations" button next to the "Public Group" button. You will see all your pending invitations there.
          </p>
        </section>

        <section className="blog-tips-help-page">
          <h3>Tips for Using Study Groups Effectively</h3>
          <ul>
            <li>Create groups for specific subjects or projects to focus your discussions.</li>
            <li>Use the search functionality to find groups that match your interests.</li>
            <li>Encourage group members to actively participate by sharing resources and organizing study sessions.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default GroupsGuidePage;

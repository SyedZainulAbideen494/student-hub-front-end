// NotesFlashcardsGuidePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const NotesFlashcardsGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Notes & Flashcards</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Create and manage your notes and flashcards to enhance your learning experience with Edusify!</p>
        </section>
        <section className="blog-content-help-page">
          <h3>Creating Notes</h3>
          <ol>
            <li>
              <strong>Navigate to the Notes Page:</strong> Click on "Notes" in the navigation bar below to access the Notes page.
            </li>
            <li>
              <strong>Create a New Note:</strong> On the top section of the Notes page, you'll see the "Create Note" section.
              <ul>
                <li>Enter a <strong>Title</strong> and <strong>Description</strong> for your note.</li>
                <li>Add images if needed in the <strong>Add Images</strong> section.</li>
                <li>Type out your notes in the <strong>Content</strong> section. You can use headers (H1, H2), normal text, lists (ordered and unordered), bold text, and other styling options to format your notes beautifully.</li>
                <li>If you check the <strong>Public</strong> checkbox, your note will be visible to everyone who views your profile. If not checked, only people you share it with can see it.</li>
                <li>Click the "Save Note" button to save your note.</li>
              </ul>
            </li>
            <li>
              <strong>View and Share Notes:</strong> Below the "Create Note" section, you will see all previously created notes with their titles and creation times. Each note has two buttons:
              <ul>
                <li><strong>View:</strong> View the full content of the note.</li>
                <li><strong>Share:</strong> Share the note with others or on Edusify groups.</li>
              </ul>
            </li>
          </ol>

          <h3>Creating Flashcards</h3>
          <ol>
            <li>
              <strong>Navigate to Flashcards:</strong> Go to the "Create Flashcard" section.
            </li>
            <li>
              <strong>Create a Flashcard:</strong>
              <ul>
                <li>Enter a <strong>Title</strong> for the flashcard.</li>
                <li>Provide a <strong>Description</strong> about what the flashcard contains.</li>
                <li>Optionally, add images in the <strong>Add Images</strong> section.</li>
                <li>In the <strong>Content</strong> section, type out your notes. You can use headers, normal text, lists (ordered and unordered), bold text, and other styling options to format your flashcards effectively.</li>
                <li>If you check the <strong>Public</strong> checkbox, your flashcard will be visible to everyone who views your profile. If not checked, only people you share it with can see it.</li>
                <li>Click the "Save Flashcard" button to save your flashcard.</li>
              </ul>
            </li>
          </ol>

          <h3>Sharing and Exporting Notes and Flashcards</h3>
          <ul>
            <li>Share your notes or flashcards on Edusify groups by following the link to the <a href="/collaborative-study-groups-guide/guide" className="feature-link-help-page">Groups Guide</a>.</li>
            <li>You can also download your notes as a PDF for offline access or sharing.</li>
          </ul>
        </section>

        <section className="blog-tips-help-page">
          <h3>Tips for Creating Effective Notes and Flashcards</h3>
          <ul>
            <li>Use headers and bullet points to organize your notes clearly.</li>
            <li>Add images and diagrams to make your notes more engaging and easier to understand.</li>
            <li>Regularly review and update your notes to keep them relevant and useful.</li>
            <li>Share notes and flashcards with your study groups for collaborative learning.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default NotesFlashcardsGuidePage;

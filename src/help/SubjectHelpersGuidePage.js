import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const SubjectHelpersGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Subject Helpers</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Get AI-powered assistance with your studies using the Subject Helpers for Math, Science, and Commerce!</p>
        </section>
        <section className="blog-content-help-page">
          <h3>Using the Subject Helpers</h3>
          <h4>Math Helper</h4>
          <ol>
            <li>
              <strong>Access the Math Helper:</strong> Go to the "Math Helper" from the navigation bar.
            </li>
            <li>
              <strong>Voice Commands or Calculator:</strong> At the top of the Math Helper page, you will see two options:
              <ul>
                <li><strong>Microphone Icon:</strong> Use voice commands to ask math questions or perform calculations.</li>
                <li><strong>Switch to Calculator:</strong> Click to access a basic calculator without AI.</li>
                <li><strong>Switch to Math Solver:</strong> Click to use the AI-based math solver (currently in beta, so it may not provide accurate answers for all questions).</li>
              </ul>
            </li>
          </ol>
          <h4>Science Helper</h4>
          <ol>
            <li>
              <strong>Access the Science Helper:</strong> Navigate to the "Science Helper" from the navigation bar.
            </li>
            <li>
              <strong>Ask Science Questions:</strong> Use the Science Helper to ask questions related to science and get answers.
            </li>
          </ol>
          <h4>Commerce Helper</h4>
          <ol>
            <li>
              <strong>Access the Commerce Helper:</strong> Go to the "Commerce Helper" from the navigation bar.
            </li>
            <li>
              <strong>Ask Commerce Questions:</strong> Use the Commerce Helper to ask questions related to commerce and receive answers.
            </li>
          </ol>
        </section>
        <section className="blog-tips-help-page">
          <h3>Tips for Using the Subject Helpers</h3>
          <ul>
            <li>Use the Math Helper's voice command feature for quick calculations or question submissions.</li>
            <li>Switch between the calculator and math solver to find the tool that best suits your needs.</li>
            <li>For Science and Commerce Helpers, make sure to phrase your questions clearly for better responses.</li>
            <li>Keep in mind that the AI tools are continuously improving; they might not have all the answers or be completely accurate yet.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default SubjectHelpersGuidePage;
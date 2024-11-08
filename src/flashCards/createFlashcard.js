import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './flashCards.css';
import FooterNav from '../app_modules/footernav';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GroupModal from './GroupModal';
import { FaSave, FaSearch, FaEye, FaShare, FaPlus } from 'react-icons/fa';
import SuccessModal from '../app_modules/SuccessModal';
import DOMPurify from 'dompurify';
import SuccessMessage from '../app_modules/SuccessMessage';
import FeedbackForm from '../help/FeedbackForm';
import SubjectModal from './SubjectModal ';

const CreateFlashcard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const location = useLocation();
const { state } = location;
const initialContent = state?.editorContent || ''; // Get content from state
    const [editorContent, setEditorContent] = useState(initialContent);
    const [showModal, setShowModal] = useState(false);
    const nav = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control the SuccessModal visibility
    const [successMessage, setSuccessMessage] = useState(''); // State to store the success message
    const [query, setQuery] = useState(''); // State for AI query
    const [results, setResults] = useState([]); // State for results
    const [loading, setLoading] = useState(false); // State for loading
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [error, setError] = useState(false); // State for handling errors
const [regenerateQuery, setRegenerateQuery] = useState(''); // Store query for regenerate
const [typingMessage, setTypingMessage] = useState('');
const [message, setMessage] = useState('');
const [chatHistory, setChatHistory] = useState([
  { role: 'user', parts: [{ text: 'Hello' }] },
  { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] },
]);
const [conversationStarted, setConversationStarted] = useState(false);
const [showFeedbackForm, setShowFeedbackForm] = useState(false);
const [subjects, setSubjects] = useState([]);
const [selectedSubject, setSelectedSubject] = useState('');
const [showSubjectModal, setShowSubjectModal] = useState(false); 

const messagesEndRef = useRef(null);
useEffect(() => {
  fetchSubjects(); // Fetch subjects when the component mounts
}, []);

const fetchSubjects = async () => {
  setLoading(true); // Set loading to true before fetching
  try {
      const response = await axios.get(API_ROUTES.fetchsubjects, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });
      setSubjects(response.data); // Assuming response.data is an array of { id, subject }
      setSelectedSubject(response.data.length > 0 ? response.data[0].id : ''); // Set default selected subject to the first one
  } catch (error) {
      console.error('Error fetching subjects:', error);
  } finally {
      setLoading(false); // Set loading to false after fetching
  }
};
const scrollToSection = (sectionId) => {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
};

useEffect(() => {
  // If initialContent is present, set it to editorContent
  if (initialContent) {
    setEditorContent(initialContent);
    scrollToSection('content')
  }
}, [initialContent]);

    const navigate = useNavigate()


        // Toggle feedback form visibility
        const toggleFeedbackForm = () => {
            setShowFeedbackForm(prev => !prev);
        };
    

        const handleFileChange = (e) => {
          const newImages = Array.from(e.target.files); // Get newly selected files
          setImages((prevImages) => [...prevImages, ...newImages]); // Concatenate with existing images
      };
      

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('isPublic', isPublic);
        formData.append('token', token);
        formData.append('headings', editorContent);
        formData.append('subjectId', selectedSubject); // Send selected subject ID

        images.forEach((image) => {
            formData.append('images', image);
        });
    
        try {
            const response = await axios.post(API_ROUTES.addFlashCard, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                // Log success and update state
                console.log('Flashcard saved successfully!');
                setSuccessMessage('Flashcard saved successfully!');
                setShowSuccessModal(true);
                // Clear form inputs
                setTitle('');
                setDescription('');
                setImages([]);
                setIsPublic(true);
                setEditorContent('');
                 setSelectedSubject(subjects[0]?.id || '');
            } else {
                console.error('Failed to save flashcard.');
                alert('Failed to save flashcard.');
            }
        } catch (error) {
            console.error('Error saving flashcard:', error);
            alert('Failed to save flashcard.');
        }
    };



   const safeParseJSON = (jsonString) => {
        try {
            if (!jsonString || jsonString.trim() === '') {
                return [];
            }
            return JSON.parse(jsonString) || [];
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return [];
        }
    };


const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
};



const formatContent = (content) => {
  // Convert triple backticks to <pre><code> for code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  // Convert ## to <h2> and remove the ## characters
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");

  // Convert **text** to <strong> and remove the ** characters
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='large-text'>$1</strong>");

  // Convert *text* to <strong> and remove the * characters
  content = content.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  // Convert lists (lines starting with *) to <ul> and <li>
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>"); // Find list items

  // Wrap all <li> elements in a single <ul>
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>"); // Wrap in <ul>

  // Convert tables with | to <table>, <tr>, <th>, <td>
  content = content.replace(/(\|.*?\|)(\n|$)/g, (match) => {
    const rows = match.split('\n').filter(row => row.trim());
    const tableRows = rows.map(row => {
      const cells = row.split('|').filter(cell => cell.trim());
      const rowContent = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${rowContent}</tr>`;
    }).join('');
    return `<table>${tableRows}</table>`;
  });

  return content;
};






useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [chatHistory]);

const handleSendMessage = async () => {
  if (!message.trim()) return;
  if (!conversationStarted) setConversationStarted(true);

  const newHistory = [...chatHistory, { role: 'user', parts: [{ text: message }] }];
  setChatHistory(newHistory);
  setLoading(true);
  
  const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage

  try {
    const response = await axios.post(API_ROUTES.aiGemini, { message, chatHistory: newHistory, token });
    const formattedResponse = formatContent(response.data.response);
    setChatHistory([...newHistory, { role: 'model', parts: [{ text: formattedResponse }] }]);
    setMessage('');
  } catch (error) {
    const errorMessage = (
      <>
        Oops! Something went wrong. Please try again later.
      
      </>
    );
    setChatHistory([...newHistory, { role: 'model', parts: [{ text: errorMessage }] }]);
    console.error('Error sending message:', error);
  } finally {
    setLoading(false);
  }
};


const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  // Adjust the URL according to your API
  const response = await axios.post('/api/upload', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
  });
  
  return response.data.imageUrl; // Ensure your API returns the image URL
};

const imageHandler = async () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
      const file = input.files[0];
      if (file) {
          const imageUrl = await handleImageUpload(file);
          const quill = this.quillRef.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
      }
  };
};

const handleCopy = (resultContent) => {
  // Sanitize the content before setting it to the editor
  const sanitizedContent = DOMPurify.sanitize(resultContent);
  // Append the new content to the existing editor content
  setEditorContent((prevContent) => `${prevContent}\n${sanitizedContent}`);
  showModalMessage('Content Added!');
};

const showModalMessage = (message) => {
  setModalMessage(message);
  setModalVisible(true);
  setTimeout(() => {
      setModalVisible(false);
  }, 3000); // Hide modal after 3 seconds
};

const handleViewFalshCardsClick = () => {
  nav('/notes/view')
}

const openSubjectModal = () => setShowSubjectModal(true); // Open modal
const closeSubjectModal = () => setShowSubjectModal(false); // Close modal

const handleCreateSubject = (subjectName) => {
  // Your logic to create the subject goes here

  // Close the modal after creating the subject
  fetchSubjects()

};

    return (
        <div className="flashcards-page">
      {showSuccessModal && (
    <div className="modal-overlay-flashcard-save">
        <div className="modal-content-flashcard-save">
            <div className="modal-header-flashcard-save">
                <h2>Success!</h2>
            </div>
            <div className="modal-body-flashcard-save">
                <p>Your Notes has been successfully created!</p>
            </div>
            <div className="modal-footer-flashcard-save">
                <button className="close-button-flashcard-save" onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
        </div>
    </div>
)}
{modalVisible && <SuccessMessage message={modalMessage} onClose={() => setModalVisible(false)} />}
      {/* Button Group */}
      <div className="button-container__main__page__flashcard__page">
        {/* View Button */}
        <button
          className='btn__main__page__flashcard__page'
          onClick={handleViewFalshCardsClick}
        >
          <FaEye className="btn-icon__main__page__flashcard__page" /> My Notes
        </button>

        {/* Create Button */}
        <button
          className='btn__main__page__flashcard__page active__main__page__flashcard__page'
        >
          <FaPlus className="btn-icon__main__page__flashcard__page" /> Create 
        </button>
      </div>
            <h1>Create Notes</h1>
            <form onSubmit={handleSubmit} className="flashcard-form-flashcards-page">
                <div className="form-group-flashcards-page">
                    <label htmlFor="title">Name:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-flashcards-page" style={{ textAlign: 'center' }}>
        <label htmlFor="description">Provide a brief description<br /> (not content)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="form-group-flashcards-page">
        <label htmlFor="images">Images: (optional)</label>
        <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
          <div className="md:flex">
            <div className="w-full p-3">
              <label
                htmlFor="file-upload"
                style={{
                  display: 'block',
                  position: 'relative',
                  height: '12rem',
                  border: '2px solid #3b82f6',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.3s ease-in-out',
                  textAlign: 'center',
                  overflow: 'hidden'
                }}
                className="flex justify-center items-center hover:shadow-xl"
              >
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <img
                    alt="File Icon"
                    style={{ marginBottom: '0.75rem' }}
                    src="https://img.icons8.com/dusk/64/000000/file.png"
                  />
                  <span style={{ display: 'block', color: '#6b7280', fontWeight: '600' }}>
                    Drag &amp; drop your images here
                  </span>
                  <span style={{ display: 'block', color: '#9ca3af', marginTop: '0.25rem' }}>
                    or click to upload
                  </span>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0',
                    opacity: '0',
                    cursor: 'pointer'
                  }}
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>
          </div>
        </div>
        {/* Preview selected images */}
        {images.length > 0 && (
          <div className="image-preview__flashcard__add__images">
            <h3>Selected Images:</h3>
            <div className="image-preview-container__flashcard__add__images">
              {images.map((image, index) => (
                <div key={index} className="image-thumbnail__flashcard__add__images">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected image ${index + 1}`}
                  />
                  <button
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                    type='button'
                  >
                    &times; {/* Represents the "x" symbol */}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
                <div className="form-group-flashcards-page" id="content">
  <label htmlFor="isPublic" style={{textAlign: 'left'}}>Public:</label>
  <div>
    <input
      type="checkbox"
      id="isPublic"
      checked={isPublic}
      onChange={(e) => setIsPublic(e.target.checked)}
      style={{ display: 'none' }}
    />
    <label htmlFor="isPublic" className="check__flashcard__public">
      <svg width="18px" height="18px" viewBox="0 0 18 18">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
        <polyline points="1 9 7 14 15 4"></polyline>
      </svg>
    </label>
  </div>
</div>

<div className="form-group-flashcards-page" style={{
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.5rem', // Space below the dropdown
    fontFamily: 'Arial, sans-serif', // Font style
}}>

    <label htmlFor="subject" style={{
        fontSize: '1rem',
        color: '#4B5563', // Soft dark gray for the label
        marginBottom: '0.5rem', // Space below the label
    }}>
        Subject:
    </label>

    <select
        id="subject"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        style={{
            padding: '0.5rem 1rem', // Padding for a comfortable click area
            borderRadius: '10px', // Rounded corners for cuteness
            border: '1px solid #D1D5DB', // Light border
            backgroundColor: '#FFFBF0', // Soft cream background
            color: '#3B82F6', // Bright blue text
            fontSize: '1rem', // Font size
            fontWeight: '500', // Medium font weight
            cursor: 'pointer', // Pointer cursor on hover
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition
            outline: 'none', // Remove outline on focus
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        }}
        onFocus={(e) => e.target.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.3)'} // Shadow on focus
        onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'} // Reset shadow on blur
    >
        {/* Add "None" option */}
        <option value="0" style={{
            backgroundColor: '#FFFBF0', // Soft background for options
            color: '#3B82F6', // Bright blue text for options
        }}>
            None
        </option>

        {/* Map through subjects */}
        {subjects.map((subject) => (
            <option key={subject.id} value={subject.id} style={{
                backgroundColor: '#FFFBF0', // Soft background for options
                color: '#3B82F6', // Bright blue text for options
            }}>
                {subject.name}
            </option>
        ))}
    </select>
    <button
   onClick={openSubjectModal}
    type='button'
     className='add-subject-btn-create-note-page'>
    Add New subject
    </button>
</div>


                
<div className="form-group-flashcards-page">
                <label htmlFor="headings">Content:</label>
                <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={quillModules}
                />
            </div>
            {/* AI Query Section */}
            <div className="ai-query-section__flashcard__create" style={{textAlign: 'center'}}>
            <h3>Ask the AI:</h3>
    <p>Beta mode</p>

      <div>
        <div className="chat-history">
          {chatHistory.filter((msg, index) => 
            !(index === 0 && msg.role === 'user') && 
            !(index === 1 && msg.role === 'model') // Filter out default messages
          ).map((result, index) => (
            <div key={index} className={`chat-message ${result.role}`}>
              <div className="chat-bubble">
                <span className="chat-role">{result.role === 'user' ? 'You' : 'AI'}:</span>
                <div
                  className="chat-result-content"
                  dangerouslySetInnerHTML={{ __html: result.parts.map((part) => part.text).join('') }}
                />
                {result.role === 'model' && (
                  <div className="create-flashcard-btn_ai__page__container">
                    <button
                    type='button'
                      className="create-flashcard-btn_ai__page"
                      onClick={() => handleCopy(result.parts[0].text)} // Ensure handleCopy is defined
                    >
                      Create Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div/>
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center'}}>
      <button className="Gen_ai_info_flashcards_page" onClick={handleSendMessage} type='button'>
  <span className="Gen_ai_info_flashcards_span_page">Generate Info</span>
</button>
      <div className="bodydrop"></div>
      <span aria-hidden="true" className="particle-pen">
        {Array(5)
          .fill()
          .map((_, index) => (
            <svg
              key={index}
              className="particle"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z"
                fill="black"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          ))}
      </span>
    </div>




      </div>
    </div>

                {/* Displaying Results */}
                
                
                <button className='save-flashcard-btn' type="submit">
  <div className="svg-wrapper-1">
    <div className="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        class="icon"
      >
        <path
          d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
        ></path>
      </svg>
    </div>
  </div>
  <span>Save</span>
</button>

            </form>
            {showSubjectModal && (
                <SubjectModal
                    onClose={closeSubjectModal}
                    onCreate={handleCreateSubject}
                />
            )}
            <FooterNav />
        </div>
    );
};
const quillModules = {
  toolbar: {
    container: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'], // Grouped together
      ['blockquote', 'code-block'], // Grouped together
      [{ 'align': [] }], // Keep alignment options together
      ['video'] // Keep video separate for clarity
    ],
    handlers: {
      'background': function(value) {
        const quill = this.quill;
        quill.format('background', value);
      },
      'color': function(value) {
        const quill = this.quill;
        quill.format('color', value);
      },
      'image': function() {
        const quill = this.quill;
        const fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        fileInput.click();

        fileInput.onchange = async () => {
          const file = fileInput.files[0];
          if (file) {
            const formData = new FormData();
            formData.append('image', file);

            // Upload image to server
            try {
              const response = await fetch(API_ROUTES.flashcardImageUpload, {
                method: 'POST',
                body: formData,
              });
              const data = await response.json();

              if (data.imageUrl) {
                // Insert the image URL into the editor
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', data.imageUrl);
                
                // Set max width and height for the image
                const img = quill.root.querySelectorAll('img');
                img[img.length - 1].style.maxWidth = '200px'; // Set max width
                img[img.length - 1].style.maxHeight = '100%'; // Set max height
                img[img.length - 1].style.objectFit = 'contain'; // Maintain aspect ratio
              }
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        };
      }
    }
  }
};


export default CreateFlashcard
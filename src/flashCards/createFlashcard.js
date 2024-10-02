import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import './flashCards.css';
import FooterNav from '../app_modules/footernav';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GroupModal from './GroupModal';
import { FaSave, FaSearch, FaEye, FaShare } from 'react-icons/fa';
import SuccessModal from '../app_modules/SuccessModal';
import DOMPurify from 'dompurify';
import SuccessMessage from '../app_modules/SuccessMessage';


const CreateFlashcard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [editorContent, setEditorContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const nav = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control the SuccessModal visibility
    const [successMessage, setSuccessMessage] = useState(''); // State to store the success message
    const [query, setQuery] = useState(''); // State for AI query
    const [results, setResults] = useState([]); // State for results
    const [loading, setLoading] = useState(false); // State for loading
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


   const handleFileChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('isPublic', isPublic);
        formData.append('token', token);
        formData.append('headings', editorContent);
    
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




const performCalculate = async () => {
  if (!query) return; // Prevent calculation with empty query

  setLoading(true);
  try {
    const response = await axios.post(API_ROUTES.solveMath, { query });
    console.log('API Response:', response.data);

    // Format content dynamically
    let formattedContent = formatContent(response.data.response);

    setResults([{ title: 'Result', content: formattedContent || 'No content available' }]);
  } catch (error) {
    console.error('Calculation Error:', error);
    setResults([{ title: 'Error', content: "We're sorry, something went wrong. Please try later." }]);
  } finally {
    setLoading(false);
    setQuery(''); // Clear the input after calculation
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


    return (
        <div className="flashcards-page">
      {showSuccessModal && (
    <div className="modal-overlay-flashcard-save">
        <div className="modal-content-flashcard-save">
            <div className="modal-header-flashcard-save">
                <h2>Success!</h2>
            </div>
            <div className="modal-body-flashcard-save">
                <p>Your flashcard has been successfully created!</p>
            </div>
            <div className="modal-footer-flashcard-save">
                <button className="close-button-flashcard-save" onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
        </div>
    </div>
)}
{modalVisible && <SuccessMessage message={modalMessage} onClose={() => setModalVisible(false)} />}
            <h1>Create Flashcard</h1>
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
                <div className="form-group-flashcards-page">
                    <label htmlFor="description">Provide a brief description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group-flashcards-page">
                    <label htmlFor="images">Images:</label>


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
              backgroundColor: '#ffffff', // White background
              borderRadius: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s ease-in-out',
              textAlign: 'center', // Center the text
              overflow: 'hidden' // Hide overflow to avoid any unwanted display
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
                >
                    &times; {/* Represents the "x" symbol */}
                </button>
            </div>
        ))}
                        </div>
                    </div>
                )}
                </div>
                <div className="form-group-flashcards-page">
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
<div className="form-group-flashcards-page">
                <label htmlFor="headings">Content:</label>
                <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={quillModules}
                />
            </div>
            {/* AI Query Section */}
            <div className="ai-query-section__flashcard__create">
                <h3>Ask the AI:</h3>
                <p>Beta mode</p>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your question..."
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
                {results.length > 0 && (
                    <div className="ai-results__flashcard__create">
                        {results.map((result, index) => (
                            <div key={index} className="result-item__flashcard__create">
                                <h4>{result.title}</h4>
                                <div dangerouslySetInnerHTML={{ __html: result.content }} />
                                <button onClick={() => handleCopy(result.content)} className='copy-btn-notes-ai' type="button" >Add to content</button>
                            </div>
                        ))}
                    </div>
                )}

                    <div class="button-container__generate__text__flashcard__create">
                    <button className="button__generate__text__flashcard__create" type='button' onClick={performCalculate} type="button" >
  <div className="dots_border__generate__text__flashcard__create"></div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="sparkle__generate__text__flashcard__create"
  >
    <path
      className="path__generate__text__flashcard__create"
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke="black"
      fill="black"
      d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
    ></path>
    <path
      className="path__generate__text__flashcard__create"
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke="black"
      fill="black"
      d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
    ></path>
    <path
      className="path__generate__text__flashcard__create"
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke="black"
      fill="black"
      d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
    ></path>
  </svg>
  <span className="text_button__generate__text__flashcard__create">{loading ? 'Generating' : 'Generate Info'}</span>
</button>
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
                img[img.length - 1].style.maxWidth = '100%'; // Set max width
                img[img.length - 1].style.maxHeight = '400px'; // Set max height
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
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
  <label htmlFor="isPublic">Public:</label>
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
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }] // Add font color and background color
    ],
    handlers: {
      'background': function(value) {
        const quill = this.quill;
        quill.format('background', value);
      },
      'color': function(value) { // Handler for font color
        const quill = this.quill;
        quill.format('color', value);
      }
    }
  }
};


export default CreateFlashcard
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddFlashcardModal from './AddFlashcardModal';
import SuccessMessage from '../app_modules/SuccessMessage'; // Importing the SuccessMessage component
import './FlashcardSetPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';
import LoadingSpinner from '../app_modules/LoadingSpinner';
import { FaTrash } from 'react-icons/fa';

const FlashcardSetPage = () => {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [setDetails, setSetDetails] = useState({
    name: '',
    subject: '',
    topic: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [successMessage, setSuccessMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [answerVisible, setAnswerVisible] = useState({}); 
  const [answerHeight, setAnswerHeight] = useState({}); // State for answer heights
  const [setName, setSetName] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [activeTab, setActiveTab] = useState('flashcards'); // State for active tab
  const nav = useNavigate();
  const answerRefs = useRef({}); // Ref to keep track of answer divs
  const params = useParams()
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');
  const [menuVisible, setMenuVisible] = useState({});
  const [statusFilter, setStatusFilter] = useState(''); // 'I Know', 'I Don't Know', or ''
  const [aiSubject, setAiSubject] = useState('');  // For subject
  const [aiTopic, setAiTopic] = useState('');      // For topic
  const [selectedOption, setSelectedOption] = useState('ai'); // default value can be '' or any initial option
  const [pdfFile, setPdfFile] = useState(null); // To store the selected PDF file
 
  const toggleMenu = (id) => {
    setMenuVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const generateFlashcardsFromPDF = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF file first');
      return;
    }
  
    setIsGenerating(true);
  
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('set_id', params.id); // Assuming 'id' is a variable holding the set_id value
  
    try {
      // Send the file to the backend API to generate flashcards
      const response = await axios.post(API_ROUTES.generateFlashcardsFromPdfFromSet, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store token in local storage
        },
      });
  
      // Handle the response (flashcard set ID and generated flashcards)
      const { flashcardSetId, flashcards } = response.data;
      console.log('Flashcards generated:', flashcards);
      console.log('Flashcard Set ID:', flashcardSetId);
  
      // Refresh the page after successful flashcard generation
      window.location.reload(); // This will reload the current page
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  

  
  
  useEffect(() => {
    const fetchStats = async () => {
        setLoading(true); // Start loading state before fetching
        try {
            const response = await axios.post(API_ROUTES.fetchStats, { set_id: params.id }); // Send set_id in the body
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchStats();
}, [params.id]); // Fetch data whenever setId changes


  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch(`${API_ROUTES.flashcardSetGetData}/${id}`);
      const data = await response.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        setSetDetails(data.setDetails);
      } else {
        setFlashcards([]);
        setSetDetails({
          name: 'No Set Available',
          subject: 'N/A',
          topic: 'N/A',
        });
      }
    };
    fetchFlashcards();
  }, [id]);


  const fetchFlashcardSetData = async () => {
    try {
      const response = await fetch(`${API_ROUTES.getsetdataFlashcard}/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flashcard set data');
      }

      const data = await response.json();
      
      // Check and set each piece of data individually
      if (data.name) {
        setSetName(data.name);
      } else {
        console.error('No set name found');
      }

      if (data.subject) {
        setSubject(data.subject);
      } else {
        console.error('No subject found');
      }

      if (data.topic) {
        setTopic(data.topic);
      } else {
        console.error('No topic found');
      }
      
    } catch (error) {
      console.error('Error fetching flashcard set data:', error);
    }
  };

  useEffect(() => {
    fetchFlashcardSetData();
  }, [params.id]); // Dependency array to re-fetch when params.id changes


  const addCard = async (newCard) => {
    setFlashcards([...flashcards, newCard]);
    setModalVisible(false);
  };

  const generateFlashcards = async () => {
    setIsGenerating(true); // Start generating
    try {
      // Prepare request body including subject and topic from user input
      const requestData = {
        set_id: id,
        subject: aiSubject,  // User-input subject for AI
        topic: aiTopic,      // User-input topic for AI
      };
  
      const response = await fetch(API_ROUTES.generateFlashcards, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Send subject and topic in request
      });
  
      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Failed to generate flashcards'); // Throw error if response is not OK
      }
  
      const data = await response.json();
      setFlashcards((prevFlashcards) => [...prevFlashcards, ...data.flashcards]); // Append new flashcards
      setModalVisible(false); // Close modal after generating
      setSuccessMessage('Flashcards generated successfully!'); // Set success message here
  
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
        window.location.reload(); // Refresh the page
      }, 50);
    } catch (error) {
      console.error('Error occurred:', error); // Log the error for debugging
      // Optionally, show an error message to the user here
    } finally {
      setIsGenerating(false); // End generating
    }
  };
  

  
  const handleBack = () => {
    nav('/flashcard');
  };


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };
  const toggleAnswerVisibility = (id) => {
    setAnswerVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFlashcards = flashcards.filter((flashcard) => {
    const matchesStatus = statusFilter
      ? flashcard.status === statusFilter
      : true; // If no filter, show all cards
  
    return flashcard.question.toLowerCase().includes(searchQuery.toLowerCase()) && matchesStatus;
  });
  

  useEffect(() => {
    // Set heights for each answer based on visibility
    const heights = {};
    filteredFlashcards.forEach((flashcard) => {
      if (answerVisible[flashcard.id]) {
        const answerDiv = answerRefs.current[flashcard.id];
        heights[flashcard.id] = answerDiv ? answerDiv.scrollHeight : 0;
      } else {
        heights[flashcard.id] = 0; // Collapsed height
      }
    });
    setAnswerHeight(heights);
  }, [answerVisible, filteredFlashcards]);


  const handleShowFirstFlashcard = () => {
    if (flashcards.length > 0) {
      const firstFlashcard = flashcards[0];
      nav(`/flashcard/card/view/${firstFlashcard.id}/${params.id}`); // Navigate to first flashcard
    }
  };

  const handleShowFirstFlashcardSwipe = () => {
    if (flashcards.length > 0) {
      const firstFlashcard = flashcards[0];
      nav(`/swipe/flashcard/card/view/${firstFlashcard.id}/${params.id}`); // Navigate to first flashcard
    }
  };


// Example function to delete a flashcard
const deleteFlashcard = async (flashcardId) => {
  try {
      await axios.delete(`${API_ROUTES.deleteFlashcardIndividual}/${flashcardId}`); // Send delete request to the backend
      // Refresh the page after deletion
      window.location.reload(); // This will refresh the entire page
  } catch (error) {
      console.error('Error deleting flashcard:', error);
  }
};

const createManualFlashcard = async () => {
  try {
    const setId = params.id; // Make sure this is correctly defined

    // Send request to your backend to create the flashcard
    await axios.post(`${API_ROUTES.createFlashcardManually}`, { 
      question: manualQuestion, 
      answer: manualAnswer,
      set_id: setId // Ensure the key matches the server's expectations
    });

    // Set a success message here
    setSuccessMessage('Flashcard created successfully!'); // Assuming you have a state for successMessage
    setModalVisible(false); 
    // Hide success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage(''); // Clear the success message
      window.location.reload(); // Refresh the page
    }, 2000);

    // Optionally clear the inputs after creating
    setManualQuestion('');
    setManualAnswer('');
    
    // Refresh the flashcards
    fetchFlashcardSetData();
  } catch (error) {
    console.error('Error creating manual flashcard:', error);
  }
};


const deleteFlashcardSet = async () => {
  try {
    await axios.delete(`${API_ROUTES.deleteFlashcardSet}/${params.id}`);
    fetchFlashcardSetData(); // Refresh the list of flashcard sets
    nav('/flashcard')
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    alert('Failed to delete flashcard set. Please try again.'); // Error message
  }
};

const updateFlashcardStatus = async (flashcardId, status) => {
  try {
    const response = await fetch(`${API_ROUTES.updateFlashcardStatus}/${flashcardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      console.log(`Status updated to "${status}" for flashcard ID ${flashcardId}`);

      // Update score logic based on status
      if (status === 'I Know') {
        // Any custom logic for "I Know" status
      } else {
        // Any custom logic for "I Don't Know" status
      }

      // Refresh the page after success
      window.location.reload(); 
    } else {
      console.error('Failed to update flashcard status');
    }
  } catch (error) {
    console.error('Error updating flashcard status:', error);
  }
};



  // Return the loading state unconditionally
if (loading) {
  return <LoadingSpinner/>;
}

  return (
    <div className="flashcard__set__page" style={{marginBottom: '100px'}}>
<div className="flashcard__set__page__header">
    <div className="flashcard__set__page__header__top">
        <button className="flashcard__set__page__back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="flashcard__set__page__title">{setName}</h2>
        <button 
            className="flashcard-set__delete__set" 
            onClick={deleteFlashcardSet} 
        >
            <FaTrash className="trash-icon" />
        </button>
    </div>
    {/* Tab Navigation for Flashcards and Stats */}
<div className="tab-navigation">
    <button 
      className={`tab-button__set__page__tab ${activeTab === 'flashcards' ? 'active__set__page__tab' : ''}`}
      onClick={() => setActiveTab('flashcards')}
    >
      Flashcards
    </button>
    <button 
      className={`tab-button__set__page__tab ${activeTab === 'stats' ? 'active__set__page__tab' : ''}`}
      onClick={() => setActiveTab('stats')}
    >
      Stats
    </button>
</div>
</div>

      {activeTab === 'flashcards' ? (
      <>
 {/* Flashcard Header Section */}
<div className="flashcard__set__page__second__header__sec">
  <div className="flashcard__set__page__filter-section">
    {/* Status Filter */}
    <div className="flashcard__set__page__status-filter">
      <button 
        className={`status-filter-button ${statusFilter === 'I Know' ? 'active' : ''}`}
        onClick={() => setStatusFilter('I Know')}
      >
        I Know
      </button>
      <button 
        className={`status-filter-button ${statusFilter === 'I Don\'t Know' ? 'active' : ''}`}
        onClick={() => setStatusFilter('I Don\'t Know')}
      >
        I Don't Know
      </button>
      <button 
        className={`status-filter-button ${statusFilter === '' ? 'active' : ''}`}
        onClick={() => setStatusFilter('')}
      >
        All
      </button>
    </div>


    {/* Display Filtered Count */}
    <div className="flashcard__set__page__filtered-count">
      <p>{filteredFlashcards.length} Flashcards</p>
    </div>
  </div>
</div>

    
      <div className="flashcard__set__page__flashcards">
        {filteredFlashcards.length === 0 ? (
         <div className="flashcard__set__page__no-flashcards-container">
         <div className="flashcard__set__page__no-flashcards-message">
           <svg
             xmlns="http://www.w3.org/2000/svg"
             width="48"
             height="48"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
             className="flashcard__set__page__empty-icon"
           >
             <circle cx="12" cy="12" r="10"></circle>
             <line x1="15" y1="9" x2="9" y2="15"></line>
             <line x1="9" y1="9" x2="15" y2="15"></line>
           </svg>
           <h3>No Flashcards Yet</h3>
           <p>Looks like this set is empty. Start adding flashcards to get started!</p>
           <button className="flashcard__set__page__add-first-btn" onClick={toggleModal}>
             <i className="fas fa-plus"></i> Add Flashcards
           </button>
         </div>
       </div>
       
        ) : (
          filteredFlashcards
          .slice() // Create a copy of the array to avoid mutating the original array
          .reverse() // Reverse the copied array
          .map((flashcard) => (
            <div key={flashcard.id} className="flashcard__set__page__flashcard">
            {/* Question and Options (Three Dots) */}
            <div>
              <h4 className="flashcard__set__page__question">{flashcard.question}</h4>
          
              {/* Top right menu (3 dots) */}
              <div className="flashcard__set__page__options">
                <button
                  className="flashcard__set__page__menu-button"
                  onClick={() => toggleMenu(flashcard.id)}
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                {menuVisible[flashcard.id] && (
                  <div className="flashcard__set__page__dropdown">
                    <button onClick={() => deleteFlashcard(flashcard.id)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                    <button onClick={() => updateFlashcardStatus(flashcard.id, 'I Know')}>
                      <i className="fas fa-check"></i> Mark as I Know
                    </button>
                    <button onClick={() => updateFlashcardStatus(flashcard.id, 'I Don\'t Know')}>
                      <i className="fas fa-times"></i> Mark as I Don\'t Know
                    </button>
                  </div>
                )}
              </div>
            </div>
          
            {/* Flashcard Answer */}
            <div
              ref={(el) => (answerRefs.current[flashcard.id] = el)}
              className="flashcard__set__page__answer"
            >
              {flashcard.answer}
            </div>
          
            {/* Status Section */}
            <div className="flashcard__set__page__status">
              <strong>Status:</strong> {flashcard.status || 'No Status Available'}
            </div>
          </div>
          
          ))
        )}
      </div>
    
      {/* + Button */}
      <button className="flashcard__set__page__add-btn" onClick={toggleModal}>+</button>
    

     {/* Modal */}
<div className={`flashcard__set__page__modal ${modalVisible ? 'flashcard__set__page__modal-active' : ''}`}>
  <div className="flashcard__set__page__modal-header">
    <h3 className="flashcard__set__page__modal-title">Create Flashcards</h3>
    <button className="flashcard__set__page__modal-close" onClick={toggleModal}>
      <i className="fas fa-times"></i>
    </button>
  </div>

  <div className="flashcard__set__page__modal-content">
    {/* Button selection for Manual, AI, and PDF */}
    <div className="flashcard__set__page__modal-buttons">
      <button
        className={`flashcard__set__page__modal-btn ${selectedOption === 'manual' ? 'active' : ''}`}
        onClick={() => setSelectedOption('manual')}
      >
        Manual
      </button>
      <button
        className={`flashcard__set__page__modal-btn ${selectedOption === 'ai' ? 'active' : ''}`}
        onClick={() => setSelectedOption('ai')}
      >
        AI
      </button>
      <button
        className={`flashcard__set__page__modal-btn ${selectedOption === 'pdf' ? 'active' : ''}`}
        onClick={() => setSelectedOption('pdf')}
      >
        PDF
      </button>
    </div>

    {/* AI Option */}
    {selectedOption === 'ai' && (
      <div>
        <input
          type="text"
          placeholder="Subject"
          value={aiSubject}
          onChange={(e) => setAiSubject(e.target.value)}
          className="flashcard-input__manual__flashcard__form"
        />
        <input
          type="text"
          placeholder="Topic"
          value={aiTopic}
          onChange={(e) => setAiTopic(e.target.value)}
          className="flashcard-input__manual__flashcard__form"
        />
        <button
          className="flashcard__set__page__modal-generate btn__set__page__buttons"
          onClick={generateFlashcards}
          disabled={isGenerating || !aiSubject || !aiTopic}
        >
          <div className={`sparkle__set__page__buttons ${isGenerating ? 'animating' : ''}`}>
            <svg
              height="24"
              width="24"
              fill="#FFFFFF"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              className="sparkle__set__page__buttons"
            >
              <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
            <span className="text__set__page__buttons">
              {isGenerating ? 'Generating...' : 'Generate using AI'}
            </span>
          </div>
        </button>
      </div>
    )}

    {/* Manual Flashcard Creation Form */}
    {selectedOption === 'manual' && (
      <div className="manual-flashcard-creation__manual__flashcard__form">
        <h4>Create Manually</h4>
        <input
          type="text"
          placeholder="Question"
          value={manualQuestion}
          onChange={(e) => setManualQuestion(e.target.value)}
          className="flashcard-input__manual__flashcard__form"
        />
        <input
          type="text"
          placeholder="Answer"
          value={manualAnswer}
          onChange={(e) => setManualAnswer(e.target.value)}
          className="flashcard-input__manual__flashcard__form"
        />
        <button
          className="flashcard__set__page__manual-create__manual__flashcard__form"
          onClick={createManualFlashcard}
          disabled={!manualQuestion || !manualAnswer}
        >
          Create Flashcard
        </button>
      </div>
    )}
    {/* PDF Option */}
{selectedOption === 'pdf' && (
  <div>
    <input
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
      className="flashcard-input__manual__flashcard__form"
    />
    <button
      className="flashcard__set__page__modal-generate btn__set__page__buttons"
      onClick={generateFlashcardsFromPDF}
      disabled={isGenerating || !pdfFile}
    >
      <div className={`sparkle__set__page__buttons ${isGenerating ? 'animating' : ''}`}>
        <svg
          height="24"
          width="24"
          fill="#FFFFFF"
          viewBox="0 0 24 24"
          data-name="Layer 1"
          id="Layer_1"
          className="sparkle__set__page__buttons"
        >
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
        </svg>
        <span className="text__set__page__buttons">
          {isGenerating ? 'Generating...' : 'Generate from PDF'}
        </span>
      </div>
    </button>
  </div>
)}
  </div>
</div>


<footer className="flashcard__set__page__footer">
  <button className="flashcard__set__page__start-learning-btn" onClick={handleShowFirstFlashcardSwipe}>
    Swipe
  </button>
  <button className="flashcard__set__page__start-learning-btn" onClick={handleShowFirstFlashcard}>
    Active recall
  </button>
</footer>

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage message={successMessage} onClose={handleCloseSuccessMessage} />
      )}
    </>
    
      ) : (
<div className="stats-container__flashcard__page">
    <h2>Your Progress</h2>
    <div className="circular-progress__flashcard__page">
        <div className="circle__flashcard__page">
            <div className="percentage__flashcard__page">
                {stats.knownPercentage}%
                <p className="subtext">You Know</p>
                <p className="description">That's the percentage you know</p>
            </div>
        </div>
    </div>
    <div className="stats-details__flashcard__page">
        <p className="card-count">Known Cards: <span>{stats.knownCount}</span></p>
        <p className="card-count">Unknown Cards: <span>{stats.unknownCount}</span></p>
        <p className="total-cards__flashcard__page">Total Cards: <span>{stats.totalCards}</span></p>
    </div>
</div>
      )}
    </div>
  );
};

export default FlashcardSetPage;

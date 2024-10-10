import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddFlashcardModal from './AddFlashcardModal';
import SuccessMessage from '../app_modules/SuccessMessage'; // Importing the SuccessMessage component
import './FlashcardSetPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';

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

  useEffect(() => {
    const fetchStats = async () => {
        setLoading(true); // Start loading state before fetching
        try {
            const response = await axios.get(API_ROUTES.fetchStats(params.id)); // Use the new route
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
      const response = await fetch(API_ROUTES.generateFlashcards, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ set_id: id }),
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
      }, 2000);
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

  const filteredFlashcards = flashcards.filter(flashcard =>
    flashcard.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Return the loading state unconditionally
if (loading) {
  return <div>Loading...</div>;
}





  return (
    <div className="flashcard__set__page">
     <div className="flashcard__set__page__header">
    <div className="flashcard__set__page__header__top">
        <button className="flashcard__set__page__back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i> {/* Back Arrow Icon */}
        </button>
        <h2 className="flashcard__set__page__title">{setName}</h2>
    </div>

    <div className="flashcard__set__page__details">
        <span className="flashcard__set__page__subject">
            <i className="fas fa-book"></i> {/* Subject Icon */}
            Subject: {subject}
        </span>
        <br />
        <span className="flashcard__set__page__topic">
            <i className="fas fa-tag"></i> {/* Topic Icon */}
            Topic: {topic}
        </span>
        <br />
        <span className="flashcard__set__page__flashcard-count">
            <i className="fas fa-id-card"></i> {/* Flashcard Count Icon */}
            Flashcards: {flashcards.length}
        </span>
    </div>
</div>

{/* Tab Navigation for Flashcards and Stats */}
<div className="tab-navigation">
    <button 
      className={`tab-button ${activeTab === 'flashcards' ? 'active' : ''}`}
      onClick={() => setActiveTab('flashcards')}
    >
      Flashcards
    </button>
    <button 
      className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
      onClick={() => setActiveTab('stats')}
    >
      Stats
    </button>
</div>


      {activeTab === 'flashcards' ? (
        <>
<div className="search__set__page__add-button">
  <div className="searchBox__set__page__add-button">
    <input 
      type="text" 
      placeholder="Search flashcards by question" 
      value={searchQuery} 
      onChange={(e) => setSearchQuery(e.target.value)} 
      className="searchInput__set__page__add-button" 
    />
    <button className="searchButton__set__page__add-button" onClick={() => { /* Add search functionality here */ }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_2_17)">
          <g filter="url(#filter0_d_2_17)">
            <path d="M19.7953 19.9182L15.0585 15.1814M15.0585 15.1814C15.8188 14.4211 16.4219 13.5185 16.8333 12.5251C17.2448 11.5318 17.4566 10.4671 17.4566 9.3919C17.4566 8.3167 17.2448 7.252 16.8333 6.2587C16.4219 5.2653 15.8188 4.36271 15.0585 3.60242C14.2982 2.84214 13.3956 2.23905 12.4022 1.82759C11.4089 1.41612 10.3442 1.20435 9.269 1.20435C8.1938 1.20435 7.1291 1.41612 6.1358 1.82759C5.1424 2.23905 4.23981 2.84214 3.47953 3.60242C1.94407 5.13789 1.08145 7.2204 1.08145 9.3919C1.08145 11.5634 1.94407 13.6459 3.47953 15.1814C5.01499 16.7168 7.0975 17.5794 9.269 17.5794C11.4405 17.5794 13.523 16.7168 15.0585 15.1814Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path>
          </g>
        </g>
        <defs>
          <filter id="filter0_d_2_17" x="-0.418549" y="0.41435" width="21.7139" height="21.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="3"></feOffset>
            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="out"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
          </filter>
          <clipPath id="clip0_2_17">
            <rect width="24" height="24" fill="white" transform="translate(0 0)"></rect>
          </clipPath>
        </defs>
      </svg>
    </button>
  </div>
</div>



      {/* Button to show the first flashcard */}
      <button className="flashcard__set__page__show-first-btn" onClick={handleShowFirstFlashcard}>
        View 
      </button>

<div className="flashcard__set__page__flashcards">
  {filteredFlashcards.map((flashcard) => (
    <div key={flashcard.id} className="flashcard__set__page__flashcard">

      <Link
  key={flashcard.id}
  to={`/flashcard/card/view/${flashcard.id}/${id}`} // Use query parameter for setId
  style={{textDecoration: 'none'}}
>
  <h4 className="flashcard__set__page__question">{flashcard.question}</h4>
</Link>
      <div 
        ref={el => answerRefs.current[flashcard.id] = el} 
        className="flashcard__set__page__answer" 
        style={{
          maxHeight: answerHeight[flashcard.id] ? `${answerHeight[flashcard.id]}px` : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out', // Smooth transition
        }}
      >
        {flashcard.answer}
      </div>
      <button 
        className="flashcard__set__page__answer-toggle__set__page" 
        onClick={() => toggleAnswerVisibility(flashcard.id)}
      >
        <i className={`fas fa-chevron-${answerVisible[flashcard.id] ? 'up' : 'down'}`}></i> {/* Arrow Icon */}
      </button>
    </div>
  ))}
</div>



      {/* + Button */}
      <button className="flashcard__set__page__add-btn" onClick={toggleModal}>+</button>

{/* Modal */}
<div className={`flashcard__set__page__modal ${modalVisible ? 'flashcard__set__page__modal-active' : ''}`}>
  <div className="flashcard__set__page__modal-header" style={{ textAlign: 'center' }}>
    <h3 className="flashcard__set__page__modal-title">Create Flashcards</h3>
    <button className="flashcard__set__page__modal-close" onClick={toggleModal}>
      <i className="fas fa-times"></i> {/* Close Icon */}
    </button>
  </div>
  <div className="flashcard__set__page__modal-content" style={{ textAlign: 'center' }}>
    <button className="flashcard__set__page__modal-generate btn__set__page__buttons" onClick={generateFlashcards} disabled={isGenerating}>
      <div className={`sparkle__set__page__buttons ${isGenerating ? 'animating' : ''}`}>
        <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle__set__page__buttons">
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
        </svg>
        <span className="text__set__page__buttons">{isGenerating ? 'Generating...' : 'Generate'}</span>
      </div>
    </button>

  </div>
</div>


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

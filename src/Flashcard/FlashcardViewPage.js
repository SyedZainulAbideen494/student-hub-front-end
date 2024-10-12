import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight, faEye, faEyeSlash, faBug, faQuestionCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import './FlashcardViewPage.css';
import { FaQuestion, FaCheckCircle } from 'react-icons/fa';
import { API_ROUTES } from '../app_modules/apiRoutes';

const FlashcardViewPage = () => {
  const { id, setId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcard, setFlashcard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [setName, setSetName] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [swipeDirection, setSwipeDirection] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch(`${API_ROUTES.flashcardSetGetData}/${setId}`);
      const data = await response.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        const currentCard = data.flashcards.find(card => card.id === parseInt(id));
        setFlashcard(currentCard);
      } else {
        console.error('No flashcards found for this set');
      }
    };

    const fetchFlashcardSetData = async () => {
      const response = await fetch(`${API_ROUTES.getsetdataFlashcard}/${setId}`);
      const data = await response.json();
      if (data.name) {
        setSetName(data.name);
      } else {
        console.error('No set data found');
      }
    };

    fetchFlashcards();
    fetchFlashcardSetData();
  }, [id, setId]);

  const handleBack = () => {
    nav(-1);
  };

  const toggleAnswer = () => {
    setShowAnswer(prevState => !prevState);
  };

  const nextFlashcard = () => {
    const nextIndex = (currentIndex + 1) % flashcards.length;
    setCurrentIndex(nextIndex);
    setFlashcard(flashcards[nextIndex]);
    setShowAnswer(false);
    setSwipeDirection(null);
    updateMotivationalMessage('');
  };

  const previousFlashcard = () => {
    const previousIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    setCurrentIndex(previousIndex);
    setFlashcard(flashcards[previousIndex]);
    setShowAnswer(false);
    updateMotivationalMessage(''); // Reset motivational message
  };

  const updateFlashcardStatus = async (status) => {
    try {
      const response = await fetch(`${API_ROUTES.updateFlashcardStatus}/${flashcard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        console.log(`Status updated to "${status}" for flashcard ID ${flashcard.id}`);
        // Update score logic based on status
        if (status === 'I Know') {
          setUserScore(prevScore => prevScore + 1); // Increment score
          updateMotivationalMessage("You're doing great! Keep it up!"); // Positive message
        } else {
          updateMotivationalMessage("Don't worry! Keep practicing!"); // Encouragement
        }
      } else {
        console.error('Failed to update flashcard status');
      }
    } catch (error) {
      console.error('Error updating flashcard status:', error);
    }
  };

  const handleStatusUpdate = (status) => {
    updateFlashcardStatus(status);
    if (status === "I Don't Know") {
      updateMotivationalMessage("Don't worry! Keep practicing!"); // Encouragement
    } else {
      updateMotivationalMessage("You're doing great! Keep it up!"); // Positive message
    }
  };

  const updateMotivationalMessage = (message) => {
    setMotivationalMessage(message);
  };

  const cardRef = useRef(null);

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      handleStatusUpdate("I Don't Know");
      setSwipeDirection('swipe-left');
      setMotivationalMessage("I don't know");
    } else if (direction === 'right') {
      handleStatusUpdate('I Know');
      setSwipeDirection('swipe-right');
      setMotivationalMessage("I know");
    }
    setTimeout(() => {
      setMotivationalMessage(""); // Clear the message after a delay
      nextFlashcard();
    }, 1000); // Move to the next card after the animation
  };
  

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'), // Update status and go to the next card
    onSwipedRight: () => handleSwipe('right'), // Update status and go to the next card
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (!flashcard) {
    return <p>Loading...</p>;
  }

  const totalCards = flashcards.length;

  return (
<div className="flashcard__view__page" {...handlers}>
  <header className="flashcard__view__page__header">
    <button className="flashcard__view__page__back-button" onClick={handleBack}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
    <h2 className="flashcard__view__page__set-name">{setName || 'Flashcard Set'}</h2>
    
  </header>

  <div className="flashcard__view__page__progress-bar">
    <div className="flashcard__view__page__progress-fill" style={{ width: `${(currentIndex / flashcards.length) * 100}%` }} />
  </div>
  <div className="flashcard__view__page__progress-text">{`Progress: ${currentIndex + 1} / ${flashcards.length} cards`}</div>

  <div className="flashcard__view__page__content">
    <div className="flashcard__view__page__instructions" style={{ display: 'flex', justifyContent: 'space-between', width: '80%', padding: '0 16px' }}>
  <p style={{ margin: '0px 2px',fontSize: '12px' }}>Swipe left for "I Don't Know"</p>
  <p style={{ margin: '0px 2px',fontSize: '12px' }}>Swipe right for "I Know"</p>
</div>

<div 
  className={`flashcard__view__page__card ${showAnswer ? 'flipped' : ''} ${swipeDirection || ''}`} 
  ref={cardRef}
  style={{ position: 'relative', paddingBottom: '40px' }} // Add padding to give space for the button
>
  <div className="flashcard__view__page__card__inner">
    <div className="flashcard__view__page__card__front">
      <div className="flashcard__view__page__icon">
        <FontAwesomeIcon icon={FaQuestion} />
      </div>
      {flashcard.image && <img className="flashcard__view__page__card__image" src={flashcard.image} alt="Flashcard visual" />}
      <h3 className="flashcard__view__page__question">{flashcard.question}</h3>
    </div>

    {showAnswer && (
      <div className="flashcard__view__page__card__back">
        <div className="flashcard__view__page__icon">
          <FontAwesomeIcon icon={FaCheckCircle} />
        </div>
        <h3 className="flashcard__view__page__answer">{flashcard.answer}</h3>
      </div>
    )}
  </div>

  <button 
    className="flashcard__view__page__toggle-answer-button" 
    onClick={toggleAnswer}
    style={{ 
      position: 'absolute', 
      bottom: '10px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      marginBottom: '10px' 
    }} // Inline styling to position the button
  >
    {showAnswer ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
    {showAnswer ? ' Hide Answer' : ' Show Answer'}
  </button>
</div>

{motivationalMessage && (
    <div className="flashcard__view__page__swipe-message" style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', fontWeight: 'bold' }}>
      {motivationalMessage}
    </div>
  )}

   
  </div>
</div>

  );
};

export default FlashcardViewPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './SwipeCardView.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const SwipeFlashcardViewPage = () => {
  const { setId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setName, setSetName] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState('');
  
  // New state variables for tracking knowledge
  const [knownCount, setKnownCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);
  
  // Track if the quiz is complete
  const [quizComplete, setQuizComplete] = useState(false);

  const nav = useNavigate();

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch(`${API_ROUTES.flashcardSetGetData}/${setId}`);
      const data = await response.json();
      if (data.flashcards && data.flashcards.length > 0) {
        const shuffledFlashcards = shuffleArray(data.flashcards);
        setFlashcards(shuffledFlashcards);
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
  }, [setId]);

  const handleShowAnswer = () => {
    setIsFlipped(!isFlipped); // Toggle flip state
  };

  const handleSwipe = async (direction) => {
    const currentCard = document.querySelector('.flashcard__card__Swipe__Mode__flashcard');
    if (!currentCard) return;

    setSwipeDirection(direction);

    setTimeout(async () => {
      const status = direction === 'right' ? 'I Know' : "I Don't Know";
      
      // Update the known/don't know count
      if (direction === 'right') {
        setKnownCount((prevCount) => prevCount + 1);
      } else {
        setDontKnowCount((prevCount) => prevCount + 1);
      }

      try {
        await fetch(`${API_ROUTES.updateFlashcardStatus}/${flashcards[currentIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
      } catch (error) {
        console.error('Error updating flashcard status:', error);
      }

      setSwipeDirection('');
      setIsFlipped(false); // Reset flip state

      if (currentIndex + 1 < flashcards.length) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setProgress(((currentIndex + 1) / flashcards.length) * 100);
      } else {
        setQuizComplete(true);  // Set quiz complete flag
      }
    }, 400);
  };

  const handleBack = () => {
    nav(-1);
  };

  const detectSwipe = (event) => {
    const touch = event.changedTouches[0];
    const swipeDistance = touch.clientX - event.target.dataset.startX;

    if (swipeDistance > 100) {
      handleSwipe('right'); // Right swipe
    } else if (swipeDistance < -100) {
      handleSwipe('left'); // Left swipe
    }
  };

  const startTouch = (event) => {
    const touch = event.changedTouches[0];
    event.target.dataset.startX = touch.clientX;
  };

  if (!flashcards.length) {
    return <p>Loading...</p>;
  }

  const currentCard = flashcards[currentIndex];

  // If quiz is complete, show results
  if (quizComplete) {
    return (
      <div className="flashcard__result__Swipe__Mode__flashcard">
        <h3>Results:</h3>
        <p>You know {knownCount} cards</p>
        <p>You don't know {dontKnowCount} cards</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="flashcard__container__Swipe__Mode__flashcard">
      <header className="flashcard__header__Swipe__Mode__flashcard">
        <button className="flashcard__backButton__Swipe__Mode__flashcard" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="flashcard__setName__Swipe__Mode__flashcard">{setName || 'Flashcard Set'}</h2>
      </header>

      <div className="flashcard__progress__Swipe__Mode__flashcard">
        <div className="flashcard__progressBar__Swipe__Mode__flashcard" style={{ width: `${progress}%` }} />
      </div>

      <div
        className={`flashcard__card__Swipe__Mode__flashcard ${swipeDirection}`}
        onTouchStart={startTouch}
        onTouchEnd={detectSwipe}
      >
        <div className={`flashcard__content__Swipe__Mode__flashcard ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard__front__Swipe__Mode__flashcard">
            <h3>{currentCard.question}</h3>
          </div>
          <div className="flashcard__back__Swipe__Mode__flashcard">
            <h3>{currentCard.answer}</h3>
          </div>
        </div>
      </div>

      <div className="flashcard__message__Swipe__Mode__flashcard">
        {swipeDirection === 'right'
          ? 'Great job! You know this one!'
          : swipeDirection === 'left'
          ? "Don't worry, keep practicing!"
          : `Swipe left for 'Don't Know', right for 'I Know'`}
      </div>

      {!isFlipped && (
        <button className="flashcard__showAnswer__Swipe__Mode__flashcard" onClick={handleShowAnswer}>
          Show Answer
        </button>
      )}
    </div>
  );
};

export default SwipeFlashcardViewPage;

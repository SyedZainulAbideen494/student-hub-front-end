import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SwipeCardView.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const SwipeFlashcardViewPage = () => {
  const { setId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const nav = useNavigate();
  const swipeCardRef = useRef();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch(`${API_ROUTES.flashcardSetGetData}/${setId}`);
      const data = await response.json();
      setFlashcards(data.flashcards || []);
    };

    fetchFlashcards();
  }, [setId]);

  const handleShowAnswer = () => {
    setIsFlipped(true);
  };

  const handleHideAnswer = () => {
    setIsFlipped(false);
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' || direction === 'right') {
      if (currentIndex + 1 < flashcards.length) {
        setCurrentIndex((prev) => prev + 1);
        setProgress(((currentIndex + 1) / flashcards.length) * 100);
      } else {
        setQuizComplete(true);
      }
      setIsFlipped(false);
    }
  };

  const onSwipeStart = (e) => {
    const touchStart = e.touches[0].clientX;
    swipeCardRef.current.style.transition = 'none'; // Disable transition for dragging
    swipeCardRef.current.swipeStart = touchStart;
  };

  const onSwipeMove = (e) => {
    const touchMove = e.touches[0].clientX;
    const delta = touchMove - swipeCardRef.current.swipeStart;
    swipeCardRef.current.style.transform = `translateX(${delta}px)`;
  };

  const onSwipeEnd = (e) => {
    const swipeEnd = e.changedTouches[0].clientX;
    const direction = swipeEnd - swipeCardRef.current.swipeStart;

    if (Math.abs(direction) > 100) {
      handleSwipe(direction > 0 ? 'right' : 'left');
    }

    swipeCardRef.current.style.transition = 'transform 0.3s ease-out';
    swipeCardRef.current.style.transform = 'translateX(0px)'; // Reset position after swipe
  };

  const handleIKnow = async () => {
    // Update status as 'known' and proceed with swipe
    await updateFlashcardStatus(flashcards[currentIndex]?.id, 'I Know');
    animateSwipe('right');
  };

  const handleIDontKnow = async () => {
    // Update status as 'unknown' and proceed with swipe
    await updateFlashcardStatus(flashcards[currentIndex]?.id, `I Don't Know`);
    animateSwipe('left');
  };

  const animateSwipe = (direction) => {
    // Trigger swipe animation without actual touch interaction
    const swipeDistance = direction === 'right' ? 300 : -300; // Adjust for swipe distance
    swipeCardRef.current.style.transition = 'transform 0.5s ease-out';
    swipeCardRef.current.style.transform = `translateX(${swipeDistance}px)`;

    setTimeout(() => {
      handleSwipe(direction);
      swipeCardRef.current.style.transform = 'translateX(0px)'; // Reset position
    }, 500); // Wait for animation to finish before handling the swipe
  };

  const updateFlashcardStatus = async (id, status) => {
    try {
      await fetch(`${API_ROUTES.updateFlashcardStatus}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating flashcard status:', error);
    }
  };

  return (
    <div className="swipe-flashcard-container">
      {quizComplete ? (
        <div className="results">
          <h2>set Complete!</h2>
          <button onClick={() => nav(-1)}>Go Back</button>
        </div>
      ) : (
        <>
          <div
            className="flashcard-container"
            ref={swipeCardRef}
            onTouchStart={onSwipeStart}
            onTouchMove={onSwipeMove}
            onTouchEnd={onSwipeEnd}
            onClick={handleShowAnswer}
          >
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="front">
                <h3>{flashcards[currentIndex]?.question}</h3>
              </div>
              <div className="back">
                <h3>{flashcards[currentIndex]?.answer}</h3>
              </div>
            </div>
          </div>

          {/* Show Answer / Hide Answer Button */}
          {!isFlipped ? (
            <button className="show-answer-btn" onClick={handleShowAnswer}>
              Show Answer
            </button>
          ) : (
            <button className="show-answer-btn" onClick={handleHideAnswer}>
              Hide Answer
            </button>
          )}

          {/* I Know and I Don't Know Buttons */}
          <div className="response-buttons">
            <button className="dont-know-btn" onClick={handleIDontKnow}>
              I Don't Know
            </button>
            <button className="i-know-btn" onClick={handleIKnow}>
              I Know
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SwipeFlashcardViewPage;

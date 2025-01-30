import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SwipeCardView.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoaderFlashcardExplain from './flashcardExplainLoader';
import axios from 'axios';
import UpgradeModal from '../premium/UpgradeModal';

const formatContent = (content) => {
  // Format code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
  
  // Format large headers
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");
  
  // Format bold text (replace "**text**" with "<strong>text</strong>")
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Format italic text (replace "*text*" with "<em>text</em>")
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // Format list items
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>");
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
  
  // Format tables
  content = content.replace(/((?:\|.*?\|(?:\r?\n|$))+)/g, (match) => {
    const rows = match.split('\n').filter(row => row.trim());
    const tableRows = rows.map((row, index) => {
      const cells = row.split('|').filter(cell => cell.trim());
      if (index === 0) {
        const headerContent = cells.map(cell => `<th>${cell.trim()}</th>`).join('');
        return `<tr>${headerContent}</tr>`;
      }
      const rowContent = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${rowContent}</tr>`;
    }).join('');
    return `<table>${tableRows}</table>`;
  });

  // Format LaTeX/math expressions (inline math syntax: $math$ -> MathJax syntax)
  content = content.replace(/\$(.*?)\$/g, (_, math) => `\\(${math}\\)`);

  // Ensure all remaining asterisks are removed
  content = content.replace(/\*/g, "");

  return content;
};


const SwipeFlashcardViewPage = () => {
  const { setId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for modal
  const [isPremium, setIsPremium] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Add state

  const nav = useNavigate();
  const swipeCardRef = useRef();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch(`${API_ROUTES.flashcardSetGetData}/${setId}`);
      const data = await response.json();
      const randomizedFlashcards = data.flashcards
        ? [...data.flashcards].sort(() => Math.random() - 0.5) // Randomize order
        : [];
      setFlashcards(randomizedFlashcards);
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

  const SparkleIcon = () => (
    <svg height="24" width="24" fill="#9b4d96" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
  );

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setIsFlipped(false);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

  const handleSparkleClick = async () => {
    setIsModalOpen(true); // Open the modal on click
    setLoading(true);

    try {
      const response = await fetch(API_ROUTES.aiExplanFlashcard, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: flashcards[currentIndex]?.question,
          answer: flashcards[currentIndex]?.answer
        })
      });

      const data = await response.json();

      const formattedExplanation = formatContent(data.explanation);

      setExplanation(formattedExplanation);
    } catch (error) {
      console.error('Error fetching AI explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpgrade = () => {
    setIsUpgradeModalOpen(true)
  }

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
            <button className="dont-know-btn" onClick={handlePrevious} disabled={currentIndex === 0}>
              ← 
            </button>
            <button className="dont-know-btn" onClick={handleIDontKnow}>
              I Don't Know
            </button>


            {isPremium ? (
       <button className="dont-know-btn__" onClick={handleSparkleClick}>
       <SparkleIcon className="ai-explain-flashcard-icon" />
     </button>

    ) : (
      <button className="dont-know-btn__" onClick={handleOpenUpgrade}>
      <SparkleIcon className="ai-explain-flashcard-icon" />
    </button>

    )}
          
            <button className="i-know-btn" onClick={handleIKnow}>
              I Know
            </button>
          </div>

          {/* Modal for AI Explanation */}
 
          {isModalOpen && (
            <div className="modal__flashcard__Explain">
              {loading ? (
               <div className="explanation-content__flashcard__Explain">
               <div 
                 className="modal-header__flashcard__Explain" 
                 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}
               >
                 <LoaderFlashcardExplain/>
               </div>
             </div>
              ) : (
                <div className="explanation-content__flashcard__Explain">
                  <div className="modal-header__flashcard__Explain">
                    <h3>AI Explanation</h3>
                    <button onClick={() => setIsModalOpen(false)} className="close-btn__flashcard__Explain">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: explanation }}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
      <UpgradeModal 
        message="You are not a premium member. Upgrade to Premium to access this feature." 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
};

export default SwipeFlashcardViewPage;

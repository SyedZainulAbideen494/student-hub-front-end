import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './FlashcardViewPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import Confetti from 'react-confetti';

const FlashcardViewPage = () => {
  const { setId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [setName, setSetName] = useState('');
  const [highlightedChoice, setHighlightedChoice] = useState(null);
  const [progress, setProgress] = useState(0); // Progress tracking
  const [isCorrect, setIsCorrect] = useState(null); // Track if the answer is correct

  const nav = useNavigate();

  // Load correct and incorrect audio files
  const correctAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
  const incorrectAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/946/946-preview.mp3');
  const completionAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2059/2059-preview.mp3'); // Celebration sound

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
        setChoices(generateChoices(shuffledFlashcards, 0));
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

  const generateChoices = (flashcards, index) => {
    const correctAnswer = flashcards[index].answer;
    const allAnswers = flashcards.map(card => card.answer);
    const randomAnswers = allAnswers
      .filter(answer => answer !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [...randomAnswers, correctAnswer].sort(() => Math.random() - 0.5);
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
  const handleQuizCompletion = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await fetch(`${API_ROUTES.completeFlashcardQuiz}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token, // Include the token in the request body
          setId, // Optionally include the flashcard set ID if needed
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to log quiz completion');
      }
      console.log('Quiz completion logged successfully');
    } catch (error) {
      console.error('Error during quiz completion logging:', error);
    }
  };
  

  const handleAnswer = (selectedAnswer) => {
    const currentCard = flashcards[currentIndex];
    const isCorrectAnswer = selectedAnswer === currentCard.answer;

    // Play the correct or incorrect audio
    if (isCorrectAnswer) {
      correctAudio.play();
      setUserScore(prevScore => prevScore + 1);
      setIsCorrect(true); // Set to true for correct answer
      updateFlashcardStatus(currentCard.id, 'I Know');
    } else {
      incorrectAudio.play();
      setIsCorrect(false); // Set to false for incorrect answer
      updateFlashcardStatus(currentCard.id, "I Don't Know");
      setHighlightedChoice(currentCard.answer); // Highlight the correct answer
    }

    // Increase progress bar by one step
    setProgress(((currentIndex + 1) / flashcards.length) * 100);

    setTimeout(() => {
      setHighlightedChoice(null); // Reset highlight
      if (currentIndex + 1 < flashcards.length) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setChoices(generateChoices(flashcards, currentIndex + 1));
        setIsCorrect(null); // Reset answer status for next question
      } else {
        completionAudio.play();
        setIsQuizComplete(true);
        handleQuizCompletion(); // Log completion
      }
    }, 1500); // Wait for 1.5 seconds
  };

  const handleBack = () => {
    nav(-1);
  };

  if (!flashcards.length) {
    return <p>Loading...</p>;
  }

  if (isQuizComplete) {
    return (
      <div className="container__flashcard__Quiz__result__page">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div className="confetti__flashcard__Quiz__result__page"></div>
      <header className="header__flashcard__Quiz__result__page">
        <button className="back-button__flashcard__Quiz__result__page" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="set-name__flashcard__Quiz__result__page">{setName || 'Flashcard Set'}</h2>
      </header>
      <div className="result-container__flashcard__Quiz__result__page">
        <h3>Quiz Complete!</h3>
        <p className="score__flashcard__Quiz__result__page">
          Your Score: <strong>{userScore} / {flashcards.length}</strong>
        </p>
        <p className="feedback__flashcard__Quiz__result__page">
          {userScore === flashcards.length
            ? 'Amazing! You mastered it all!'
            : 'Great effort! Keep practicing to get better!'}
        </p>
       
      </div>
    </div>
    

    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcard__view__page">
      <header className="flashcard__view__page__header">
        <button className="flashcard__view__page__back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="flashcard__view__page__set-name">{setName || 'Flashcard Set'}</h2>
      </header>

      {/* Progress Bar */}
      <div className="flashcard__view__page__progress">
        <div className="flashcard__view__page__progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="flashcard__view__page__card">
        <h3 className="flashcard__view__page__question">{currentCard.question}</h3>
      </div>
    <h3>Select Correct Answer</h3>
      <div className="flashcard__view__page__choices">
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`flashcard__view__page__choice-button ${highlightedChoice === choice ? 'highlighted' : ''} ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
            onClick={() => handleAnswer(choice)}
            disabled={isCorrect !== null} // Disable choices after answer is selected
          >
            {choice}
          </button>
        ))}
      </div>
    </div>

    
  );
};

export default FlashcardViewPage;

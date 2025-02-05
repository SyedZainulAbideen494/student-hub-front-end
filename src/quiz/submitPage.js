import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import CountUp from 'react-countup';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { useSpring, animated } from 'react-spring';
import './SubmitQuiz.css';
import LoaderFlashcardExplain from '../Flashcard/flashcardExplainLoader';
import UpgradeModal from '../premium/UpgradeModal';

const tips = [
  "Great job! Keep practicing to improve even more.",
  "Awesome work! Try to maintain this streak.",
  "Excellent score! You're on the right track.",
  "Good effort! Check out more quizzes to challenge yourself.",
  "Well done! Remember, practice makes perfect."
];

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


const getRandomTip = () => tips[Math.floor(Math.random() * tips.length)];

const SubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const quizId = location.state?.quizId;
  const userAnswers = location.state?.userAnswers || {};
  const correctAnswers = location.state?.correctAnswers || {};
  const [questions, setQuestions] = useState([]);
  const [countUpFinished, setCountUpFinished] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(""); // State to store the AI analysis
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [isPremium, setIsPremium] = useState(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Add state

    const [loading, setLoading] = useState(false); // State to handle loading
  const [scoreAnimationProps, setScoreAnimationProps] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.8)',
  }));

  useEffect(() => {
    axios.get(`${API_ROUTES.getQuiz}/${quizId}`)
      .then((response) => {
        setQuestions(response.data.questions);
      })
      .catch((error) => {
        console.error('Error fetching quiz questions:', error);
      });

    // Trigger animation for the score display
    setScoreAnimationProps({ opacity: 1, transform: 'scale(1)' });

    if (score > 70) {
      // Play success sound for high scores
      const finishSound = new Audio('/sounds/game-bonus-144751.mp3');
      finishSound.play();
    }
  }, [quizId, score, setScoreAnimationProps]);

  const handleCountUpEnd = () => {
    setCountUpFinished(true);
  };

  const renderAnswerComparison = () => {
    return questions.map((question) => {
      const userAnswerId = userAnswers[question.id];
      const correctAnswer = correctAnswers[question.id];
      const isCorrect = userAnswerId === correctAnswer?.id;
  
      return (
        <div
          key={question.id}
          className={`render__Quiz__Result__Question__Container ${
            isCorrect ? 'render__Quiz__Result__Correct' : 'render__Quiz__Result__Incorrect'
          }`}
        >
          <p className="render__Quiz__Result__Question__Text">{question.question_text}</p>
          <p className="render__Quiz__Result__User__Answer">
            Your Answer:
            <span
              className={`${
                isCorrect
                  ? 'render__Quiz__Result__Correct__Answer'
                  : 'render__Quiz__Result__Incorrect__Answer'
              }`}
            >
              {question.answers.find((ans) => ans.id === userAnswerId)?.answer_text || 'Not Answered'}
            </span>
          </p>
          {!isCorrect && correctAnswer && (
            <p className="render__Quiz__Result__Correct__Answer__Container">
              Correct Answer:
              <span className="render__Quiz__Result__Correct__Answer__Highlight">
                {correctAnswer.text}
              </span>
            </p>
          )}
        </div>
      );
    });
  };

  const SparkleIcon = () => (
    <svg height="24" width="24" fill="#9b4d96" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
  );


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
  
  const handleOpenUpgrade = () => {
    setIsUpgradeModalOpen(true)
  }

  const getMessage = () => {
    if (score > 90) return 'Exceptional!';
    if (score > 70) return 'Awesome job!';
    if (score > 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  const fetchAIAnalysis = async () => {
    const performanceData = {
      score: score,
      userAnswers: userAnswers,
      correctAnswers: correctAnswers,
      questions: questions,
      topic: 'Physics',  // Update topic as needed
    };

    setLoading(true); // Start loading before fetching data
    setIsModalOpen(true);  // Open the modal
    try {
      const response = await axios.post(API_ROUTES.aiQuizAnalysis, performanceData);
      const formattedAnalysis = formatContent(response.data.analysis);  // Format the AI analysis
      setAiAnalysis(formattedAnalysis);  // Set the AI analysis in state
     
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    } finally {
      setLoading(false); // Stop loading once the data is fetched or an error occurs
    }
  };

  return (
    <div className="submit-page-quiz-complete">
      <header className="header-quiz-complete">
        <button className="back-button-quiz-complete" onClick={() => navigate('/quiz/home')}>&larr;</button>
        <h1>Quiz Result</h1>
      </header>

      <div className="card-quiz-complete">
        {countUpFinished && score > 70 && <Confetti />}
        <p className="message-quiz-complete">{getMessage()}</p>

        {/* Animated Score Display */}
        <animated.div style={scoreAnimationProps} className="score-container-quiz-complete">
          <CountUp
            start={0}
            end={score}
            duration={3}
            onEnd={handleCountUpEnd}
            className="score-text-quiz-complete"
          />
          %
        </animated.div>

        <p className="tip-quiz-complete">{getRandomTip()}</p>

        <button
          className="answers-button-quiz-complete"
          onClick={() => navigate(`/quiz/answers/${quizId}`)}
        >
          Answers
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
  {isPremium ? (
    <button className="flashcard__set__page__ai-explain-btn" onClick={fetchAIAnalysis}>
      <SparkleIcon className="ai-explain-flashcard-icon" /> AI Analysis
    </button>
  ) : (
    <button className="flashcard__set__page__ai-explain-btn" onClick={handleOpenUpgrade}>
      <SparkleIcon className="ai-explain-flashcard-icon" /> AI Analysis
    </button>
  )}
</div>

    </div>

      {/* Answer Comparison Section */}
      <div className="answer-comparison-container">
        <h2>Answer Comparison</h2>
        {questions.length > 0 ? renderAnswerComparison() : <p>Loading answers...</p>}
      </div>
        {/* AI Analysis Modal */}
        {isModalOpen && (
  <div className="modal__ai__quiz__analysis">
    <div className="modal-content__ai__quiz__analysis">
      <button
        className="close-modal__ai__quiz__analysis"
        onClick={() => setIsModalOpen(false)}
      >
        &times;
      </button>

      <h2 className="modal-title__ai__quiz__analysis">AI Quiz Analysis</h2>

      {loading ? (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <LoaderFlashcardExplain /> {/* Display loader while fetching data */}
  </div>
) : (
  <div
    className="ai-quiz-analysis-content__ai__quiz__analysis"
    dangerouslySetInnerHTML={{ __html: aiAnalysis }}
  />
)}

    </div>
  </div>
)}

<UpgradeModal 
        message="You are not a premium member. Upgrade to Premium to access this feature." 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
};

export default SubmitPage;

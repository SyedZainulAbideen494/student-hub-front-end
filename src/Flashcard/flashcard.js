import React, { useState } from 'react';
import './flashcardPage.css'; // Import your CSS styles

const FlashcardGenerator = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState('');

  const generateFlashcards = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/flashcards/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, topic }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Clean flashcard content to remove unwanted characters
      const cleanedFlashcards = data.flashcards.map(flashcard => ({
        question: flashcard.question.replace(/\*\*|\#\#/g, '').trim(),
        answer: flashcard.answer.replace(/\*\*|\#\#/g, '').trim(),
      }));

      setFlashcards(cleanedFlashcards);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate flashcards');
    }
  };

  return (
    <div className="flashcard-generator">
      <h2>Generate Flashcards</h2>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={generateFlashcards}>Generate</button>

      {error && <div className="error">{error}</div>}

      <div className="flashcard-list">
        {flashcards.map((flashcard, index) => (
          <div key={index} className="flashcard">
            <div className="question">{flashcard.question}</div>
            <div className="answer">{flashcard.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardGenerator;

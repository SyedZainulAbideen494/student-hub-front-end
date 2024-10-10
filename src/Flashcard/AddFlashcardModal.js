// src/components/AddFlashcardModal.js

import React, { useState } from 'react';

const AddFlashcardModal = ({ onAdd, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAddCard = async () => {
    const response = await fetch('http://localhost:8080/api/flashcards/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });

    if (response.ok) {
      const data = await response.json();
      onAdd(data.flashcard); // Assuming the API returns the new flashcard
    }
  };

  return (
    <div className="modal">
      <h3>Add Flashcard</h3>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button onClick={handleAddCard}>Add</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddFlashcardModal;

import React, { useState } from 'react';

const SurveyForm11_7_2024 = () => {
  // Hardcoded questions
  const questions = [
    {
      id: 1,
      text: 'How satisfied are you with the Edusify app?',
      type: 'mcq', // Multiple choice question
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      page: 1
    },
    {
      id: 2,
      text: 'What feature of Edusify do you use the most?',
      type: 'big_ans', // Big answer (open-ended question)
      page: 1
    },
    {
      id: 3,
      text: 'How likely are you to recommend Edusify to a friend?',
      type: 'mcq', // Multiple choice question
      options: ['Definitely', 'Maybe', 'Not Sure', 'No'],
      page: 2
    },
    {
      id: 4,
      text: 'What feature would you like to see added to Edusify?',
      type: 'big_ans', // Big answer (open-ended question)
      page: 2
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [responses, setResponses] = useState({});
  
  const handleChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send responses to a backend or handle them here
    console.log('Survey Responses:', responses);
    alert('Survey submitted successfully!');
  };

  // Filter questions based on the current page
  const filteredQuestions = questions.filter(q => q.page === currentPage);

  return (
    <form onSubmit={handleSubmit}>
      <h2>App Feedback Survey</h2>
      {filteredQuestions.map((question) => (
        <div key={question.id}>
          <label>{question.text}</label>
          
          {question.type === 'mcq' && (
            <div>
              {question.options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={option}
                    onChange={() => handleChange(question.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          
          {question.type === 'big_ans' && (
            <textarea
              placeholder="Write your answer here..."
              onChange={(e) => handleChange(question.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <div>
        {currentPage > 1 && (
          <button type="button" onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </button>
        )}
        {filteredQuestions.length > 0 && currentPage < 2 && (
          <button type="button" onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </button>
        )}
        {currentPage === 2 && (
          <button type="submit">Submit Survey</button>
        )}
      </div>
    </form>
  );
};

export default SurveyForm11_7_2024;

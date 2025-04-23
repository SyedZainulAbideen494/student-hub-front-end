import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  margin-right: 1rem;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const QuestionCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const QuestionText = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const OptionList = styled.ul`
  list-style-type: disc;
  margin-left: 1.5rem;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 1rem;
`;

const QuizGenerator = () => {
  const [examType, setExamType] = useState('NEET');
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setQuiz([]);

    try {
      const response = await fetch('https://srv594954.hstgr.cloud/api/quiz-from-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: 'edusify_live_sk-62kh6ygya8j', // Replace this with your actual API key
          examType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuiz(data.quiz);
      } else {
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Heading>Edusify Quiz Generator</Heading>

      <div style={{ marginBottom: '1rem' }}>
        <Label>Select Exam Type:</Label>
        <Select value={examType} onChange={(e) => setExamType(e.target.value)}>
          <option value="NEET">NEET</option>
          <option value="JEE">JEE</option>
          <option value="UPSC">UPSC</option>
          <option value="GATE">GATE</option>
          <option value="CAT">CAT</option>
          <option value="GMAT">GMAT</option>
          <option value="GRE">GRE</option>
          <option value="SAT">SAT</option>
          <option value="CLAT">CLAT</option>
          <option value="Banking">Banking</option>
          <option value="SSC">SSC</option>
          <option value="CUET">CUET</option>
        </Select>
        <Button onClick={generateQuiz}>Generate Quiz</Button>
      </div>

      {loading && <p>Loading quiz...</p>}
      {error && <ErrorText>{error}</ErrorText>}

      {quiz.map((q, index) => (
     <QuestionCard key={index}>
     <QuestionText>{index + 1}. {q.question}</QuestionText>
     <OptionList>
       {q.options.map((opt, i) => (
         <li
           key={i}
           style={{
             fontWeight: opt === q.correct_answer ? 'bold' : 'normal',
             color: opt === q.correct_answer ? 'green' : 'black',
           }}
         >
           {opt}
         </li>
       ))}
     </OptionList>
   </QuestionCard>
   
      ))}
    </Container>
  );
};

export default QuizGenerator;

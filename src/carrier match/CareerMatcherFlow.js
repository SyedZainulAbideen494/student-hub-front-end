import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CareerMatcherFlow.css';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

const steps = [
  {
    question: "Which of these topics do you enjoy the most? (Select up to 4)",
    type: "multi",
    key: "interests",
    options: [
      "🧬 Biology & Health", "💻 Technology & Coding", "🎨 Design & Art",
      "💼 Business & Management", "⚖️ Law & Politics", "🧠 Psychology & Mind",
      "🧪 Science & Research", "✈️ Travel & Cultures", "🎥 Media & Content Creation"
    ],
    max: 4
  },
  {
    question: "What are your strongest natural abilities?",
    type: "multi",
    key: "skills",
    options: [
      "🧠 Logical Thinking", "🗣 Communication", "🎯 Focus & Discipline",
      "🎨 Creativity", "👥 Empathy", "🔬 Attention to Detail", "🛠 Problem-Solving"
    ],
    max: 4
  },
  {
    question: "Which of these best describes you?",
    type: "multi",
    key: "personality",
    options: [
      "🧍 I prefer working alone", "🧑‍🤝‍🧑 I enjoy team collaboration",
      "👑 I like leading others", "🎯 I’m a perfectionist",
      "💡 I love experimenting and learning new things"
    ],
    max: 4
  },
  {
    question: "What motivates you the most?",
    type: "multi",
    key: "motivations",
    options: [
      "💰 High earning potential", "📈 Growth & success", "🧘 Work-life balance",
      "🌍 Making a difference", "💡 Innovation & creativity", "🔐 Job security"
    ],
    max: 4
  },
  {
    question: "How do you like to study?",
    type: "multi",
    key: "learning",
    options: [
      "📖 Reading theory deeply", "🧪 Hands-on learning", "🗣 Group discussions",
      "👨‍🏫 Visual or video-based", "🧠 Trial-and-error by doing"
    ],
    max: 4
  },
  {
    question: "Rate yourself (1-5): Confidence, Discipline, Social Skills, Curiosity, Patience",
    type: "rating",
    key: "ratings"
  }
];

const CareerMatcherFlow = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Initialize navigate hook
  
    const current = steps[step];
  
    const handleSelect = (option) => {
      const selected = answers[current.key] || [];
      const alreadySelected = selected.includes(option);
  
      if (alreadySelected) {
        setAnswers(prev => ({ ...prev, [current.key]: selected.filter(o => o !== option) }));
      } else if (selected.length < current.max) {
        setAnswers(prev => ({ ...prev, [current.key]: [...selected, option] }));
      }
    };
  
    const handleRating = (key, value) => {
      setAnswers(prev => ({
        ...prev,
        [current.key]: {
          ...(prev[current.key] || {}),
          [key]: value
        }
      }));
    };
  
    const next = () => setStep(s => s + 1);
    const prev = () => setStep(s => s - 1);
  
    const submit = async () => {
        setLoading(true);
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const res = await fetch(API_ROUTES.generateAiCareer, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // Sending the token in the request header
                },
                body: JSON.stringify({ answers }) // Wrap answers in an object
            });
    
            // Check if the response is successful
            if (!res.ok) {
                const errorData = await res.json();
                console.error('API error:', errorData);
                return;
            }
    
            const data = await res.json();
            setResult(data);  // Assuming this is where you handle the response
    
            // Now navigate using the career_match_id
            const careerMatchId = data.career_match_id; // Use career match ID from response
            navigate(`/carrier/${careerMatchId}`); // Redirect to the career result page using the match ID
    
        } catch (err) {
            console.error("Submission error:", err);
        }
    
        setLoading(false);
    };
    
    if (result) {
      return (
        <div className={`container__Flow__Carrier__choose__flow career-result__Flow__Carrier__choose__flow`}>
          <motion.div
            className={`card__Flow__Carrier__choose__flow ${result.career?.toLowerCase().replace(/\s/g, '')}__career_theme__flow`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="question__Flow__Carrier__choose__flow">🎯 Your Best-fit Career: {result.career}</h2>
            <p style={{ fontSize: "16px", color: "#bbb", lineHeight: "1.6" }}>{result.reasoning}</p>
          </motion.div>
        </div>
      );
    }
  
    return (
      <div className="container__Flow__Carrier__choose__flow">
        <motion.div
          className="card__Flow__Carrier__choose__flow"
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="question__Flow__Carrier__choose__flow">{current.question}</h2>
  
          {current.type === 'multi' && (
            <div className="options__Flow__Carrier__choose__flow">
              {current.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  className={`option__Flow__Carrier__choose__flow ${answers[current.key]?.includes(option) ? 'selected__Flow__Carrier__choose__flow' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
  
          {current.type === 'rating' && (
            <div className="ratings__Flow__Carrier__choose__flow">
              {["Confidence", "Discipline", "Social Skills", "Curiosity", "Patience"].map((trait) => (
                <div key={trait} className="ratingItem__Flow__Carrier__choose__flow">
                  <label>{trait}</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={answers[current.key]?.[trait] || 3}
                    onChange={(e) => handleRating(trait, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
  
          <div className="actions__Flow__Carrier__choose__flow">
            {step > 0 && (
              <button onClick={prev} className="navBtn__Flow__Carrier__choose__flow secondary">Back</button>
            )}
            <button
              onClick={step < steps.length - 1 ? next : submit}
              className="navBtn__Flow__Carrier__choose__flow"
              disabled={loading}
            >
              {loading ? 'Thinking...' : step < steps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };
  
  export default CareerMatcherFlow;
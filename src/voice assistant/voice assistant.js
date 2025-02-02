import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VoiceAssistant = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [circleSize, setCircleSize] = useState(50); // Circle size percentage
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isSpeaking) {
      // Increase circle size dynamically while AI speaks
      const interval = setInterval(() => {
        setCircleSize(prevSize => Math.min(prevSize + 1, 100));
      }, 100);

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [isSpeaking]);

  const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const userMessage = event.results[0][0].transcript;
      setMessage(userMessage); // Store message from speech input
      console.log('User said:', userMessage);

      // Send audio data (speech text) to the backend
      axios
        .post('http://localhost:8080/api/voice-assistant', { audioData: userMessage, token: localStorage.getItem('token') })
        .then((response) => {
          setAiResponse(response.data.response);
          playAIResponse(response.data.aiSpeechData); // Play AI response
        })
        .catch((error) => console.error('Error with voice assistant:', error));
    };

    recognition.start();
  };

  const playAIResponse = (speechData) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(speechData);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  return (
    <div className="voice-assistant">
      <div
        className="circle"
        style={{
          width: `${circleSize}%`,
          height: `${circleSize}%`,
          borderRadius: '50%',
          transition: 'width 0.2s, height 0.2s',
        }}
      ></div>
      <button onClick={startSpeechRecognition}>Speak</button>
      {aiResponse && <p>{aiResponse}</p>}
    </div>
  );
};

export default VoiceAssistant;

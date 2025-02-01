import React, { useState, useEffect } from "react";
import './TypewriterLoader.css';
import ReactLoaderInfinite from '../Personalized study plan/loader/ReactLoaderInfinite';


const TypewriterLoader = () => {
    const messages = [
        "Hang tight! We're generating your custom question paper with AI power ✨.",
        "Analyzing your chapters and preferences... ",
        "Choosing the best questions for your study goals.",
        "Fine-tuning the question paper for your subject and grade.",
        "Almost there! Your perfect question paper is on the way."
      ];
      
      const [currentMessage, setCurrentMessage] = useState(messages[0]);
    
      useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
          index = (index + 1) % messages.length;
          setCurrentMessage(messages[index]);
        }, 3000); // Change message every 3 seconds
    
        return () => clearInterval(interval); // Cleanup on component unmount
      }, [messages]);
    
      return (
        <div className="loading__container__loader__ai__plan">
          <div className="loader__wrapper__loader__ai__plan">
            <ReactLoaderInfinite />
          </div>
          <p className="loading__message__loader__ai__plan">{currentMessage}</p>
        </div>
      );
    };

export default TypewriterLoader;

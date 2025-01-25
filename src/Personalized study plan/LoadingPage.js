import React, { useState, useEffect } from "react";
import "./LoadingPage.css"; // CSS for loading spinner and page styling
import ReactLoaderInfinite from "./loader/ReactLoaderInfinite";

const LoadingPage = () => {
  const messages = [
    "Hang tight! We're crafting your personalized study plan with AI magic ✨.",
    "Analyzing your study habits and preferences... ",
    "Choosing the best strategies to maximize your learning.",
    "Fine-tuning the plan to suit your goals and schedule.",
    "Almost there! Your perfect study plan is on the way."
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

export default LoadingPage;

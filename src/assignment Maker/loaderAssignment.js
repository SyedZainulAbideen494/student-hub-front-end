import React, { useState, useEffect } from "react";
import LoaderAssignmentComp from "./LoaderCompo";

const LoaderAssignment = () => {
    const messages = [
        "Hang tight! We're generating your assignment with AI power ✨.",
        "Analyzing your topic and requirements...",
        "Researching and structuring your assignment content.",
        "Fine-tuning the details to match your subject and guidelines.",
        "Almost there! Your perfectly crafted assignment is on the way.",
      ];
      

  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setCurrentMessage(messages[index]);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <LoaderAssignmentComp />
      <p
        style={{
          fontSize: "18px",
          color: "#333",
          marginTop: "15px",
          maxWidth: "80%",
        }}
      >
        {currentMessage}
      </p>
    </div>
  );
};

export default LoaderAssignment;

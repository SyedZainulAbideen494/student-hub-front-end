import React, { useState } from "react";
import "./mathPageImageGen.css";
import Loader from "./ImageGnnLoader"; // Full-Page Loader Component
import { FiDownload,FiArrowLeft } from "react-icons/fi"; // Download Icon
import { API_ROUTES } from "../app_modules/apiRoutes";
import FooterNav from "../app_modules/footernav";

const MathPageImageGen = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseText, setResponseText] = useState("");
  const [imageName, setImageName] = useState(""); // Store Image Name

  const generateImage = async () => {
    if (!message.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError("");
    setImage(null);
    setResponseText("");

    try {
      const res = await fetch(API_ROUTES.generateImage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, token: localStorage.getItem("token") }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate image.");

      setResponseText(data.text || "");
      setImage(data.image ? `data:image/png;base64,${data.image}` : null);
      setImageName(message.replace(/\s+/g, "_").toLowerCase() + ".png"); // Set image name
      setMessage(""); // Clears input box
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };


  // Function to Download the Image
  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = imageName || "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Smaller Sparkle Icon
  const SparkleIcon = () => (
    <svg
      height="18"
      width="18"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      className="sparkle"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
  );

  return (
    <div className="container-ImageGen">

<button className="backBtn-ImageGen" onClick={goBack}>
        <FiArrowLeft size={22} />
      </button>
      <h2 className="title-ImageGen">AI Image Generator</h2>

      <div className="inputBox-ImageGen">
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={generateImage} disabled={loading}>
          {loading ? <div className="miniLoader"></div> : <SparkleIcon />}
        </button>
      </div>

      {loading && <Loader />} {/* Full-page loader */}

      {error && <p className="error-ImageGen">{error}</p>}
      {responseText && <p className="responseText-ImageGen">{responseText}</p>}

      {image && (
  <div className="imageContainer-ImageGen">
    <img src={image} alt="Generated" />

    {/* Centered Download Button */}
    <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
      <button className="downloadBtn-ImageGen" onClick={downloadImage}>
        <FiDownload size={20} /> Download
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default MathPageImageGen;

import React, { useState } from "react";
import axios from "axios";

const ImageObjectDetector = () => {
  const [image, setImage] = useState(null); // Only one image state
  const [prompt, setPrompt] = useState("what is in the image?"); // Default prompt
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processImage = async () => {
    if (!image) {
      setError("Please upload an image before processing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image); // Send the image and prompt
      formData.append("prompt", prompt);

      const response = await axios.post("http://localhost:8080/api/process-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.result);
    } catch (err) {
      setError("Error processing image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Image Object Detector</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Input field for the prompt */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Enter Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Update prompt as user types
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <button onClick={processImage} disabled={loading}>
        {loading ? "Processing..." : "Detect Object in Image"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detected Object:</h3>
          <p>{result}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageObjectDetector;

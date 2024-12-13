import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { useRef } from "react";

const ImageToText = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputFile = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError("");
      setText("");
    }
  };

  const handleImageToText = async () => {
    if (!selectedImage) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError("");
    setText("");

    try {
      // Using Tesseract.js to recognize text
      const { data: { text } } = await Tesseract.recognize(
        selectedImage,
        "eng",
        {
          logger: (m) => console.log(m), // optional progress logger
          // Additional options for improved accuracy
          tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?()[]{}",
          psm: 6,  // Page Segmentation Mode: Assume a single uniform block of text.
          oem: 1   // OCR Engine Mode: LSTM-only mode for better accuracy
        }
      );
      
      // Clean and fix text (remove unwanted newlines, extra spaces, etc.)
      const cleanText = text
        .replace(/\n+/g, ' ')  // Replace multiple newlines with spaces
        .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
        .trim();              // Remove leading/trailing spaces

      setText(cleanText);
    } catch (err) {
      setError("Error extracting text. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Image to Text Converter</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputFile}
      />
      <br />
      <button onClick={handleImageToText} disabled={loading}>
        {loading ? "Processing..." : "Convert to Text"}
      </button>

      {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}

      {text && (
        <div style={{ marginTop: "20px" }}>
          <h2>Extracted Text</h2>
          <textarea
            value={text}
            readOnly
            style={{ width: "100%", height: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageToText;

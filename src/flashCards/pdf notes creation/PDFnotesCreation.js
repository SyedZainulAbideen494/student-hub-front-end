import React, { useState } from "react";
import axios from "axios";
import "./PDFNotesCreation.css"; // Ensure the CSS file is imported
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../app_modules/apiRoutes";

const PDFNotesCreation = () => {
  const [file, setFile] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const options = [
    { value: "summary", label: "Summary" },
    { value: "key_points", label: "Key Points" },
    { value: "detailed_explanation", label: "Detailed Explanation" },
    { value: "question_generation", label: "Question Generation" },
  ];

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setError(""); // Clear error if user uploads a file
  };

  const handleOptionToggle = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((opt) => opt !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setError("Please upload a file.");
      return;
    }
  
    if (selectedOptions.length === 0) {
      setError("Please select at least one option.");
      return;
    }
  
    setLoading(true);
    setError("");
    setOutput("");
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("options", JSON.stringify(selectedOptions));
      formData.append("token", localStorage.getItem("token")); // Add token to the request body
  
      const response = await axios.post(API_ROUTES.pdfNotesMaker, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setOutput(response.data.result);
      alert(response.data.message); // Show success message
  
      // Now, the response includes the noteId
      const noteId = response.data.noteId;
      if (noteId) {
        navigate(`/note/view/${noteId}`); // Navigate to the note view page
      } else {
        setError("Failed to retrieve note ID.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="PDFNotesCreation__container">
          <button className="PDFNotesCreation__backButton" onClick={() => navigate(-1)}>
        ←
      </button>
      <h1 className="PDFNotesCreation__header">PDF Notes Creator</h1>
      <form onSubmit={handleSubmit} className="PDFNotesCreation__form">
        <FileUploader onFileChange={handleFileChange} />

        <div className="PDFNotesCreation__optionsContainer">
          <h3>Select what you need:</h3>
          {options.map((option) => (
            <div
              key={option.value}
              className={`PDFNotesCreation__toggleOption ${
                selectedOptions.includes(option.value)
                  ? "PDFNotesCreation__toggleOption--selected"
                  : ""
              }`}
              onClick={() => handleOptionToggle(option.value)}
            >
              <span className="PDFNotesCreation__toggleOptionText">
                {selectedOptions.includes(option.value) ? "−" : "+"}
              </span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="PDFNotesCreation__button">
          {loading ? "Processing..." : "Generate Notes"}
        </button>
      </form>

      {error && <p className="PDFNotesCreation__error">{error}</p>}

      {output && (
        <div className="PDFNotesCreation__output">
          <h2>Generated Output:</h2>
          <pre className="PDFNotesCreation__outputText">{output}</pre>
        </div>
      )}
    </div>
  );
};

const FileUploader = ({ onFileChange }) => {
  return (
    <div className="PDFNotesCreation__fileUpload__container">
      <div className="PDFNotesCreation__fileUpload__wrapper">
        <div className="PDFNotesCreation__fileUpload__box">
          <label htmlFor="file-upload" className="PDFNotesCreation__fileUpload__content">
            <img
              alt="File Icon"
              className="PDFNotesCreation__fileUpload__icon"
              src="https://img.icons8.com/dusk/64/000000/file.png"
            />
            <span className="PDFNotesCreation__fileUpload__text">Drag &amp; drop your files here</span>
            <span className="PDFNotesCreation__fileUpload__text">or click to upload</span>
          </label>

          <input
            className="PDFNotesCreation__fileUpload__input"
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={(e) => onFileChange(e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFNotesCreation;

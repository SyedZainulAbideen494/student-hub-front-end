import React, { useState } from "react";
import axios from "axios";
import "./PDFNotesCreation.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import PencilSVG from "./PencilSVG";

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
    setError("");
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
      formData.append("token", localStorage.getItem("token"));

      const response = await axios.post(API_ROUTES.pdfNotesMaker, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOutput(response.data.result);

      const noteId = response.data.noteId;
      if (noteId) {
        navigate(`/note/view/${noteId}`);
      } else {
        setError("Failed to retrieve note ID.");
      }
    } catch (err) {
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
              className={`PDFNotesCreation__toggleOption ${selectedOptions.includes(option.value) ? "PDFNotesCreation__toggleOption--selected" : ""}`}
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

      {loading && <LoadingModal />}
    </div>
  );
};

const LoadingModal = () => (
  <div className="PDFNotesCreation__loadingModal">
    <div className="PDFNotesCreation__modalContent">
      <PencilSVG />
      <p>Just a moment...!</p>
    </div>
  </div>
);

const FileUploader = ({ onFileChange }) => (
  <div className="PDFNotesCreation__fileUpload__container">
    <div className="PDFNotesCreation__fileUpload__wrapper">
      <label className="PDFNotesCreation__fileUpload__box">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => onFileChange(e.target.files[0])}
          className="PDFNotesCreation__fileUpload__input"
        />
        <div className="PDFNotesCreation__fileUpload__content">
          
          <p className="PDFNotesCreation__fileUpload__text">Upload PDF File</p>
        </div>
      </label>
    </div>
  </div>
);

export default PDFNotesCreation;

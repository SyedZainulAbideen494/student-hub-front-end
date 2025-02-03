import React, { useState, useEffect } from "react";
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
  const [isPremium, setIsPremium] = useState(null);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [isExceededLimit, setIsExceededLimit] = useState(false);
  const navigate = useNavigate();

  const options = [
    { value: "summary", label: "Summary" },
    { value: "key_points", label: "Key Points" },
    { value: "detailed_explanation", label: "Detailed Explanation" },
    { value: "question_generation", label: "Question Generation" },
  ];

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      setFile(null);  // Clear the file state if invalid type
      return;
    }
    setFile(selectedFile);
    setError(""); // Clear any existing errors
  };
  

  const handleOptionToggle = (value) => {
    if (!isPremium && selectedOptions.length >= 4 && !selectedOptions.includes(value)) {
      alert("As a free user, you can only select 2 options.");
      return;
    }
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((opt) => opt !== value)
        : [...prev, value]
    );
  };

  // Fetch subscription and flashcards count
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
        .then(response => {
          setIsPremium(response.data.premium);
          
          if (!response.data.premium) {
            // Fetch flashcards count for free users
            axios.get(API_ROUTES.flashcardsCountPdfPremium, {
              headers: { 'Authorization': token }
            })
            .then((res) => {
              setFlashcardsCount(res.data.flashcardsCount);
              if (res.data.flashcardsCount >= 1) {
                setIsExceededLimit(true);
              }
            })
            .catch((err) => {
              console.error("Error fetching flashcards count:", err);
            });
          }
        })
        .catch(() => setIsPremium(false));
    } else {
      setIsPremium(false);
    }
  }, []);

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

    if (isExceededLimit && !isPremium) {
      setError("You have reached the limit for generating flashcards. Upgrade to Premium.");
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
      formData.append("isPremium", isPremium); // Send the user's premium status

      const response = await axios.post(API_ROUTES.pdfNotesMaker, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        setError(response.data.error); // Display error message returned from the backend
      } else {
        setOutput(response.data.result);

        const noteId = response.data.noteId;
        if (noteId) {
          navigate(`/note/view/${noteId}`);
        } else {
          setError("Failed to retrieve note ID.");
        }
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

        <button 
          type="submit" 
          disabled={loading || isExceededLimit && !isPremium} 
          className="PDFNotesCreation__button"
        >
          {loading ? "Processing..." : isExceededLimit && !isPremium ? "Upgrade to Premium" : "Generate Notes"}
        </button>

        {isExceededLimit && !isPremium && (
          <div className="PDFNotesCreation__lockMessage">
            <span>🔒 Premium Only</span> - You have reached the limit for free users.
          </div>
        )}
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

const FileUploader = ({ onFileChange }) => {
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileChange = (file) => {
    setUploadedFileName(file?.name || ""); // Update with the uploaded file's name
    onFileChange(file);
  };

  return (
    <div className="PDFNotesCreation__fileUpload__container">
      <div className="PDFNotesCreation__fileUpload__wrapper">
        <label className="PDFNotesCreation__fileUpload__box">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="PDFNotesCreation__fileUpload__input"
          />
          <div className="PDFNotesCreation__fileUpload__content">
            {uploadedFileName ? (
              <p className="PDFNotesCreation__fileUpload__text">
                File Uploaded: <strong>{uploadedFileName}</strong>
              </p>
            ) : (
              <p className="PDFNotesCreation__fileUpload__text">Upload PDF File</p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default PDFNotesCreation;

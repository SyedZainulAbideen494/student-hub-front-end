import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WordScrambleGame = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleGenerateGame = async () => {
    setLoading(true);
    setError("");

    if (!subject || !topic || !token) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/word-scramble/generate",
        { subject, topic, token }
      );

      if (response.data.success) {
        const gameId = response.data.gameId; // Assume backend returns a gameId
        navigate(`/play/${gameId}`);
      } else {
        setError("Failed to generate the word scramble game.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Word Scramble Game Generator</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Topic:</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <button
        onClick={handleGenerateGame}
        style={{
          padding: "10px 20px",
          background: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Game"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
      )}
    </div>
  );
};

export default WordScrambleGame;

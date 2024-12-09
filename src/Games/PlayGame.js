import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PlayGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/word-scramble/${gameId}`
        );

        if (response.data.success) {
          setGameData(response.data.wordScrambleData);
          setGuesses(Array(response.data.wordScrambleData.length).fill(""));
        } else {
          setError("Failed to fetch game data.");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleGuessChange = (index, value) => {
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
  };

  const handleCheckAnswers = () => {
    let correctCount = 0;

    gameData.forEach((item, index) => {
      if (item.original_word.toLowerCase() === guesses[index]?.toLowerCase()) {
        correctCount++;
      }
    });

    alert(`You got ${correctCount} out of ${gameData.length} correct!`);
  };

  if (loading) {
    return <div>Loading game...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Word Scramble Game</h1>
      {gameData.length === 0 ? (
        <p>No game data available.</p>
      ) : (
        <div>
          <ul>
            {gameData.map((item, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>Scrambled Word:</strong> {item.scrambled_word}
                <br />
                <input
                  type="text"
                  placeholder="Your Guess"
                  value={guesses[index] || ""}
                  onChange={(e) => handleGuessChange(index, e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckAnswers}
            style={{
              padding: "10px 20px",
              background: "#28A745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Check Answers
          </button>
        </div>
      )}
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          background: "#6C757D",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default PlayGame;

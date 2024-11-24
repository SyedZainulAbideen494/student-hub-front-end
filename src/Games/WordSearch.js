import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WordSearch.css';

const WordSearch = () => {
  const [game, setGame] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);  // Track selected cells
  const [isSwiping, setIsSwiping] = useState(false);
  const [startCoord, setStartCoord] = useState(null);
  const [endCoord, setEndCoord] = useState(null);
  const [subject, setSubject] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Load saved game progress if any
    const savedGame = localStorage.getItem('wordSearchGame');
    if (savedGame) {
      setGame(JSON.parse(savedGame));
    }
  }, []);

  const fetchGame = () => {
    if (!subject) return alert('Please enter a subject.');

    axios.post('http://localhost:8080/api/word-search/generate', { subject }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      setGame(response.data.game);
      localStorage.setItem('wordSearchGame', JSON.stringify(response.data.game));
    }).catch((err) => {
      console.error('Error fetching game:', err);
    });
  };

  const handleSwipeStart = (e, rowIndex, colIndex) => {
    setIsSwiping(true);
    setStartCoord({ row: rowIndex, col: colIndex });
  };

  const handleSwipeEnd = (e, rowIndex, colIndex) => {
    if (!isSwiping) return;
    setIsSwiping(false);
    setEndCoord({ row: rowIndex, col: colIndex });

    // Check if the word is valid based on start and end coordinates
    const result = checkWord(startCoord, { row: rowIndex, col: colIndex });
    if (result && !selectedWords.includes(result.word)) {
      setSelectedWords([...selectedWords, result.word]);

      // Accumulate the new cells with previously selected cells
      setSelectedCells((prevCells) => [...prevCells, ...result.cells]);
    }
  };

  const checkWord = (start, end) => {
    const directions = [
      { row: 0, col: 1 },   // Horizontal
      { row: 1, col: 0 },   // Vertical
      { row: 1, col: 1 },   // Diagonal down-right
      { row: -1, col: 1 },  // Diagonal up-right
    ];

    // Iterate over each direction to find if the word exists
    for (const dir of directions) {
      let word = '';
      let r = start.row;
      let c = start.col;
      let cells = [];  // Track cells in this word

      // Traverse grid based on direction
      while (r >= 0 && r < 10 && c >= 0 && c < 10) {
        word += game.grid[r][c];
        cells.push({ row: r, col: c });

        // Check if current cell is the end cell
        if (r === end.row && c === end.col) {
          // Check if the word is valid (exists in the list of words)
          if (game.words.includes(word)) {
            return { word, cells }; // Return the word and its cells
          }
          break; // Exit loop if end cell is reached without matching word
        }
        // Move to the next cell in the current direction
        r += dir.row;
        c += dir.col;
      }
    }
    return null; // Return null if no valid word is found
  };

  const getSelectedCells = (start, end) => {
    const directions = [
      { row: 0, col: 1 },   // Horizontal
      { row: 1, col: 0 },   // Vertical
      { row: 1, col: 1 },   // Diagonal down-right
      { row: -1, col: 1 },  // Diagonal up-right
    ];

    // Iterate over each direction to find if the word exists
    for (const dir of directions) {
      let cells = [];
      let r = start.row;
      let c = start.col;

      // Traverse grid based on direction
      while (r >= 0 && r < 10 && c >= 0 && c < 10) {
        cells.push({ row: r, col: c });

        // Check if current cell is the end cell
        if (r === end.row && c === end.col) {
          return cells;
        }

        // Move to the next cell in the current direction
        r += dir.row;
        c += dir.col;
      }
    }
    return [];
  };

  const handleSaveProgress = () => {
    axios.post('http://localhost:8080/api/word-search/save-progress', {
      gameId: game.id,
      completedWords: selectedWords
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      console.log('Progress saved!');
    }).catch((err) => {
      console.error('Error saving progress:', err);
    });
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  if (!game) return (
    <div className="container__word__search__game">
      <h1>Word Search Game</h1>
      <input
        type="text"
        value={subject}
        onChange={handleSubjectChange}
        placeholder="Enter Subject"
        className="subject__input"
      />
      <button className="btn__generate__word__search__game" onClick={fetchGame}>
        Generate Game
      </button>
    </div>
  );

  return (
    <div className="container__word__search__game">
      <h1 className="title__word__search__game">Word Search Game</h1>
      <h2 className="subject__word__search__game">{game.subject} Word Search</h2>
      <div className="grid__word__search__game">
        {game.grid.map((row, rowIndex) => (
          <div className="row__word__search__game" key={rowIndex}>
            {row.map((letter, colIndex) => {
              // Check if the current cell is part of any selected word
              const isSelectedCell = selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex);

              return (
                <div
                  key={colIndex}
                  className={`cell__word__search__game ${isSelectedCell ? 'found__word__search__game' : ''}`}
                  onMouseDown={(e) => handleSwipeStart(e, rowIndex, colIndex)}
                  onMouseUp={(e) => handleSwipeEnd(e, rowIndex, colIndex)}
                  onTouchStart={(e) => handleSwipeStart(e, rowIndex, colIndex)}
                  onTouchEnd={(e) => handleSwipeEnd(e, rowIndex, colIndex)}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="words__word__search__game">
        {game.words.map((word) => (
          <div
            key={word}
            className={`word__word__search__game ${selectedWords.includes(word) ? 'found__word__search__game' : ''}`}
          >
            {word}
          </div>
        ))}
      </div>
      <button className="btn__save__progress" onClick={handleSaveProgress}>
        Save Progress
      </button>
    </div>
  );
};

export default WordSearch;

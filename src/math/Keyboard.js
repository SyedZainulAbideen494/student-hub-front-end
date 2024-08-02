import React from 'react';

const Keyboard = ({ onKeyPress }) => {
  const keys = [
    ['√', '+', '-', '*', '/', '^', '(', ')'],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Clear', 'Submit']
  ];

  const handleClick = (key) => {
    if (key === 'Clear') {
      onKeyPress('');
    } else if (key === 'Submit') {
      onKeyPress('submit');
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <button
              key={keyIndex}
              className="keyboard-key"
              onClick={() => handleClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
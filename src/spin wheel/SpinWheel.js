import React, { useState } from 'react';
import './SpinWheel.css';

const allPrizes = [
  "Premium Free",
  "50% Off",
  "25% Off",
  "10% Off",
  "No Luck",
  "Try Again"
];

const getShuffledPrizes = () => {
  const shuffled = [...allPrizes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SpinWheel = () => {
  const [prizeList, setPrizeList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleBoxClick = (index) => {
    if (loading || revealed) return;
    setLoading(true);
    const shuffled = getShuffledPrizes();

    setTimeout(() => {
      setPrizeList(shuffled);
      setSelectedIndex(index);
      setRevealed(true);
      setLoading(false);
    }, 2500);
  };

  return (
    showModal && (
      <div className="modal__mystery__box">
        <div className="modal-content__mystery__box">
          <h2 className="modal-title">🎁 Choose a Mystery Box</h2>
          <p className="modal-sub">One shot, one surprise. Tap a box!</p>

          <div className="boxes-grid__mystery__box">
            {allPrizes.map((_, i) => (
              <div
                key={i}
                className={`box__mystery__box 
                  ${revealed ? 'open' : ''} 
                  ${selectedIndex === i ? 'selected' : ''}`}
                onClick={() => handleBoxClick(i)}
              >
                {revealed ? (
                  <span className="prize-text__mystery__box">{prizeList[i]}</span>
                ) : (
                  <div className={`box-top ${loading ? 'shaking' : ''}`} />
                )}
              </div>
            ))}
          </div>

          {revealed && selectedIndex !== null && (
            <div className="result-message__mystery__box">
              🎉 You got: <strong>{prizeList[selectedIndex]}</strong>
            </div>
          )}

          <button
            className="close-btn__mystery__box"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default SpinWheel;

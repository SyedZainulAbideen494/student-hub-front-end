import React from 'react';

const SparkleButton = () => {
  const buttonStyle = {
    position: 'relative',
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    fontSize: '16px',
    overflow: 'hidden',
    borderRadius: '5px',
  };

  const sparkStyle = {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const particleStyle = {
    position: 'absolute',
    fill: 'black',
  };

  return (
    <div style={{ position: 'relative' }}>
      <button style={buttonStyle}>
        <span style={sparkStyle}></span>
        <span style={{ ...sparkStyle, zIndex: 1 }}>Backdrop</span>
        <svg
          style={{ width: '24px', height: '24px', position: 'relative', zIndex: 1 }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
            fill="black"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ position: 'relative', zIndex: 1 }}>Generate Site</span>
      </button>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></div>
      <span aria-hidden="true" className="particle-pen">
        {Array.from({ length: 8 }, (_, index) => (
          <svg key={index} style={particleStyle} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z"
              fill="black"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </span>
    </div>
  );
};

export default SparkleButton;

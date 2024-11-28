import React from 'react';
import './FoxIcon.css';

const FoxFaceIcon = () => {
  return (
    <div className="fox__edusify__fox__icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        {/* Fox Face Shape */}
        <circle cx="100" cy="100" r="80" fill="#FF7F00" className="fox__edusify__fox__icon-face" />
        
        {/* Fox Ears */}
        <path d="M 40 30 Q 10 60 40 85" fill="#FF7F00" className="fox__edusify__fox__icon-ear-left" />
        <path d="M 160 30 Q 190 60 160 85" fill="#FF7F00" className="fox__edusify__fox__icon-ear-right" />

        {/* Inner Ears */}
        <path d="M 40 30 Q 25 55 40 70" fill="white" className="fox__edusify__fox__icon-inner-ear-left" />
        <path d="M 160 30 Q 175 55 160 70" fill="white" className="fox__edusify__fox__icon-inner-ear-right" />
        
        {/* Eyes */}
        <circle cx="70" cy="85" r="12" fill="white" className="fox__edusify__fox__icon-eye-left" />
        <circle cx="130" cy="85" r="12" fill="white" className="fox__edusify__fox__icon-eye-right" />

        {/* Pupils */}
        <circle cx="70" cy="85" r="6" fill="black" className="fox__edusify__fox__icon-pupil-left" />
        <circle cx="130" cy="85" r="6" fill="black" className="fox__edusify__fox__icon-pupil-right" />
        
        {/* Nose */}
        <circle cx="100" cy="120" r="8" fill="black" className="fox__edusify__fox__icon-nose" />

        {/* Mouth */}
        <path d="M 90 130 Q 100 140 110 130" fill="transparent" stroke="black" strokeWidth="2" className="fox__edusify__fox__icon-mouth" />
        
        {/* Whiskers */}
        <path d="M 60 125 H 30" stroke="black" strokeWidth="2" className="fox__edusify__fox__icon-whisker-left-1" />
        <path d="M 60 130 H 30" stroke="black" strokeWidth="2" className="fox__edusify__fox__icon-whisker-left-2" />
        <path d="M 140 125 H 170" stroke="black" strokeWidth="2" className="fox__edusify__fox__icon-whisker-right-1" />
        <path d="M 140 130 H 170" stroke="black" strokeWidth="2" className="fox__edusify__fox__icon-whisker-right-2" />
      </svg>
    </div>
  );
};

export default FoxFaceIcon;

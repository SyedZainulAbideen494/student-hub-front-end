import React, { useEffect, useState } from 'react';
import './mathLoader.css';

const MathLoader = () => {
  const [value, setValue] = useState(0);
  const finalValue = 8; // Final result

  useEffect(() => {
    const timer = setInterval(() => {
      setValue(prev => {
        if (prev < finalValue) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return finalValue;
        }
      });
    }, 100); // Adjust speed here

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [finalValue]); // Dependency array updated to just include finalValue

  return (
    <div className="loader-container-math-loader">
      <div className="loader-animation-math-loader">
        <div className="math-animation-math-loader">
          <div className="math-animation-element-math-loader">5</div>
          <div className="math-animation-element-math-loader">+</div>
          <div className="math-animation-element-math-loader">3</div>
          <div className="math-animation-element-math-loader">=</div>
          <div className="math-animation-element-math-loader">{value}</div>
        </div>
        <div className="loading-message-math-loader">Calculating...</div>
      </div>
    </div>
  );
}

export default MathLoader;

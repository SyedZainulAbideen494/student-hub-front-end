import React from 'react';
import './mathLoader.css'; // Make sure you import the CSS

const Loader = () => {
  return (
    <>
      <div className="loader__ai__loader__new">
        <svg viewBox="0 0 80 80">
          <circle r="32" cy="40" cx="40" id="test"></circle>
        </svg>
      </div>

      <div className="loader__ai__loader__new triangle__ai__loader__new">
        <svg viewBox="0 0 86 80">
          <polygon points="43 8 79 72 7 72"></polygon>
        </svg>
      </div>

      <div className="loader__ai__loader__new">
        <svg viewBox="0 0 80 80">
          <rect height="64" width="64" y="8" x="8"></rect>
        </svg>
      </div>
    </>
  );
};

export default Loader;

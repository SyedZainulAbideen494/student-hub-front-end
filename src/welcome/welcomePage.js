import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';

const Welcome = () => {
    const [transition, setTransition] = useState('');

    useEffect(() => {
        // Trigger the transition className when the component mounts
        setTransition('show');
    }, []);

    return (
        <div className="card__container__welcome__user__msg__edusify">
        <div className="card__welcome__user__msg__edusify">
        <div className="header__welcome__user__msg__edusify">
          <span className="icon__welcome__user__msg__edusify">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fill-rule="evenodd"></path>
            </svg>
          </span>
          <p className="alert__welcome__user__msg__edusify">Welcome to Edusify!</p>
        </div>
      
        <p className="message__welcome__user__msg__edusify">
        Your all-in-one study and organization app.
        </p>
      
        <div className="actions__welcome__user__msg__edusify">
            <Link to='/'>
                        <button className="read__welcome__user__msg__edusify">Continue</button>
                    </Link>
    
        </div>
      </div>
      </div>
    );
};

export default Welcome;

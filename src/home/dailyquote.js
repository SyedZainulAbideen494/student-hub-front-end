import React, { useEffect, useState } from 'react';
import './dailyquote.css'; // Make sure to import the CSS file

const quotes = [
  "Fortune favors the bold.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Life is what happens when you're busy making other plans.",
  "You only live once, but if you do it right, once is enough.",
  "The purpose of our lives is to be happy.",
  "Get busy living or get busy dying.",
  "You have within you right now, everything you need to deal with whatever the world can throw at you.",
  "Believe you can and you're halfway there.",
  "The only impossible journey is the one you never begin.",
  "Act as if what you do makes a difference. It does.",
  "Success usually comes to those who are too busy to be looking for it.",
  "The best way to predict the future is to create it.",
  "You are never too old to set another goal or to dream a new dream.",
  "To live is the rarest thing in the world. Most people exist, that is all.",
  "In the end, we only regret the chances we didn’t take.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "Life is either a daring adventure or nothing at all.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Your time is limited, so don’t waste it living someone else’s life.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "Opportunities don't happen, you create them.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is not in what you have, but who you are.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Do not wait to strike till the iron is hot, but make it hot by striking.",
  "The only way to do great work is to love what you do.",
  "What we fear doing most is usually what we most need to do.",
  "Success is how high you bounce when you hit bottom.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "Dream big and dare to fail.",
  "Happiness is not something ready made. It comes from your own actions.",
  "The biggest risk is not taking any risk.",
  "Life isn’t about finding yourself. Life is about creating yourself."
];

const QuoteCard = () => {
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    // Function to select a random quote
    const selectRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]);
    };

    selectRandomQuote(); // Call the function to set a random quote
  }, []);

  return (
    <div className="card-container">
    <div className="card__home__component__quote">
      <div className="card-name__home__component__quote">Quote of the Month</div>
      <div className="quote__home__component__quote">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 330 307"
          height="80"
          width="80"
          className='svg__home__component__quote'
        >
          <path
            fill="currentColor"
            d="M302.258 176.221C320.678 176.221 329.889 185.432 329.889 203.853V278.764C329.889 297.185 320.678 306.395 302.258 306.395H231.031C212.61 306.395 203.399 297.185 203.399 278.764V203.853C203.399 160.871 207.902 123.415 216.908 91.4858C226.323 59.1472 244.539 30.902 271.556 6.75027C280.562 -1.02739 288.135 -2.05076 294.275 3.68014L321.906 29.4692C328.047 35.2001 326.614 42.1591 317.608 50.3461C303.69 62.6266 292.228 80.4334 283.223 103.766C274.626 126.69 270.328 150.842 270.328 176.221H302.258ZM99.629 176.221C118.05 176.221 127.26 185.432 127.26 203.853V278.764C127.26 297.185 118.05 306.395 99.629 306.395H28.402C9.98126 306.395 0.770874 297.185 0.770874 278.764V203.853C0.770874 160.871 5.27373 123.415 14.2794 91.4858C23.6945 59.1472 41.9106 30.902 68.9277 6.75027C77.9335 -1.02739 85.5064 -2.05076 91.6467 3.68014L119.278 29.4692C125.418 35.2001 123.985 42.1591 114.98 50.3461C101.062 62.6266 89.6 80.4334 80.5942 103.766C71.9979 126.69 67.6997 150.842 67.6997 176.221H99.629Z"
          ></path>
        </svg>
      </div>
      <div className="body-text__home__component__quote">{randomQuote}</div>
    </div>
  </div>
  
  );
};

export default QuoteCard;

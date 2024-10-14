import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Calculator.css';

const Calculator = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setInput(input + value);
  };

  const calculate = () => {
    try {
      setResult(eval(input)); // Use eval with caution
    } catch (error) {
      setResult('Error');
    }
  };

  const clear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div>
      <header className="header__cute__toolKit">
        <button onClick={() => navigate(-1)} className="back__button__cute__toolKit">
          <i className="fas fa-arrow-left"></i> {/* Font Awesome back arrow icon */}
        </button>
        <h1 className="header__title__cute__toolKit">Calculator Toolkit</h1>
      </header>
      <div className='body__cute__toolKit'>
        <div className="calculator__cute__toolKit">
          <div className="display__cute__toolKit">
            <div className="input__cute__toolKit">{input || '0'}</div>
            <div className="result__cute__toolKit">{result ? `= ${result}` : ''}</div>
          </div>
          <div className="buttons__cute__toolKit">
            <div onClick={() => clear()} className="button__cute__toolKit clear__cute__toolKit">C</div>
            <div onClick={() => handleClick('/')} className="button__cute__toolKit operator__cute__toolKit">÷</div>
            <div onClick={() => handleClick('*')} className="button__cute__toolKit operator__cute__toolKit">×</div>
            <div onClick={() => handleClick('-')} className="button__cute__toolKit operator__cute__toolKit">-</div>
            <div onClick={() => handleClick('7')} className="button__cute__toolKit">7</div>
            <div onClick={() => handleClick('8')} className="button__cute__toolKit">8</div>
            <div onClick={() => handleClick('9')} className="button__cute__toolKit">9</div>
            <div onClick={() => handleClick('+')} className="button__cute__toolKit operator__cute__toolKit">+</div>
            <div onClick={() => handleClick('4')} className="button__cute__toolKit">4</div>
            <div onClick={() => handleClick('5')} className="button__cute__toolKit">5</div>
            <div onClick={() => handleClick('6')} className="button__cute__toolKit">6</div>
            <div onClick={() => handleClick('1')} className="button__cute__toolKit">1</div>
            <div onClick={() => handleClick('2')} className="button__cute__toolKit">2</div>
            <div onClick={() => handleClick('3')} className="button__cute__toolKit">3</div>
            <div onClick={() => calculate()} className="button__cute__toolKit equals__cute__toolKit">=</div>
            <div onClick={() => handleClick('0')} className="button__cute__toolKit zero__cute__toolKit">0</div>
            <div onClick={() => handleClick('.')} className="button__cute__toolKit">.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

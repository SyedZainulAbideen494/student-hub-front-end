import React, { useState } from 'react';
import './ScientificCalculator.css';
import { useNavigate } from 'react-router-dom';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [isRadians, setIsRadians] = useState(true); // Toggle between radians and degrees
  const nav = useNavigate();

  const handleBackClick = () => {
    nav(-1);
  };

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      const result = eval(input); // Warning: eval should be used with caution
      setInput(result.toString());
    } catch (error) {
      setInput('Error');
    }
  };

  const handleFunction = (func) => {
    try {
      const value = parseFloat(input);

      const radiansValue = isRadians ? value : (value * Math.PI) / 180;
      const result = {
        sin: Math.sin(radiansValue),
        cos: Math.cos(radiansValue),
        tan: Math.tan(radiansValue),
        log: Math.log10(value),
        ln: Math.log(value),
        sqrt: Math.sqrt(value),
        exp: Math.exp(value),
        '!': factorial(value),
      }[func];

      setInput(result?.toString() || 'Error');
    } catch (error) {
      setInput('Error');
    }
  };

  const handlePower = () => {
    setInput((prev) => prev + '**');
  };

  const handleModulus = () => {
    setInput((prev) => prev + '%');
  };

  const toggleRadiansDegrees = () => {
    setIsRadians((prev) => !prev);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  return (
    <div className="calculator__toolKit__sci__calci__wrapper">
    <div className="calculator__toolKit__sci__calci">
      <div className="header__toolKit__sci__calci">
        <button
          className="back-btn__toolKit__sci__calci"
          onClick={handleBackClick}
        >
          &larr;
        </button>
      </div>
      <input
        type="text"
        value={input}
        readOnly
        className="calculator-screen__toolKit__sci__calci"
      />
      <button
        className="toggle__toolKit__sci__calci"
        onClick={toggleRadiansDegrees}
      >
        {isRadians ? 'Radians' : 'Degrees'}
      </button>
      <div className="buttons__toolKit__sci__calci">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            className="button__toolKit__sci__calci"
            onClick={() => handleClick(num.toString())}
          >
            {num}
          </button>
        ))}
        {['+', '-', '*', '/', '.'].map((op) => (
          <button
            key={op}
            className="button__toolKit__sci__calci"
            onClick={() => handleClick(op)}
          >
            {op}
          </button>
        ))}
        {['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'exp', '!'].map((func) => (
          <button
            key={func}
            className="button__toolKit__sci__calci"
            onClick={() => handleFunction(func)}
          >
            {func}
          </button>
        ))}
        <button className="button__toolKit__sci__calci" onClick={handlePower}>
          x<sup>y</sup>
        </button>
        <button className="button__toolKit__sci__calci" onClick={handleModulus}>
          Mod
        </button>
        <button
          className="button__toolKit__sci__calci"
          onClick={handleBackspace}
        >
          DEL
        </button>
        <button className="button__toolKit__sci__calci" onClick={handleClear}>
          AC
        </button>
        <button
          className="button__toolKit__sci__calci equals__toolKit__sci__calci"
          onClick={handleCalculate}
        >
          =
        </button>
      </div>
    </div>
    </div>
  );
};

export default ScientificCalculator;

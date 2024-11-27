import React, { useState } from 'react';
import './ScientificCalculator.css';
import { useNavigate } from 'react-router-dom';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const nav = useNavigate()
  const handlebackclick = () => {
    nav(-1)
  }
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
      const result = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
      }[func](parseFloat(input));

      setInput(result.toString());
    } catch (error) {
      setInput('Error');
    }
  };

  return (
    <div className="calculator__toolKit__sci__calci">
      <div className="header__toolKit__sci__calci">
        <button className="back-btn__toolKit__sci__calci" onClick={handlebackclick}>&larr;</button>
      </div>
      <input
        type="text"
        value={input}
        readOnly
        className="calculator-screen__toolKit__sci__calci"
      />
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
        {['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].map((func) => (
          <button
            key={func}
            className="button__toolKit__sci__calci"
            onClick={() => handleFunction(func)}
          >
            {func}
          </button>
        ))}
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
  );
};

export default ScientificCalculator;

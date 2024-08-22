import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './forgot-password.css';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://mn4jqd3r-5000.inc1.devtunnels.ms/api/auth/forgot-password', { emailOrPhone });
      setMessage('Instructions have been sent to your email.');
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="forgot-password">
      <header className="forgot-password__header">
        <h1 className="forgot-password__title">Forgot Password</h1>
        <p className="forgot-password__subtitle">Don't worry! We'll help you reset it.</p>
      </header>
      <main className="forgot-password__main">
        <form className="forgot-password__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="forgot-password__input"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Enter your email or phone number"
            required
          />
          <button className="forgot-password__button" type="submit">Send Reset Link</button>
        </form>
        <p className="forgot-password__message">{message}</p>
        <Link className="forgot-password__link" to="/">Back to Home</Link>
      </main>
      <footer className="forgot-password__footer">
        <p>&copy; 2024 Edusify</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
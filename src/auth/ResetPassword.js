import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './forgot-password.css'
import { API_ROUTES } from '../app_modules/apiRoutes';
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await axios.post(API_ROUTES.resetPassword, { token, password });
      setMessage('Password successfully reset.');
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="reset-password">
      <header className="reset-password__header">
        <h1 className="reset-password__title">Reset Password</h1>
      </header>
      <main className="reset-password__main">
        <form className="reset-password__form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="reset-password__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <input
            type="password"
            className="reset-password__input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />
          <button className="reset-password__button" type="submit">Reset Password</button>
        </form>
        <p className="reset-password__message">{message}</p>
      </main>
      <footer className="reset-password__footer">
        <p>&copy; 2024 Edusify</p>
      </footer>
    </div>
  );
};

export default ResetPassword;

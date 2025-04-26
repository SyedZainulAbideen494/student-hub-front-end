import React, { useState, useEffect } from 'react';
import { FaLock, FaUser, FaEyeSlash, FaEye, FaKey } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

     useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            Axios.post(API_ROUTES.sessionCheck, { token }).then((res) => {
                if (res.data.exists) nav('/');
            }).catch((err) => {
                console.error('Session check error:', err);
            });
        }
    }, [nav]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        Axios.post(API_ROUTES.login, {
            identifier: identifier,
            password: password,
        }).then((response) => {
            setLoading(false);
            if (!response.data.auth) {
                setError(response.data.message || "Invalid email or password.");
            } else {
                localStorage.setItem('token', response.data.token);
                nav('/');
            }
        }).catch((error) => {
            setLoading(false);
            setError("Login failed. Please try again.");
        });
    };

    return (
        <div className="login-wrapper">
        {loading && <LoadingSpinner />}
        {!loading && (
          <div className="login-container">
            <div className="login-header">
              <h2>Log in</h2>
              <Link to="/sign-up" className="signup-btn">Sign up</Link>
            </div>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
  {/* EMAIL FIELD */}
  <div className="input-wrapper has-icon">
    <span className="input-icon">@</span>
    <input
      type="text"
      placeholder="Email"
      className="login-input"
      value={identifier}
      onChange={(e) => setIdentifier(e.target.value)}
      required
    />
  </div>

  {/* PASSWORD FIELD */}
  <div className="input-wrapper has-icon password-wrapper">
    <span className="input-icon"><FaKey/></span> {/* or use a font icon if needed */}
    <input
      type={passwordVisible ? 'text' : 'password'}
      placeholder="Password"
      className="login-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
      {passwordVisible ? <FaEye /> : <FaEyeSlash />}
    </span>
    <Link to="/forgot-password" className="forgot-inside">I forgot</Link>
  </div>
  <button type="submit" className="login-main-btn">Log in</button>
</form>
          </div>
        )}
      </div>
      
    );
};

export default Login;

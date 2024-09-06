import React, { useState, useEffect } from 'react';
import { FaPhone, FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [phone, setPhone] = useState(''); // State for phone
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const nav = useNavigate();

    const handleIdentifierChange = (e) => setIdentifier(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleOtpChange = (e) => setOtp(e.target.value);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (!otpSent) {
            login();
        } else {
            verifyOTP();
        }
    };

    // Check token and redirect
const checkTokenAndRedirect = async (token, navigate) => {
  try {
    const response = await Axios.post(API_ROUTES.sessionCheck, { token });

    if (response.data.exists) {
      nav('/planner');
    } else {
      console.error('No matching token found.');
    }
  } catch (error) {
    console.error('Error checking token:', error);
  }
};

useEffect(() => {
  const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
  checkTokenAndRedirect(token, nav);
}, [nav]);

    const login = () => {
        setError("");
        Axios.post(API_ROUTES.login, {
            identifier: identifier,
            password: password,
        }).then((response) => {
            setLoading(false);
            if (!response.data.auth) {
                setError(response.data.message || "An error occurred");
            } else {
                setOtpSent(true);
                setUserEmail(response.data.email);
                setPhone(response.data.phone); // Store the phone number
            }
        }).catch((error) => {
            setLoading(false);
            setError("An error occurred while logging in");
        });
    };

    const verifyOTP = () => {
        setError("");
        Axios.post(API_ROUTES.verifyOTP, {
            phone: phone, // Send phone number for OTP verification
            otp: otp,
        }).then((response) => {
            setLoading(false);
            if (!response.data.auth) {
                setError(response.data.message || "An error occurred");
            } else {
                nav("/welcome");
                localStorage.setItem("token", response.data.token);
            }
        }).catch((error) => {
            setLoading(false);
            setError("An error occurred while verifying OTP");
        });
    };

    return (
<div className="login-wrapper">
  {loading && <LoadingSpinner />}
  {!loading && (
    <div className="login-container">
      <h2>Login</h2>
      {otpSent && userEmail && (
        <p>OTP sent to: {userEmail}</p>
      )}
      {otpSent ? (
        <form onSubmit={handleSubmit}>
          <div className="input-container-login">
            <FaLock className="icon" />
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={handleOtpChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Verify OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-container-login">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Email, Phone or Username"
              value={identifier}
              onChange={handleIdentifierChange}
              required
            />
          </div>
          <div className="input-container-login">
                                <FaLock className="icon" />
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    aria-label="Password"
                                />
                                <span
                                    className="toggle-password-login"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? 'Hide' : 'Show'}
                                </span>
                            </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      )}
      <p className="error-message">{error}</p>
      <div className="links-login">
                                <Link to="/forgot-password">Forgot password?</Link><br /><br />
                                <Link to="/sign-up">Don't have an account?</Link>
                            </div>
    </div>
  )}
</div>
    );
};

export default Login;
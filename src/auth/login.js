import React, { useState } from 'react';
import { FaPhone, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false); // Flag to track OTP sent status
    const [loading, setLoading] = useState(false); // Flag for loading state
    const nav = useNavigate();

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true); // Set loading state to true
        if (!otpSent) {
            login(); // Login without OTP if OTP input is not shown
        } else {
            verifyOTP(); // Verify OTP if OTP input is shown
        }
    };

    const login = () => {
        setError(""); // Clear any previous errors
        Axios.post(API_ROUTES.login, {
            phone: phone,
            password: password,
        }).then((response) => {
            setLoading(false); // Reset loading state
            if (!response.data.auth) {
                setError(response.data.message || "An error occurred");
            } else {
                setOtpSent(true); // Set OTP sent flag to true
            }
        }).catch((error) => {
            setLoading(false); // Reset loading state
            console.error(error); // Check for any caught errors
            setError("An error occurred while logging in");
        });
    };

    const verifyOTP = () => {
        setError(""); // Clear any previous errors
        Axios.post(API_ROUTES.verifyOTP, {
            phone: phone,
            otp: otp,
        }).then((response) => {
            setLoading(false); // Reset loading state
            if (!response.data.auth) {
                setError(response.data.message || "An error occurred");
            } else {
                nav("/");
                localStorage.setItem("token", response.data.token);
            }
        }).catch((error) => {
            setLoading(false); // Reset loading state
            setError("An error occurred while verifying OTP");
        });
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {otpSent ? (
                <form onSubmit={handleSubmit}>
                    <div className="input-container-login">
                        <FaLock className="icon" />
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            aria-label="OTP"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="input-container-login">
                        <FaPhone className="icon" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={handlePhoneChange}
                            required
                            aria-label="Phone number"
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
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <div className="links-login">
                        <Link to="/forgot-password">Forgot password?</Link><br /><br />
                        <Link to="/sign-up">Don't have an account?</Link>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Login;
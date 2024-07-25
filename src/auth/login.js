import React, { useState } from 'react';
import { FaPhone, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        if (!otpSent) {
            login();
        } else {
            verifyOTP();
        }
    };

    const login = () => {
        setError("");
        Axios.post(API_ROUTES.login, {
            phone: phone,
            password: password,
        }).then((response) => {
            setLoading(false);
            if (!response.data.auth) {
                setError(response.data.message || "An error occurred");
            } else {
                setOtpSent(true);
            }
        }).catch((error) => {
            setLoading(false);
            console.error(error);
            setError("An error occurred while logging in");
        });
    };

    const verifyOTP = () => {
        setError("");
        Axios.post(API_ROUTES.verifyOTP, {
            phone: phone,
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
            {loading && <LoadingSpinner />} {/* Show loader when loading */}
            {!loading && (
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
                            <p>Sent to your email</p>
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
            )}
        </div>
    );
};

export default Login;
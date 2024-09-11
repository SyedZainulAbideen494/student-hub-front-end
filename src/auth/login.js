import React, { useState, useEffect } from 'react';
import { FaPhone, FaLock, FaUser, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [phone, setPhone] = useState('');
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

    const checkTokenAndRedirect = async (token) => {
        try {
            const response = await Axios.post(API_ROUTES.sessionCheck, { token });
            if (response.data.exists) {
                nav('/');
            } else {
                console.error('No matching token found.');
            }
        } catch (error) {
            console.error('Error checking token:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkTokenAndRedirect(token);
        }
    }, [nav]);

    const login = () => {
        setError("");
        Axios.post(API_ROUTES.login, {
            identifier: identifier,
            password: password,
        }).then((response) => {
            setLoading(false);
            if (!response.data.auth) {
                setError(response.data.message || "Invalid email or password.");
            } else {
                setOtpSent(true);
                setUserEmail(response.data.email);
                setPhone(response.data.phone);
            }
        }).catch((error) => {
            setLoading(false);
            setError("Error occurred while logging in. Please try again.");
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
                setError(response.data.message || "OTP verification failed. Please try again.");
            } else {
                nav("/welcome");
                localStorage.setItem("token", response.data.token);
            }
        }).catch((error) => {
            setLoading(false);
            setError("Error occurred while verifying OTP. Please try again.");
        });
    };

    return (
        <div className="login-wrapper">
            {loading && <LoadingSpinner />}
            {!loading && (
                <div className="login-container">
                    {otpSent ? (
                        <>
                            <h2>Verify Your OTP</h2>
                            <p>A verification code has been sent to: <strong>{userEmail}</strong></p>
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
                        </>
                    ) : (
                        <>
                            <h2>Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-container-login">
                                    <FaUser className="icon" />
                                    <input
                                        type="text"
                                        placeholder="Email"
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
                                    />
                                    <span
                                        className="toggle-password-icon"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <button type="submit" className="login-button">
                                    Login
                                </button>
                                <div className="links-login">
                        <Link to="/forgot-password">Forgot Password?</Link> | 
                        <Link to="/register"> Register</Link>
                    </div>
                            </form>
                        </>
                    )}
                    {error && <p className="error-message">{error}</p>}
                
                    <p className="welcome-message">Welcome back! Please log in to continue.</p>
                </div>
            )}
        </div>
    );
};

export default Login;

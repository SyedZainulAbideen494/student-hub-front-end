import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { API_ROUTES } from '../app_modules/apiRoutes';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const nav = useNavigate()

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Prepare user data for POST request
        const userData = {
            username: username,
            email: email,
            phone: phone,
            password: password
        };

        try {
            // Send POST request to server
            const response = await fetch(API_ROUTES.signup, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Sign-up failed');
                return;
            }

            // Clear form fields on successful sign-up
            setUsername('');
            setEmail('');
            setPhone('');
            setPassword('');
            setConfirmPassword('');
            setError(null);

            console.log('User registered successfully!');
            nav('/login')
            // Optionally redirect to login page or another route
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Error signing up. Please try again later.');
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="input-container-login">
                        <FaPhone className="icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                <div className="input-container-login">
                    <FaUser className="icon" />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div className="input-container-login">
                    <FaEnvelope className="icon" />
                    <input
                        type="phone"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={handlePhoneChange}
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
                        className="toggle-password-login"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? 'Hide' : 'Show'}
                    </span>
                </div>
                <div className="input-container-login">
                    <FaLock className="icon" />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <div className="links-login">
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default SignUp;
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner'; // Ensure this component is available

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleTermsChange = (e) => setTermsAccepted(e.target.checked);

    const validateForm = () => {
        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!termsAccepted) {
            setError('You must agree to the terms and conditions');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(API_ROUTES.signup, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Sign-up failed');
                setLoading(false);
                return;
            }

            setFormData({
                username: '',
                phone: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            setTermsAccepted(false);
            setError(null);

            console.log('User registered successfully!');
            nav('/login');
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Error signing up. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const { username, phone, email, password, confirmPassword } = formData;

    return (
        <div className="signup-container">
            {loading && <LoadingSpinner />} {/* Show loader when loading */}
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="input-container">
                    <FaUser className="icon" />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <FaEnvelope className="icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <FaPhone className="icon" />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <FaLock className="icon" />
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? 'Hide' : 'Show'}
                    </span>
                </div>
                <div className="input-container">
                    <FaLock className="icon" />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                        required
                    />
                    <label htmlFor="terms">
                        I agree to the <Link to='/terms-and-conditions'>Terms and Conditions</Link>
                    </label>
                </div>
                <button type="submit" disabled={loading || !termsAccepted}>Sign Up</button>
            </form>
            <div className="links">
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default SignUp;
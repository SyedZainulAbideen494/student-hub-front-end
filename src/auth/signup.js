import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaUserPlus, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import axios from 'axios';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        unique_id: '',
        phone_number: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uniqueIdStatus, setUniqueIdStatus] = useState('');
    const [uniqueIdSuggestions, setUniqueIdSuggestions] = useState([]);
    const [step, setStep] = useState(1);
    const nav = useNavigate();

    // Auto-fill implementation for username, email, phone number
    useEffect(() => {
        const savedData = localStorage.getItem('signupData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('signupData', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        const checkUniqueId = async () => {
            if (!formData.unique_id) {
                // Clear status and suggestions if unique_id is empty
                setUniqueIdStatus('');
                setUniqueIdSuggestions([]);
                return;
            }
    
            try {
                const response = await fetch(API_ROUTES.checkUniqueId, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ unique_id: formData.unique_id }),
                });
    
                if (response.ok) {
                    setUniqueIdStatus('available');
                    setUniqueIdSuggestions([]);
                } else {
                    setUniqueIdStatus('taken');
                    const alternatives = await response.json();
                    setUniqueIdSuggestions(alternatives);
                }
            } catch (error) {
                console.error('Error checking unique_id:', error);
                setUniqueIdStatus('error');
                setUniqueIdSuggestions([]);
            }
        };
    
        checkUniqueId();
    }, [formData.unique_id]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleTermsChange = (e) => setTermsAccepted(e.target.checked);

// Phone number validation to enforce 10, 12, 13, or 14-digit format, with optional '+'
const validatePhoneNumber = (phone) => {

};


    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        if (!termsAccepted) {
            setError('You must agree to the terms and conditions');
            return false;
        }
        if (!formData.email || !validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Please enter a password');
            return false;
        }
        if (!formData.unique_id) {
            setError('Please enter a username');
            return false;
        }
        if (!formData.phone_number) {
            setError('Phone number must be in the format +91XXXXXXXXXX');
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

            const data = await response.json();
            localStorage.setItem('token', data.token);

            // Reset form
            setFormData({
                email: '',
                password: '',
                unique_id: '',
                phone_number: '',
            });
            setTermsAccepted(false);
            setError(null);
            nav('/flow-user-data');
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Error signing up. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData((prev) => ({ ...prev, unique_id: suggestion }));
        setUniqueIdStatus('available');
        setUniqueIdSuggestions([]);
    };

    const handleNextStep = () => {
        if (step === 1) setStep(2);
    };

    const handlePreviousStep = () => {
        if (step === 2) setStep(1);
    };

    
const checkTokenAndRedirect = async (token) => {
        try {
            const response = await axios.post(API_ROUTES.sessionCheck, { token });
            if (response.data.exists) {
                nav('/welcome');
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

    return (
<div className="signup-sign-up-page-card-main-div-signup">
    <div className="signup-sign-up-page-card">
        {step === 2 && (
            <button className="signup-sign-up-page-back-btn" onClick={handlePreviousStep}>
                <FaArrowLeft />
            </button>
        )}
        {loading && <LoadingSpinner />}
        
        {/* Step 1 Heading */}
        {step === 1 && (
            <>
                <h2 className="signup-sign-up-page-heading">Create Your Account</h2>
                <p className="signup-sign-up-page-subtext">
                    Welcome to Edusify: AI-Powered Platform for Students!
                </p>
            </>
        )}
        
        {/* Step 2 Heading */}
        {step === 2 && (
            <>
                <h2 className="signup-sign-up-page-heading-step-2">Choose Your User name</h2>
            </>
        )}

        <form onSubmit={handleSubmit} className="signup-sign-up-page-form">
            {error && <p className="signup-sign-up-page-error">{error}</p>}
            {step === 1 && (
                <>
                    <div className="signup-sign-up-page-input-group">
                        <FaEnvelope className="signup-sign-up-page-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="signup-sign-up-page-input"
                            autoComplete="email"
                            aria-label="Enter your email"
                        />
                    </div>
                    <div className="signup-sign-up-page-input-group">
                        <FaLock className="signup-sign-up-page-icon" />
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="signup-sign-up-page-input"
                            autoComplete="new-password"
                            aria-label="Enter your password"
                        />
                        <span
                            className="signup-sign-up-page-toggle-password"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Change the icon based on visibility */}
                        </span>
                    </div>
                    <div className="signup-sign-up-page-input-group">
                        <FaPhone className="signup-sign-up-page-icon" />
                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="Phone Number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                            className="signup-sign-up-page-input"
                            autoComplete="tel"
                            aria-label="Enter your phone number"
                        />
                    </div>
                </>
            )}

{step === 2 && (
    <>
        <div className={`signup-sign-up-page-input-group ${uniqueIdStatus}`}>
            <span className="signup-sign-up-page-username-prefix"><FaUser/></span> {/* Prefix for the username */}
            <input
                type="text"
                name="unique_id"
                placeholder="User Name"
                value={formData.unique_id}
                onChange={handleChange}
                required
                className="signup-sign-up-page-input"
                aria-label="Enter your user name"
            />
            {uniqueIdStatus === 'available' && <p className="signup-sign-up-page-status-icon available" >available</p>}
            {uniqueIdStatus === 'taken' && <p className="signup-sign-up-page-status-icon taken" >taken</p>}
        </div>
        {uniqueIdSuggestions.length > 0 && (
            <div className="signup-sign-up-page-suggestions">
                <p>Suggestions:</p>
                {uniqueIdSuggestions.map((suggestion) => (
                    <span key={suggestion} onClick={() => handleSuggestionClick(suggestion)} className="signup-sign-up-page-suggestion">
                        {suggestion}
                    </span>
                ))}
            </div>
        )}
        <div className="signup-sign-up-page-checkbox-container" style={{ marginTop: '20px' }}>
            <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                required
                className="signup-sign-up-page-checkbox"
                aria-label="Accept Terms and Conditions"
            />
            <label htmlFor="terms" className="signup-sign-up-page-checkbox-label">
                I agree to the <Link to="/terms" className="signup-sign-up-page-link" style={{ color: 'white' }}>Terms and Conditions</Link>
            </label>
        </div>
    </>
)}

            {step === 1 && (
                <button type="button" onClick={handleNextStep} className="signup-sign-up-page-submit-button">
                    Start Your Journey with Edusify
                </button>
            )}

            {step === 2 && (
                <button type="submit" disabled={!termsAccepted} className="signup-sign-up-page-submit-button">
                     Sign Up
                </button>
            )}
        </form>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'white', marginTop: '20px' }}>
            Already have an account?
            <span style={{ fontWeight: 'bold', color: 'white' }}>
                <Link to='/login' style={{color: 'white'}}> Login</Link>
            </span>
        </p>
    </div>
</div>



    );
};

export default SignUp;

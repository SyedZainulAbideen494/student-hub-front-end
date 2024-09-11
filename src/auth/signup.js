import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
    const [step, setStep] = useState(1); // Step tracking
    const nav = useNavigate();

    useEffect(() => {
        const checkUniqueId = async () => {
            if (formData.unique_id) {
                try {
                    const response = await fetch(API_ROUTES.checkUniqueId, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ unique_id: formData.unique_id }),
                    });
                    if (response.ok) {
                        setUniqueIdStatus('available');
                        fetchUniqueIdAlternatives();
                    } else {
                        setUniqueIdStatus('taken');
                        setUniqueIdSuggestions([]);
                    }
                } catch (error) {
                    console.error('Error checking unique_id:', error);
                    setUniqueIdStatus('error');
                }
            }
        };
        checkUniqueId();
    }, [formData.unique_id]);

    const fetchUniqueIdAlternatives = async () => {
        try {
            const response = await fetch(API_ROUTES.generateAlternatives, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unique_id: formData.unique_id }),
            });
            if (response.ok) {
                const { alternatives } = await response.json();
                setUniqueIdSuggestions(alternatives);
            } else {
                console.error('Error fetching alternatives');
            }
        } catch (error) {
            console.error('Error fetching alternatives:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleTermsChange = (e) => setTermsAccepted(e.target.checked);

    const validateForm = () => {
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
                email: '',
                password: '',
                unique_id: '',
                phone_number: '',
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

        // Check token and redirect
const checkTokenAndRedirect = async (token, navigate) => {
    try {
      const response = await axios.post(API_ROUTES.sessionCheck, { token });
  
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
    const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
    checkTokenAndRedirect(token, nav);
  }, [nav]);

    const handleSuggestionClick = (suggestion) => {
        setFormData((prev) => ({ ...prev, unique_id: suggestion }));
        setUniqueIdStatus('available');
        setUniqueIdSuggestions([]);
    };

    const { email, password, unique_id, phone_number } = formData;

    const handleNextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const handlePreviousStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="signup-sign-up-page-card">
            {loading && <LoadingSpinner />}
            <h2 className="signup-sign-up-page-heading">Sign Up</h2>
            <div className="progress-bar">
                <div className={`progress ${step >= 1 ? 'filled' : ''}`}></div>
                <div className={`progress ${step >= 2 ? 'filled' : ''}`}></div>
                <div className={`progress ${step >= 3 ? 'filled' : ''}`}></div>
            </div>
            <form onSubmit={handleSubmit} className="signup-sign-up-page-form">
                {error && <p className="signup-sign-up-page-error">{error}</p>}
                
                {step === 1 && (
                    <>
                        <p className="signup-sign-up-page-info">We need your email and password to send you reminders and for security purposes.</p>
                        <div className="signup-sign-up-page-input-group">
                            <FaEnvelope className="signup-sign-up-page-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleChange}
                                required
                                className="signup-sign-up-page-input"
                            />
                        </div>
                        <div className="signup-sign-up-page-input-group">
                            <FaLock className="signup-sign-up-page-icon" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={handleChange}
                                required
                                className="signup-sign-up-page-input"
                            />
                            <span
                                className="signup-sign-up-page-toggle-password"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? 'Hide' : 'Show'}
                            </span>
                        </div>
                    </>
                )}
                
                {step === 2 && (
                    <>
                        <p className="signup-sign-up-page-info">We need your phone number to send group invites, WhatsApp reminders and for security reasons.</p>
                        <div className="signup-sign-up-page-input-group">
                            <FaPhone className="signup-sign-up-page-icon" />
                            <input
                                type="tel"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={phone_number}
                                onChange={handleChange}
                                required
                                className="signup-sign-up-page-input"
                            />
                        </div>
                    </>
                )}
                
                {step === 3 && (
                    <>
                        <p className="signup-sign-up-page-info">Choose a unique username to create your identity on our platform.</p>
                        <div className={`signup-sign-up-page-input-group ${uniqueIdStatus}`}>
                            <FaUser className="signup-sign-up-page-icon" />
                            <input
                                type="text"
                                name="unique_id"
                                placeholder="User Name"
                                value={unique_id}
                                onChange={handleChange}
                                required
                                className="signup-sign-up-page-input"
                            />
                            {uniqueIdStatus === 'available' && <FaCheckCircle className="signup-sign-up-page-status-icon available" />}
                            {uniqueIdStatus === 'taken' && <FaTimesCircle className="signup-sign-up-page-status-icon taken" />}
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
                    </>
                )}
                
                {step > 1 && <button type="button" onClick={handlePreviousStep} className="signup-sign-up-page-button">Previous</button>}
                {step < 3 && <button type="button" onClick={handleNextStep} className="signup-sign-up-page-button">Next</button>}
                {step === 3 && (
                    <div>
                        <div className="signup-sign-up-page-checkbox-container">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                onChange={handleTermsChange}
                                required
                                className="signup-sign-up-page-checkbox"
                            />
                            <label htmlFor="terms" className="signup-sign-up-page-checkbox-label">
                                I agree to the <Link to='/terms-and-conditions' className="signup-sign-up-page-link">Terms and Conditions</Link>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !termsAccepted || uniqueIdStatus === 'taken'}
                            className="signup-sign-up-page-submit-button"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                )}
                <p className="signup-sign-up-page-login-link">
                    Already have an account? <Link to="/login" className="signup-sign-up-page-link">Login here</Link>.
                </p>
            </form>
        </div>
    );
};

export default SignUp;

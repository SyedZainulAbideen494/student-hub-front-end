import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'; // Updated CSS file name
import { API_ROUTES } from '../app_modules/apiRoutes';
import LoadingSpinner from '../app_modules/LoadingSpinner';

const SignUp = () => {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: '',
        unique_id: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uniqueIdStatus, setUniqueIdStatus] = useState('');
    const [uniqueIdSuggestions, setUniqueIdSuggestions] = useState([]);
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
                phone: '',
                email: '',
                password: '',
                unique_id: ''
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

    const handleSuggestionClick = (suggestion) => {
        setFormData((prev) => ({ ...prev, unique_id: suggestion }));
        setUniqueIdStatus('available');
        setUniqueIdSuggestions([]);
    };

    const { phone, email, password, unique_id } = formData;

    return (
        <div className="signup-sign-up-page-card">
            {loading && <LoadingSpinner />}
            <h2 className="signup-sign-up-page-heading">Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-sign-up-page-form">
                {error && <p className="signup-sign-up-page-error">{error}</p>}

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
                    <FaPhone className="signup-sign-up-page-icon" />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={phone}
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
                    {uniqueIdStatus === 'available' && <span className="signup-sign-up-page-status-icon">&#10003;</span>}
                    {uniqueIdStatus === 'taken' && <span className="signup-sign-up-page-status-icon">&#10007;</span>}
                </div>
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
                <button type="submit" disabled={loading || !termsAccepted} className={`signup-sign-up-page-button ${loading || !termsAccepted ? 'disabled' : ''}`}>Sign Up</button>
            </form>
            <div className="signup-sign-up-page-links">
                <Link to="/" className="signup-sign-up-page-link">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default SignUp;


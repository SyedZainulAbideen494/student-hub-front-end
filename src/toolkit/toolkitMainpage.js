import React, { useState } from 'react'; // Import useState for managing feedback state
import axios from 'axios'; // Import axios for API requests
import { Link } from 'react-router-dom'; // Import Link for routing
import './ToolkitPage.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faChartBar, faArrowsAltV } from '@fortawesome/free-solid-svg-icons'; // Icons for GPA Calculator and Unit Converter
import FooterNav from '../app_modules/footernav';
import { API_ROUTES } from '../app_modules/apiRoutes';

// Define the individual app components
const Calculator = () => <div>Calculator Component</div>;
const GpaCalculator = () => <div>GPA Calculator Component</div>; // Add this component
const UnitConverter = () => <div>Unit Converter Component</div>; // Add this component

const ToolkitPage = () => {
    const [feedback, setFeedback] = useState(''); // State to hold feedback input
    const [loading, setLoading] = useState(false); // State to manage loading status
    const [successMessage, setSuccessMessage] = useState(''); // State to hold success message

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token'); // Retrieve token from local storage

        try {
            const response = await axios.post(API_ROUTES.feedbackEduisfy, { feedback, token }); // Send token with feedback
            setSuccessMessage('Feedback submitted successfully!'); // Set success message
            setFeedback(''); // Clear the feedback after submission
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSuccessMessage('Error submitting feedback, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolkit__main__page">
            <header className="toolkit__header__page">
                <h1 className="header__title__page">Toolkit</h1>
            </header>
            <div className="app__list__page">
                <div className="app__card__page">
                    <FontAwesomeIcon icon={faCalculator} size="2x" />
                    <h2>Calculator</h2>
                    <p className="app__description__page">
                        A simple calculator to perform basic arithmetic operations.
                    </p>
                    <p className="app__author__page">by Edusify</p>
                    <Link to="/toolkit/calculator" className="open__app__button__page" style={{textDecoration: 'none'}}>Open App</Link>
                </div>

                <div className="app__card__page">
                    <FontAwesomeIcon icon={faChartBar} size="2x" />
                    <h2>GPA Calculator</h2>
                    <p className="app__description__page">
                        Calculate your GPA based on your course grades easily.
                    </p>
                    <p className="app__author__page">by Edusify</p>
                    <Link to="/toolkit/gpa/calculator" className="open__app__button__page" style={{textDecoration: 'none'}}>Open App</Link>
                </div>

                <div className="app__card__page">
                    <FontAwesomeIcon icon={faArrowsAltV} size="2x" />
                    <h2>Unit Converter</h2>
                    <p className="app__description__page">
                        Convert between different units of measurement quickly.
                    </p>
                    <p className="app__author__page">by Edusify</p>
                    <Link to="/toolkit/unitconverter" className="open__app__button__page" style={{textDecoration: 'none'}}>Open App</Link>
                </div>
            </div>

            {/* Suggestion Form */}
            <div className="suggestion__form__container__toolkit__main__page">
    <h2>Suggest an App</h2>
    <form onSubmit={handleSubmit}>
        <textarea
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type your suggestion here..."
            required
        />
        <button type="submit" disabled={loading} className="submit__button__toolkit__main__page">
            {loading ? 'Submitting...' : 'Submit'}
        </button>
    </form>
    <p className={`success__message__toolkit__main__page ${successMessage ? 'show' : ''}`}>
        {successMessage}
    </p>
</div>


            <FooterNav />
        </div>
    );
};

export default ToolkitPage;

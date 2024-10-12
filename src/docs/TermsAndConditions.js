import React from 'react';
import './PageStyles.css';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div className="policy__page">
            <h1 className="heading__policy__page">Terms and Conditions</h1>
            <p className="content__policy__page">
                By using this app, you agree to the following terms:
            </p>
            <ul className="content__policy__page">
                <li>You must be at least 14 years old to use this app.</li>
                <li>Do not share your account details with others.</li>
                <li>Any inappropriate behavior in the app will lead to account suspension.</li>
                <li>By agreeing to these terms, you also agree to our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/more-info">More Information</Link>.</li>
            </ul>
            <p className="content__policy__page">
                For more details, please review our Privacy Policy and More Information pages.
            </p>
        </div>
    );
};

export default TermsAndConditions;

import React from 'react';
import './PageStyles.css';

const MoreInfo = () => {
    return (
        <div className="policy__page">
            <h1 className="heading__policy__page">More Information</h1>
            <p className="content__policy__page">
                This app is designed for students aged 14-25 to help them manage their tasks, events, and questions in an interactive and efficient way.
            </p>
            <p className="content__policy__page">
                We use the data collected to:
                <ul>
                    <li>Improve the user experience</li>
                    <li>Generate reports and analytics</li>
                    <li>Provide personalized recommendations</li>
                </ul>
            </p>
            <p className="content__policy__page">
                For any questions, contact us at: edusyfy@gmail.com
            </p>
        </div>
    );
};

export default MoreInfo;

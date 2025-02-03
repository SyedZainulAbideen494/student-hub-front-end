import React, { useState } from 'react';
import TestGeneration from './testGenerate';
import TestAttempt from './TestAttempt';
import TestSubmit from './TestSubmit';

const TestModeApp = () => {
    const [test, setTest] = useState(null);
    const [submittedAnswers, setSubmittedAnswers] = useState(null);

    const handleSubmitTest = (answers) => {
        setSubmittedAnswers(answers);
    };

    return (
        <div>
            {!test ? (
                <TestGeneration setTest={setTest} />
            ) : !submittedAnswers ? (
                <TestAttempt test={test} submitTest={handleSubmitTest} />
            ) : (
                <TestSubmit testId={test.testId} answers={submittedAnswers} />
            )}
        </div>
    );
};

export default TestModeApp;

import React, { useState } from 'react';
import WelcomeStep from './WelcomeStep';
import TaskStep from './TaskStep';
import EventStep from './EventStep';
import FlashcardStep from './FlashcardStep';
import AllSetStep from './AllSetStep';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [taskData, setTaskData] = useState({ title: '', description: '', dueDate: '', priority: 'normal', emailReminder: false });
    const [eventData, setEventData] = useState({ title: '', date: '' });
    const [setName, setSetName] = useState('');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    return (
        <div>
            {step === 1 && <WelcomeStep onNext={handleNext} />}
            {step === 2 && (
                <TaskStep
                    taskData={taskData}
                    setTaskData={setTaskData}
                    onBack={handleBack}
                    onNext={handleNext}  // This will trigger 'Next' on the modal
                />
            )}
            {step === 3 && (
                <FlashcardStep
                setName={setName}
                setSubject={setSubject}
                setTopic={setTopic}
                setSelectedFile={setSelectedFile}
                createSet={handleNext}  // This will trigger 'Next' on the modal
                generateFlashcards={handleNext}  // This will trigger 'Next' on the modal
                onBack={handleBack}
            />
            )}
            {step === 4 && (
                <AllSetStep />
            )}
   
        </div>
    );
};

export default Onboarding;

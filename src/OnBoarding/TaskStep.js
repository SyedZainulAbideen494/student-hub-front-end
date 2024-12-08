import React, { useState } from 'react';
import './TaskStep.css';

const TaskStep = ({ taskData, setTaskData, onBack, onNext }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSave = () => {
        setShowSuccessModal(true);
    };

    return (
        <div className="container__onboarding__page__component__tasks">
              <div className="task__card">
            <h2 className="heading__onboarding__page__component__tasks">Add Your First Task</h2>
            <input
                className="input__onboarding__page__component__tasks"
                type="text"
                placeholder="Task Title"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
            <textarea
                className="textarea__onboarding__page__component__tasks"
                placeholder="Task Description"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
            <label className="label__onboarding__page__component__tasks">
                Priority:
                <select
                    className="select__onboarding__page__component__tasks"
                    value={taskData.priority}
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
            </label>
            <label className="label__onboarding__page__component__tasks">
                Due Date:
                <input
                    className="input__onboarding__page__component__tasks"
                    type="date"
                    value={taskData.dueDate}
                    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                />
            </label>
            <label className="label__onboarding__page__component__tasks">
                Email Reminder:
                <input
                    className="checkbox__onboarding__page__component__tasks"
                    type="checkbox"
                    checked={taskData.emailReminder}
                    onChange={(e) => setTaskData({ ...taskData, emailReminder: e.target.checked })}
                />
            </label>
            <button className="button__onboarding__page__component__tasks save__onboarding__page__component__tasks" onClick={handleSave}>
                Add Task
            </button>

            </div>

            {showSuccessModal && (
                <div className="modal__onboarding__page__component__modal">
                <div className="modal-content__onboarding__page__component__modal">
                  <h3 className="modal-heading__onboarding__page__component__modal">🚀 Boom! Task Added!</h3>
                  <p className="modal-text__onboarding__page__component__modal">
                    You're on fire! 🔥 Looks like you're off to a blazing start—keep slaying those tasks like a productivity superhero! 🦸‍♂️🦸‍♀️
                  </p>
                  <button
                    className="button__onboarding__page__component__modal next__onboarding__page__component__modal"
                    onClick={onNext}
                  >
                    Next
                  </button>
                </div>
              </div>
              
            )}
        </div>
    );
};

export default TaskStep;

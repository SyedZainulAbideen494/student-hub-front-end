// TaskManagerGuidePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './helpMain.css'; // Ensure this file contains the necessary styling

const TaskManagerGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="blog-container-help-page">
      <button className="back-button-help-page" onClick={() => navigate(-1)}>
        ←
      </button>
      <article className="blog-article-help-page">
        <header className="blog-header-help-page">
          <h1 className="blog-title-help-page">Task Management</h1>
        </header>
        <section className="blog-introduction-help-page">
          <p>Organize your academic life with Edusify's Task Management feature!</p>
        </section>
        <section className="blog-content-help-page">
          <p>
            Staying organized is key to academic success, and Edusify makes it easier than ever. Our Task Management feature helps you keep track of all your assignments, deadlines, and study sessions in one place. Here’s how you can use the Task Management page effectively:
          </p>

          <h3>Step-by-Step Guide to Using the Task Manager</h3>

          <ol>
            <li>
              <strong>Navigate to the Planner Page:</strong> Start by clicking on the "Planner" tab in the navigation bar below. This will take you to the Study Planner page where you can manage all your tasks.
            </li>
            <li>
              <strong>Understanding the Planner Layout:</strong> On the Study Planner page, you'll see three main sections:
              <ul>
                <li>
                  <strong>Calendar:</strong> Displays all your tasks by date. Any date with a task assigned will be highlighted. Select a specific date to view tasks for that day.
                </li>
                <li>
                  <strong>Specific Date Tasks:</strong> Shows tasks specifically for the selected date on the calendar. This helps you focus on what needs to be done for that particular day.
                </li>
                <li>
                  <strong>All Tasks:</strong> Displays all tasks across all dates, giving you a comprehensive overview of everything you have planned.
                </li>
              </ul>
            </li>
            <li>
              <strong>Adding a Task:</strong>
              <ul>
                <li>Go to the <strong>Add Task</strong> section on the page.</li>
                <li>Fill in the task details, including Title, Description, Due Date, and Priority.</li>
                <li>Click the "Add Task" button to save the task.</li>
              </ul>
            </li>
            <li>
              <strong>Managing Tasks:</strong>
              <ul>
                <li>
                  <strong>Mark Task as Completed:</strong> Once you finish a task, simply click on the "Completed Task" button next to it to mark it as done.
                </li>
                <li>
                  <strong>Editing Tasks:</strong> If you need to make changes to a task, click on the "Edit" button. This allows you to update the task details like the description, due date, or priority.
                </li>
              </ul>
            </li>
          </ol>

          <h3>Additional Tips for Effective Task Management</h3>
          <ul>
            <li>Prioritize tasks by urgency and importance. Use the Priority setting to distinguish between high, medium, and low-priority tasks.</li>
            <li>Use the calendar view to get a quick overview of your study schedule and avoid overloading yourself on any single day.</li>
            <li>Set realistic goals and deadlines. Break larger tasks into smaller, manageable subtasks to avoid feeling overwhelmed.</li>
            <li>Review your tasks daily. Spend a few minutes each morning reviewing your tasks for the day to stay on track.</li>
            <li>Reflect on completed tasks weekly to assess your productivity and adjust your study plan accordingly.</li>
          </ul>
        </section>

        <section className="blog-tips-help-page">
          <h3>Additional Tips</h3>
          <ul>
            <li>Use the study planner to block out dedicated study times and ensure you have adequate breaks.</li>
            <li>Regularly update your planner with any new tasks or changes to stay organized.</li>
            <li>Try color-coding tasks for different subjects to quickly identify which tasks belong to which course.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default TaskManagerGuidePage;
import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import './TakeBirthDay.css';
import { API_ROUTES } from './apiRoutes';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import format from date-fns

const BirthdayModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [birthday, setBirthday] = useState(null); // Store Date object, not string

  const checkModalConditions = () => {
    const firstSignInTime = localStorage.getItem('firstSignInTime');
    const birthdaySubmitted = localStorage.getItem('birthdaySubmitted');
    const lastShownTime = localStorage.getItem('lastShownBirthdayModal'); // Get last shown time

    if (birthdaySubmitted === 'true') {
      setIsOpen(false);
      return;
    }

    const currentTime = new Date().getTime();

    if (!firstSignInTime) {
      localStorage.setItem('firstSignInTime', currentTime);
    } else {
      const timeSinceSignIn = (currentTime - firstSignInTime) / (1000 * 60 * 60); 

      // Check if the modal was shown in the last 3 minutes
      if (lastShownTime && currentTime - lastShownTime < 3 * 60 * 1000) {
        return; // Don't show the modal if it was shown in the last 3 minutes
      }

      // Show the modal if 3 hours have passed since the first sign-in, or after 3 minutes if the modal was just closed
      if (timeSinceSignIn >= 3) {
        setIsOpen(true);
      }
    }
  };

  const handleBirthdaySubmit = async () => {
    const token = localStorage.getItem('token'); // Replace 'authToken' with the key storing your token

    if (birthday) {
      const formattedBirthday = format(birthday, 'yyyy-MM-dd'); // Format date to 'YYYY-MM-DD'
      
      try {
        await axios.put(
          API_ROUTES.addUserBirthday,
          { birthday: formattedBirthday }, // Send formatted date
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );
        localStorage.setItem('birthdaySubmitted', 'true');
        setIsOpen(false);
      } catch (error) {
        console.error('Error updating birthday:', error);
      }
    } else {
      alert('Please select your birthday.');
    }
  };

  const handleLaterClick = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('lastShownBirthdayModal', currentTime); // Store the time when modal is shown
    setIsOpen(false);
  };

  useEffect(() => {
    checkModalConditions();
  }, []);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="custom-datepicker-button" onClick={onClick} ref={ref}>
      {value || "Select your birthday"}
    </button>
  ));

  return (
    isOpen && (
      <div className="modal__birthDay_modal__page">
        <div className="modal-content__birthDay_modal__page animate__birthDay_modal__page">
          <div className="svg-container__birthDay_modal__page">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="svg__birthDay_modal__page"
            >
              <rect x="20" y="50" width="60" height="30" fill="#ffedd5" rx="5" />
              <rect x="25" y="45" width="50" height="10" fill="#fca5a5" rx="3" />
              <circle cx="35" cy="40" r="3" fill="#fde68a" />
              <circle cx="50" cy="40" r="3" fill="#fde68a" />
              <circle cx="65" cy="40" r="3" fill="#fde68a" />
              <rect x="48" y="20" width="4" height="15" fill="#fde047" />
              <polygon points="50,18 47,20 53,20" fill="#f87171" />
            </svg>
          </div>
          <h2 className="heading__birthDay_modal__page">When is Your Birthday?</h2>
          <p className="subheading__birthDay_modal__page">
            Enter your birthday to personalize your experience!
          </p>
          <DatePicker
  selected={birthday}
  onChange={(date) => setBirthday(date)}
  dateFormat="yyyy-MM-dd"
  maxDate={new Date()} // Prevent future dates
  showYearDropdown
  showMonthDropdown
  dropdownMode="select"
  calendarClassName="custom-calendar"
  wrapperClassName="datepicker-wrapper"
  customInput={<CustomInput />} // Use custom button to prevent typing
/>

          <div className="button-group__birthDay_modal__page">
            <button
              onClick={handleBirthdaySubmit}
              className="submit-btn__birthDay_modal__page"
            >
              Submit
            </button>
            <button
              onClick={handleLaterClick}
              className="later-btn__birthDay_modal__page"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BirthdayModal;

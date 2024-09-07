import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import './calendarPage.css';
import SuccessModal from '../app_modules/SuccessModal'; // Import the SuccessModal

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventTitle, setEventTitle] = useState('');
    const [userActivities, setUserActivities] = useState([]);
    const [eventDate, setEventDate] = useState(new Date());
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [modalMessage, setModalMessage] = useState(''); // State for modal message

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const fetchEvents = () => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.fetchEvents, { token })
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    const fetchUserActivities = () => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.fetchUserActivity, { token })
            .then(response => setUserActivities(response.data))
            .catch(error => console.error('Error fetching activities:', error));
    };

    useEffect(() => {
        fetchEvents();
        fetchUserActivities();
    }, []);

    const onDateChange = (date) => setSelectedDate(date);

    const onEventDateChange = (date) => setEventDate(date);

    const handleAddEvent = () => {
        const token = localStorage.getItem('token');
        const newEvent = {
            title: eventTitle,
            date: formatDate(eventDate),
            token,
        };
        axios.post(API_ROUTES.addEvent, newEvent)
            .then(response => {
                setEvents([...events, { id: response.data.id, ...newEvent }]);
                setEventTitle('');
                setEventDate(new Date());
                setIsFormVisible(false);
                setModalMessage('Event added successfully!');
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                }, 3000); // Hide modal after 3 seconds
            })
            .catch(error => console.error('Error adding event:', error));
    };

    const handleEditEvent = () => {
        const token = localStorage.getItem('token');
        const updatedEvent = {
            id: editingEventId,
            title: eventTitle,
            date: formatDate(eventDate),
            token,
        };
        axios.post(API_ROUTES.updateEvent, updatedEvent)
            .then(response => {
                setEvents(events.map(event =>
                    event.id === editingEventId ? updatedEvent : event
                ));
                setEventTitle('');
                setEventDate(new Date());
                setEditingEventId(null);
                setIsFormVisible(false);
                setModalMessage('Event updated successfully!');
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                }, 3000); // Hide modal after 3 seconds
            })
            .catch(error => console.error('Error updating event:', error));
    };

    const handleDeleteEvent = (id) => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.deleteEvent, { id, token })
            .then(() => {
                setEvents(events.filter(event => event.id !== id));
                setModalMessage('Event deleted successfully!');
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                }, 3000); // Hide modal after 3 seconds
            })
            .catch(error => console.error('Error deleting event:', error));
    };

    const toggleFormVisibility = (event = null) => {
        if (event) {
            setEditingEventId(event.id);
            setEventTitle(event.title);
            setEventDate(new Date(event.date));
        }
        setIsFormVisible(!isFormVisible);
    };

    const getEventsForDate = (date) => {
        const formattedDate = formatDate(date);
        return events.filter(event => formatDate(new Date(event.date)) === formattedDate);
    };

    return (
        <div className="calendar-page">
            <div className="header-title-calendar-page">Calendar and Activities</div>
            <div className="content-calendar-page">
                <div className="calendar-container-calendar-page">
                    <Calendar
                        onChange={onDateChange}
                        value={selectedDate}
                        tileClassName={({ date }) => getEventsForDate(date).length > 0 ? 'react-calendar__tile--has-events' : null}
                    />
                </div>
                <div className="event-form-calendar-page">
                    <button
                        className="toggle-form-button-calendar-page"
                        onClick={() => toggleFormVisibility(null)}
                    >
                        {isFormVisible ? 'Cancel' : 'Add Event'}
                    </button>
                    {isFormVisible && (
                        <div className="form-container-calendar-page">
                            <div className="section-title-calendar-page">{editingEventId ? 'Edit Event' : 'Add Event'}</div>
                            <input
                                type="text"
                                placeholder="Event Title"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                className="input-field-calendar-page"
                            />
                            <div className="event-date-picker-calendar-page">
                                <div className="section-title-calendar-page">Select Event Date</div>
                                <Calendar
                                    onChange={onEventDateChange}
                                    value={eventDate}
                                />
                            </div>
                            <button
                                className="submit-button-calendar-page"
                                onClick={editingEventId ? handleEditEvent : handleAddEvent}
                            >
                                {editingEventId ? 'Update Event' : 'Add Event'}
                            </button>
                        </div>
                    )}
                </div>
                <div className="event-lists-calendar-page">
                    <div className="event-list-calendar-page">
                        <div className="section-title-calendar-page">Events for {selectedDate.toDateString()}</div>
                        {getEventsForDate(selectedDate).length === 0 ? (
                            <div>No events for this date</div>
                        ) : (
                            getEventsForDate(selectedDate).map(event => (
                                <div key={event.id} className="event-item-calendar-page">
                                    <div className="event-title-calendar-page">{event.title}</div>
                                    <div className="event-date-calendar-page">{formatDate(new Date(event.date))}</div>
                                    <div className="button-container-calendar-page">
                                <button
                                    className="edit-button-calendar-page"
                                    onClick={() => handleEditEvent(event.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button-calendar-page"
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    Delete
                                </button>
                            </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="event-list-calendar-page">
                        <div className="section-title-calendar-page">All Events</div>
                        {events.length === 0 ? (
                            <div>No events available</div>
                        ) : (
                            events.map(event => (
                                <div key={event.id} className="event-item-calendar-page">
                                    <div className="event-title-calendar-page">{event.title}</div>
                                    <div className="event-date-calendar-page">{formatDate(new Date(event.date))}</div>
                                    <div className="button-container-calendar-page">
                                <button
                                    className="edit-button-calendar-page"
                                    onClick={() => handleEditEvent(event.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button-calendar-page"
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    Delete
                                </button>
                            </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <FooterNav />
            <SuccessModal visible={modalVisible} message={modalMessage} />
        </div>
    );
};

export default CalendarPage;

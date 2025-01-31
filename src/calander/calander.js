import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCalendarAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import './calendarPage.css';
import SuccessModal from '../app_modules/SuccessModal';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState('12:00'); // Default time
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [view, setView] = useState('month');

    const fetchEvents = () => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.fetchEvents, { token })
            .then(response => setEvents(response.data.map(event => ({
                ...event,
                start: new Date(event.datetime), // Use datetime instead of date
                end: new Date(event.datetime),
                title: event.title,
            }))))
            .catch(error => console.error('Error fetching events:', error));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAddEvent = () => {
        const token = localStorage.getItem('token');
        const datetime = `${moment(eventDate).format('YYYY-MM-DD')}T${eventTime}`; // Combine date and time
        const newEvent = {
            title: eventTitle,
            datetime, // Send datetime to the backend
            token,
        };
        axios.post(API_ROUTES.addEvent, newEvent)
            .then(response => {
                setEvents([...events, { id: response.data.id, ...newEvent, start: new Date(datetime), end: new Date(datetime) }]);
                setEventTitle('');
                setEventDate(new Date());
                setEventTime('12:00');
                setIsFormVisible(false);
                setModalMessage('🎉 Event added successfully!');
                setModalVisible(true);
                setTimeout(() => setModalVisible(false), 3000);
            })
            .catch(error => console.error('Error adding event:', error));
    };

    const handleEditEvent = () => {
        const token = localStorage.getItem('token');
        const datetime = `${moment(eventDate).format('YYYY-MM-DD')}T${eventTime}`; // Combine date and time
        const updatedEvent = {
            id: editingEventId,
            title: eventTitle,
            datetime, // Send datetime to the backend
            token,
        };
        axios.post(API_ROUTES.updateEvent, updatedEvent)
            .then(response => {
                setEvents(events.map(event =>
                    event.id === editingEventId ? { ...updatedEvent, start: new Date(datetime), end: new Date(datetime) } : event
                ));
                setEventTitle('');
                setEventDate(new Date());
                setEventTime('12:00');
                setEditingEventId(null);
                setIsFormVisible(false);
                setModalMessage('✏️ Event updated successfully!');
                setModalVisible(true);
                setTimeout(() => setModalVisible(false), 3000);
            })
            .catch(error => console.error('Error updating event:', error));
    };

    const handleDeleteEvent = (id) => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.deleteEvent, { id, token })
            .then(() => {
                setEvents(events.filter(event => event.id !== id));
                setModalMessage('🗑️ Event deleted successfully!');
                setModalVisible(true);
                setTimeout(() => setModalVisible(false), 3000);
            })
            .catch(error => console.error('Error deleting event:', error));
    };

    const toggleFormVisibility = (event = null) => {
        if (event) {
            setEditingEventId(event.id);
            setEventTitle(event.title);
            setEventDate(new Date(event.datetime));
            setEventTime(moment(event.datetime).format('HH:mm')); // Set time from existing event
        }
        setIsFormVisible(!isFormVisible);
    };

    const getTodayEvents = () => {
        return events.filter(event => moment(event.start).isSame(moment(), 'day'));
    };

    return (
        <div className="calendar__Page">
            <h2 className="header__title__calendar__Page">
                <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
            </h2>
            <div className="calendar__container__calendar__Page">
    <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        onSelectEvent={(event) => toggleFormVisibility(event)}
        style={{
            height: 500,
            margin: '20px 0',
            borderRadius: '20px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
        }}
    />
</div>
            <div className="event__lists__calendar__Page">
                <div className="today__events__calendar__Page">
                    <h3>Today's Events</h3>
                    {getTodayEvents().length === 0 ? (
                        <div className="no__events__message__calendar__Page">
                            <FontAwesomeIcon icon={faExclamationCircle} /> No events for today.
                        </div>
                    ) : (
                        getTodayEvents().map(event => (
                            <motion.div
                                key={event.id}
                                className="event__card__calendar__Page"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="event__title__calendar__Page">{event.title}</div>
                                <div className="event__date__calendar__Page">
                                    {moment(event.start).format('MMMM Do, YYYY h:mm A')} {/* Display date and time */}
                                </div>
                                <div className="event__actions__calendar__Page">
                                    <button onClick={() => toggleFormVisibility(event)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDeleteEvent(event.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        className="event__form__modal__calendar__Page"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        <h3>{editingEventId ? 'Edit Event' : 'Add Event'}</h3>
                        <input
                            type="text"
                            placeholder="Event Title"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                        <input
                            type="date"
                            value={moment(eventDate).format('YYYY-MM-DD')}
                            onChange={(e) => setEventDate(new Date(e.target.value))}
                        />
                        <input
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                        />
                        <button onClick={editingEventId ? handleEditEvent : handleAddEvent}>
                            {editingEventId ? 'Update Event' : 'Add Event'}
                        </button>
                        <button onClick={() => setIsFormVisible(false)}>Cancel</button>
                    </motion.div>
                )}
            </AnimatePresence>
            <button className="fab__calendar__Page" onClick={() => toggleFormVisibility()}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
           <FooterNav/>
            {modalVisible && <SuccessModal message={modalMessage} />}
        </div>
    );
};

export default CalendarPage;
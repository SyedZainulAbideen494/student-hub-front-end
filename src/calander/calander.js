import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { Button, TextField, Typography, Paper, Grid } from '@mui/material';
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
            <Typography variant="h5" className="header-title-calendar-page" style={{ marginBottom: '30px', marginTop: '20px' }}>Calendar and Activities</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper className="calendar-container">
                        <Calendar
                            onChange={onDateChange}
                            value={selectedDate}
                            tileClassName={({ date }) => getEventsForDate(date).length > 0 ? 'react-calendar__tile--has-events' : null}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className="event-form">
                        <Typography variant="h6" className="section-title">Manage Events</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => toggleFormVisibility(null)}
                            fullWidth
                        >
                            {isFormVisible ? 'Cancel' : 'Add Event'}
                        </Button>
                        {isFormVisible && (
                            <div className="form-container">
                                <Typography variant="h6" className="section-title">{editingEventId ? 'Edit Event' : 'Add Event'}</Typography>
                                <TextField
                                    label="Event Title"
                                    variant="outlined"
                                    fullWidth
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    margin="normal"
                                />
                                <Typography variant="subtitle1">Select Event Date</Typography>
                                <Calendar
                                    onChange={onEventDateChange}
                                    value={eventDate}
                                    className="event-date-picker"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={editingEventId ? handleEditEvent : handleAddEvent}
                                    fullWidth
                                >
                                    {editingEventId ? 'Update Event' : 'Add Event'}
                                </Button>
                            </div>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <div className="event-list">
                <Typography variant="h6" className="section-title">Events for {selectedDate.toDateString()}</Typography>
                {getEventsForDate(selectedDate).length === 0 ? (
                    <Typography>No events for this date</Typography>
                ) : (
                    getEventsForDate(selectedDate).map(event => (
                        <Paper key={event.id} className="event-item">
                            <Typography variant="h6">{event.title}</Typography>
                            <Typography>{formatDate(new Date(event.date))}</Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDeleteEvent(event.id)}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => toggleFormVisibility(event)}
                            >
                                Edit
                            </Button>
                        </Paper>
                    ))
                )}
            </div>
            <div className="event-list">
                <Typography variant="h6" className="section-title">All Events</Typography>
                {events.length === 0 ? (
                    <Typography>No events available</Typography>
                ) : (
                    events.map(event => (
                        <Paper key={event.id} className="event-item">
                            <Typography variant="h6">{event.title}</Typography>
                            <Typography>{formatDate(new Date(event.date))}</Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDeleteEvent(event.id)}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => toggleFormVisibility(event)}
                            >
                                Edit
                            </Button>
                        </Paper>
                    ))
                )}
            </div>
            
            <FooterNav />
            <SuccessModal visible={modalVisible} message={modalMessage} />
        </div>
    );
};

export default CalendarPage;
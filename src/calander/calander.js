import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';
import { Button, TextField, Typography, Paper, Grid } from '@mui/material';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventTitle, setEventTitle] = useState('');
    const [userActivities, setUserActivities] = useState([]);
    const [eventDate, setEventDate] = useState(new Date());

    // Format date as YYYY-MM-DD
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
                console.log('Fetched events:', response.data); // Debugging
                setEvents(response.data);
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    const fetchUserActivities = () => {
        const token = localStorage.getItem('token');
        axios.post(API_ROUTES.fetchUserActivities, { token })
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
            })
            .catch(error => console.error('Error adding event:', error));
    };

    const getEventsForDate = (date) => {
        const formattedDate = formatDate(date);
        console.log('Selected date:', formattedDate); // Debugging

        const eventsForDate = events.filter(event => {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            console.log('Event date:', eventDate); // Debugging
            return eventDate === formattedDate;
        });

        console.log('Events for selected date:', eventsForDate); // Debugging
        return eventsForDate;
    };

    return (
        <div className="calendar-page">
            <Typography variant="h4" className="header-title">Calendar and Activities</Typography>
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
                        <Typography variant="h6" className="section-title">Add Event</Typography>
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
                            onClick={handleAddEvent}
                            fullWidth
                        >
                            Add Event
                        </Button>
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
                        </Paper>
                    ))
                )}
            </div>
            <div className="activity-list">
                <Typography variant="h6" className="section-title">Your Activities</Typography>
                {userActivities.length === 0 ? (
                    <Typography>No activities available</Typography>
                ) : (
                    userActivities.map(activity => (
                        <Paper key={activity.id} className="activity-item">
                            <Typography variant="h6">{activity.quiz_title}</Typography>
                            <Typography>Date: {new Date(activity.completed_at).toLocaleDateString()}</Typography>
                            <Typography>Score: {activity.score}</Typography>
                        </Paper>
                    ))
                )}
            </div>
            <FooterNav />
        </div>
    );
};

export default CalendarPage;
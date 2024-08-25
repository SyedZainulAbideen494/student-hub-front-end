import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Card,
    CardContent,
    Grid,
    Container,
    TextField,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPencilRuler, faUserGroup, faBook, faCalculator, faFlask, faMoneyBill, faQuestionCircle, faClock, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import FooterNav from '../app_modules/footernav';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const handleSearch = useCallback(
        async (searchQuery) => {
            try {
                const response = await axios.get(API_ROUTES.search, {
                    params: { query: searchQuery }
                });
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        },
        []
    );

    const debouncedSearch = useCallback(_.debounce(handleSearch, 300), [handleSearch]);

    useEffect(() => {
        if (query) {
            debouncedSearch(query);
        } else {
            setResults([]);
        }
    }, [query, debouncedSearch]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
                setProfile(data);
            } catch (err) {
                setError('Error fetching profile data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    const cardData = [
        { title: 'Planner', description: 'Plan your studies with your planner and add tasks.', icon: faPencilRuler, gradient: 'linear-gradient(to right, #ff9a9e, #fad0c4)', path: '/planner' },
        { title: 'Groups', description: 'Create groups, chat with friends, share notes, quizzes, and ask questions.', icon: faUserGroup, gradient: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', path: '/groups' },
        { title: 'Notes', description: 'Create digital notes, download as PDF, and share with friends.', icon: faBook, gradient: 'linear-gradient(to right, #fbc2eb, #a6c1ee)', path: '/notes' },
        { title: 'Math Helper', description: 'Get help with math problems.', icon: faCalculator, gradient: 'linear-gradient(to right, #84fab0, #8fd3f4)', path: '/math/solver' },
        { title: 'Science Helper', description: 'Get help with science questions.', icon: faFlask, gradient: 'linear-gradient(to right, #a18cd1, #fbc2eb)', path: '/science/helper' },
        { title: 'Commerce Helper', description: 'Get help with commerce questions.', icon: faMoneyBill, gradient: 'linear-gradient(to right, #fdcbf1, #e6dee9)', path: '/commerce/helper' },
        { title: 'Quizzes', description: 'Create quizzes, share with friends, and see results.', icon: faQuestionCircle, gradient: 'linear-gradient(to right, #cfd9df, #e2ebf0)', path: '/quiz/home' },
        { title: 'Calendar', description: 'Stay reminded of important dates.', icon: faCalendar, gradient: 'linear-gradient(to right, #FFEB3B, #FFC107)', color: '#000', path: '/calendar' },
        { title: 'Pomodoro Timer', description: 'Stay productive with Pomodoro timer.', icon: faClock, gradient: 'linear-gradient(to right, #d4fc79, #96e6a1)', path: '/pomodoro' },
        { title: 'Social Feed', description: 'Stay connected with updates and achievements.', icon: faShareAlt, gradient: 'linear-gradient(to right, #f7971e, #ffd200)', path: '/social-feed' },
    ];

    return (
        <div style={{ marginBottom: '100px' }}>
            <AppBar position="static" style={{ backgroundColor: '#fff', color: '#000', boxShadow: 'none' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                    <Avatar
                        src={`${API_ROUTES.displayImg}/${profile?.avatar}` || 'default-avatar-url'}
                        alt="Profile Picture"
                        style={{ width: 40, height: 40, cursor: 'pointer' }}
                        onClick={() => nav('/profile')}
                    />
                   
                </Toolbar>
                <Toolbar style={{ justifyContent: 'center', padding: '10px 20px' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by unique ID or User Name"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon style={{ marginRight: '10px' }} />
                            )
                        }}
                        style={{ borderColor: '#333', maxWidth: '500px' }}
                    />
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '20px', textAlign: 'center' }}>
                {results.length === 0 ? (
                    <Grid container spacing={3}>
                        {cardData.map((card, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    style={{
                                        background: card.gradient,
                                        color: card.title === 'Calendar' ? card.color : '#000',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        height: '100%',
                                        padding: '10px',
                                        textAlign: 'center',
                                        marginBottom: '5px'
                                    }}
                                    onClick={() => nav(card.path)} // Navigate on click
                                >
                                    <CardContent>
                                        <FontAwesomeIcon
                                            icon={card.icon}
                                            size="2x"
                                            style={{ color: card.title === 'Calendar' ? card.color : '#000' }}
                                        />
                                        <Typography variant="h6" style={{ margin: '10px 0' }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        {results.map((result, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    style={{
                                        background: '#fff',
                                        color: '#000',
                                        borderRadius: '25px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        padding: '10px',
                                        textAlign: 'center'
                                    }}
                                    onClick={() => nav(`/profile/${result.id}`)} // Navigate to result details
                                >
                                    <CardContent>
                                        <Avatar
                                            src={`${API_ROUTES.displayImg}/${result.avatar}` || 'default-avatar-url'}
                                            alt="Profile Picture"
                                            style={{ width: 40, height: 40, margin: 'auto' }}
                                        />
                                        <Typography variant="h8" style={{ margin: '10px 0' }}>
                                            {result.user_name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            <FooterNav />
        </div>
    );
};

export default SearchPage;
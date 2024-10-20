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
import './searchPage.css';
import SearchPageTutorial from './SearchPageTutorial';
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0); // Added state for pagination
    const nav = useNavigate();
    const [showTutorial, setShowTutorial] = useState(true); // State to control tutorial visibility

    useEffect(() => {
        // Check local storage for tutorial completion status
        const completed = localStorage.getItem('searchPageTutorialComplete');
        if (completed) {
            setShowTutorial(false); // Set showTutorial to false if found
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false); // Hide tutorial when complete
        localStorage.setItem('searchPageTutorialComplete', 'true'); // Store completion status in local storage
    };

    const handleSearch = useCallback(
        async (searchQuery) => {
            try {
                const response = await axios.get(API_ROUTES.search, {
                    params: { query: searchQuery }
                });
                // Set results and reset page for new queries
                setResults(response.data);
                setPage(0);
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
            setPage(0); // Reset page if query is cleared
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

    const loadMoreResults = () => {
        setLoading(true);
        setTimeout(() => {
            setPage((prevPage) => prevPage + 1); // Load next set of results
            setLoading(false);
        }, 2000); // Simulate a 2-second loading time
    };



    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    const itemsPerPage = 3; // Number of items to display per page
    const displayedResults = results.slice(0, (page + 1) * itemsPerPage); // Calculate displayed results based on page

    const cardData = [
        { title: 'Planner', description: 'Plan your studies with your planner and add tasks.', icon: faPencilRuler, gradient: 'linear-gradient(to right, #ff7e5f, #feb47b)', path: '/' },
        { title: 'Groups', description: 'Create groups, chat with friends, share notes, quizzes, and ask questions.', icon: faUserGroup, gradient: 'linear-gradient(to right, #4facfe, #00f2fe)', path: '/groups' },
        { title: 'Notes', description: 'Create digital notes, download as PDF, and share with friends.', icon: faBook, gradient: 'linear-gradient(to right, #667eea, #764ba2)', path: '/notes' },
        { title: 'Quizzes', description: 'Create quizzes, share with friends, and see results.', icon: faQuestionCircle, gradient: 'linear-gradient(to right, #24c6dc, #514a9d)', path: '/quiz/home' },
        { title: 'Calendar', description: 'Stay reminded of important dates.', icon: faCalendar, gradient: 'linear-gradient(to right, #b24592, #f15f79)', color: '#000', path: '/calendar' },
        { title: 'Pomodoro Timer', description: 'Stay productive with Pomodoro timer.', icon: faClock, gradient: 'linear-gradient(to right, #e1eec3, #f05053)', path: '/pomodoro' },
        { title: 'Social Feed', description: 'Stay connected with updates and achievements.', icon: faShareAlt, gradient: 'linear-gradient(to right, #30cfd0, #330867)', path: '/social-feed' },
    ];

    return (
        <div style={{ marginBottom: '100px' }}>
             {showTutorial && <SearchPageTutorial onComplete={handleTutorialComplete} />}
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
                        placeholder="Search by Name or User Name"
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
                {displayedResults.length === 0 ? (
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
                    <div>
                    <Grid container spacing={3}>
                        {displayedResults.map((result, index) => (
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
                                            style={{ width: 60, height: 60, margin: '0 auto 10px' }}
                                        />
                                        <Typography variant="body2">
                                            {result.unique_id}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                
                            </Grid>
                        ))}
                    </Grid>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
        {!loading && ( // Only show the button when not loading
            <button
                onClick={loadMoreResults}
                className="btn__load__more__search" // Keep this class name
                disabled={loading}
            >
                Load More
            </button>
        )}
    </div>
    {loading && <CircularProgress style={{ marginTop: '10px' }} />}
</div>
                    </div>
                )}
             
            </Container>
            <FooterNav />
        </div>
    );
};

export default SearchPage;

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
    CardMedia,
    Grid,
    Container,
    TextField,
    CircularProgress,
    Box,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
                const response = await axios.get('http://localhost:8080/search', {
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

    return (
        <div>
            <AppBar position="static" style={{ backgroundColor: '#fff', color: '#000', boxShadow: 'none' }}>
                <Toolbar style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <Avatar
                            src={`${API_ROUTES.displayImg}/${profile?.avatar}` || 'default-avatar-url'}
                            alt="Profile Picture"
                            style={{ width: 40, height: 40 }}
                        />
                        <Typography variant="h6" style={{ marginLeft: '10px', fontSize: '1.2rem' }}>
                        </Typography>
                    </div>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search users "
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            )
                        }}
                        style={{ marginTop: '15px', borderColor: '#333' }}
                    />
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '20px', textAlign: 'center' }}>
                {results.length === 0 ? (
                    <Box>
                        <img
                            src="https://media.giphy.com/media/M7zZydjqVj61G/giphy.gif" // Example anime icon
                            alt="No results"
                            style={{ width: '150px', height: '150px', marginBottom: '10px' }}
                        />
                        <Typography variant="h6" color="text.secondary">
                            No results found! 😔
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            "The only limit to our realization of tomorrow is our doubts of today."
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {results.map((user) => (
                            <Grid item xs={12} sm={6} md={4} key={user.unique_id}>
                                <Card
                                    onClick={() => nav(`/profile/${user.id}`)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: '#f5f5f5',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt="User Avatar"
                                        height="60"
                                        image={`${API_ROUTES.displayImg}/${user.avatar}` || 'default-avatar-url'}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            marginRight: '10px'
                                        }}
                                    />
                                    <CardContent style={{ padding: '8px' }}>
                                        <Typography variant="h6" component="div" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                            {user.user_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.75rem', color: '#666' }}>
                                            {user.unique_id}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            <FooterNav/>
        </div>
    );
};

export default SearchPage;
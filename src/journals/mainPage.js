import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JournalPage = () => {
  const [journals, setJournals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch journals from the backend
  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get('http://localhost:8080/api/journals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJournals(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching journals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // Function to handle adding a new journal
  const handleAddJournal = () => {
    // Logic to add a new journal
    // You can show a modal or redirect to another page for creating a new journal
  };

  // Function to handle search
  const handleSearch = () => {
    const filteredJournals = journals.filter((journal) =>
      journal.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setJournals(filteredJournals);
  };

  return (
    <div>
      <h1>Your Journals</h1>
      <button onClick={handleAddJournal}>Add New Journal</button>

      <input
        type="text"
        placeholder="Search journals"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading ? (
        <p>Loading journals...</p>
      ) : (
        <div>
          {journals.length === 0 ? (
            <p>No journals available. Add one!</p>
          ) : (
            <ul>
              {journals.map((journal) => (
                <li key={journal.id}>
                  <h3>{journal.title}</h3>
                  <p>{journal.content}</p>
                  {/* Add other details like date, media links, etc. */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalPage;

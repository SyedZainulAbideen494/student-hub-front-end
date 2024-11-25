import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './StoryGame.css';

function StoryGame() {
  const [story, setStory] = useState('');
  const [choices, setChoices] = useState([]);
  const [userChoice, setUserChoice] = useState('');
  const [storyStarted, setStoryStarted] = useState(false);
  const [storyType, setStoryType] = useState('');
  const [storyDetails, setStoryDetails] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const storyContainerRef = useRef(null);

  useEffect(() => {
    // Check if the story is already started from localStorage
    const ongoingStory = localStorage.getItem('storyStarted');
    if (ongoingStory === 'true') {
      setStoryStarted(true);
      checkRunningStory(); // Retrieve the ongoing story if it exists
    }
  }, []);

  useEffect(() => {
    // Check if the story is starting (i.e., it's not ongoing yet)
    if (story && !userChoice) {
      if (storyContainerRef.current) {
        storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
      }
    }
  }, [story, userChoice]);

  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
    }
  }, [story]);

  // Fetch the entire story when the page is loaded
  useEffect(() => {
    const fetchFullStory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/story/full', {
          params: { token: token },
        });
        
        if (response.data.fullStory) {
          setStory(response.data.fullStory); // Set the full story text
          setChoices([]); // Clear choices since it's a full story
        }
      } catch (error) {
        console.error('Error fetching full story:', error);
      }
    };

    // Only fetch if there is a story to load
    const ongoingStory = localStorage.getItem('storyStarted');
    if (ongoingStory === 'true') {
      fetchFullStory();
    }
  }, []);

  const checkRunningStory = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:8080/api/story/running', {
        params: { token: token },
      });

      if (response.data.ongoing) {
        setStory(response.data.story);
        setChoices(response.data.choices);
        setStoryStarted(true);
      }
    } catch (error) {
      console.error('Error checking for running story:', error);
    }
  };

  const startStory = async () => {
    setLoading(true); // Set loading state to true when starting the story
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:8080/api/story/start', {
        token: token,
        storyType: storyType,
        details: storyDetails,
      });

      setStory(response.data.story);
      setChoices(response.data.choices);
      setStoryStarted(true);
      localStorage.setItem('storyStarted', 'true'); // Set story started flag to true
      localStorage.setItem('ongoingStory', JSON.stringify({
        story: response.data.story,
        choices: response.data.choices,
      }));
    } catch (error) {
      console.error('Error starting story:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const continueStory = async (choice) => {
    setLoading(true); // Set loading state to true when continuing the story
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('http://localhost:8080/api/story/continue', {
        token: token,
        choice: choice,
      });
  
      setStory(response.data.story);
      setChoices(response.data.choices);
      setUserChoice(choice);
  
      localStorage.setItem('ongoingStory', JSON.stringify({
        story: response.data.story,
        choices: response.data.choices,
      }));
    } catch (error) {
      console.error('Error continuing the story:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to clean the story text by removing '**' and other special formatting
  const cleanStoryText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1')  // Removes **bold**
               .replace(/__(.*?)__/g, '$1')      // Removes __italic__
               .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Removes markdown links like [text](url)
               .replace(/<\/?[^>]+(>|$)/g, "");   // Strips out any HTML tags if present
  };

  return (
    <div className="story-game__Story__game">
      {!storyStarted ? (
        <div className="story-not-started__Story__game">
          <input
            type="text"
            className="input-field__Story__game"
            placeholder="Story type"
            value={storyType}
            onChange={(e) => setStoryType(e.target.value)}
          />
          <input
            type="text"
            className="input-field__Story__game"
            placeholder="Details"
            value={storyDetails}
            onChange={(e) => setStoryDetails(e.target.value)}
          />
          <button className="start-button__Story__game" onClick={startStory}>Start Story</button>
        </div>
      ) : (
        <div className="story-started__Story__game">
          <div id="story-container" ref={storyContainerRef} className="story-container__Story__game">
            {story && story.split('\n').map((paragraph, index) => (
              <p key={index}>
                {cleanStoryText(paragraph)} {/* Clean the story text */}
              </p>
            ))}
          </div>

          <div className="choices__Story__game">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => continueStory(choice)}
                disabled={loading} // Disable buttons while loading
              >
                {loading ? 'Loading...' : cleanStoryText(choice)} {/* Clean the choice text */}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryGame;

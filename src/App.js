import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  // State to handle error message

  // Fetch recommendations from the backend
  const getRecommendations = async () => {
    setLoading(true);
    setErrorMessage('');  // Clear any previous errors
    try {
      const response = await axios.post('http://localhost:5000/recommend', { movie: selectedMovie });
      setRecommendations(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Movie not found in the dataset. Please try another movie.');
      } else {
        setErrorMessage('Error fetching recommendations. Please try again later.');
      }
    }
    setLoading(false);
  };

  // Handle Enter key press to trigger the recommendation query
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && selectedMovie) {
      getRecommendations();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍿 Movie Recommender</h1>
        <p>Discover movies based on your favorite ones!</p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter a movie name..."
        />
        <button onClick={getRecommendations} disabled={!selectedMovie || loading}>
          {loading ? 'Loading...' : 'Recommend'}
        </button>
      </div>

      {/* Display loading indicator while fetching recommendations */}
      {loading && <div className="loading-message">Fetching recommendations...</div>}

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {recommendations.length > 0 && !errorMessage && (
        <div className="recommendations">
          <h2>Recommended Movies:</h2>
          <div className="movies-grid">
            {recommendations.map((movie, index) => (
              <div key={index} className="movie-card">
                <img src={movie.poster_url} alt={movie.title} />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

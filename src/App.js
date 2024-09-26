import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recommendations from the backend
  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/recommend', { movie: selectedMovie });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
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
          placeholder="Enter a movie name..."
        />
        <button onClick={getRecommendations} disabled={!selectedMovie || loading}>
          {loading ? 'Loading...' : 'Recommend'}
        </button>
      </div>

      {recommendations.length > 0 && (
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
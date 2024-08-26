import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userId, setUserId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend', { user_id: userId });
      
      // Simulate a delay to show loader
      setTimeout(() => {
        setRecommendations(response.data.recommended_products);
        setError('');
        setLoading(false);
      }, 2000);
      
    } catch (err) {
      setLoading(false);
      setError('User ID not found');
      setRecommendations([]);
    }
  };

  return (
    <div className="App">
      <h1>Product Recommendation System</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user_id">Enter your User ID:</label><br />
        <input
          type="text"
          id="user_id"
          value={userId}
          onChange={handleInputChange}
        /><br /><br />
        <button type="submit">Get Recommendations</button>
      </form>

      {loading && <div className="loader"></div>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {recommendations.length > 0 && (
        <div>
          <h2>Recommended Products:</h2>
          <ul>
            {recommendations.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Poster from '../components/Poster';

const SearchPage = ({ onMovieClick }) => {
  const location = useLocation();
  const { globalData } = useData();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);

    if (q.trim()) {
      const allMovies = [];
      ['movie', 'livetv', 'adult'].forEach(type => {
        if (globalData[type]) {
          globalData[type].forEach(cat => {
            if (cat?.movies) {
              allMovies.push(...cat.movies);
            }
          });
        }
      });
      
      const filtered = allMovies.filter(movie => 
        movie.name?.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [location.search, globalData]);

  return (
    <div className="page-container">
      <h2 className="page-title">সার্চ রেজাল্ট: "{query}"</h2>
      {results.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search-minus"></i>
          <p>কোনো কিছু খুঁজে পাওয়া যায়নি!</p>
        </div>
      ) : (
        <div className="movie-grid">
          {results.map((movie, index) => (
            <Poster
              key={movie.link || index}
              movie={movie}
              onClick={onMovieClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
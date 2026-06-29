// src/pages/LiveTvPage.jsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Poster from '../components/Poster';

const LiveTvPage = ({ onMovieClick }) => {
  const { globalData, isLoading, loadData } = useData();

  useEffect(() => {
    if (!globalData.livetv || globalData.livetv.length === 0) {
      loadData();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-text">লাইভ টিভি লোড হচ্ছে...</div>
      </div>
    );
  }

  const allMovies = globalData.livetv?.flatMap(cat => cat.movies || []) || [];

  return (
    <div className="page-container">
      <h2 className="page-title">Live TV</h2>
      <div className="movie-grid">
        {allMovies.map((movie, index) => (
          <Poster
            key={movie.link || index}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveTvPage;
// src/pages/MoviePage.jsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Poster from '../components/Poster';

const MoviePage = ({ onMovieClick }) => {
  const { globalData, isLoading, loadData } = useData();

  useEffect(() => {
    if (!globalData.movie || globalData.movie.length === 0) {
      loadData();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-text">মুভি লোড হচ্ছে...</div>
      </div>
    );
  }

  const allMovies = globalData.movie?.flatMap(cat => cat.movies || []) || [];

  return (
    <div className="page-container">
      <h2 className="page-title">Movies</h2>
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

export default MoviePage;
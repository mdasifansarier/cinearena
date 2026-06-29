// src/pages/AdultPage.jsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Poster from '../components/Poster';

const AdultPage = ({ onMovieClick }) => {
  const { globalData, isLoading, loadData } = useData();

  useEffect(() => {
    if (!globalData.adult || globalData.adult.length === 0) {
      loadData();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-text">অ্যাডাল্ট লোড হচ্ছে...</div>
      </div>
    );
  }

  const allMovies = globalData.adult?.flatMap(cat => cat.movies || []) || [];

  return (
    <div className="page-container">
      <h2 className="page-title">18+ Adult</h2>
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

export default AdultPage;
// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Poster from '../components/Poster';

const HomePage = ({ onMovieClick }) => {
  const { globalData, isLoading, loadData } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  // Slider items with URLs
  const sliderItems = [
    {
      image: 'https://diamu.com.bd/wp-content/uploads/2026/04/FIFA-World-Cup-2026-Hero-Banner-Diamu.png',
      title: 'Watch FIFA World Cup Here',
      badge: 'Live TV',
      url: 'https://cinexcricket.com/fifa-world-cup-2026-live-streaming/' // Redirect to movies page
    },
    {
      image: 'https://cinexcricket.com/wp-content/uploads/2026/06/ChatGPTImageJun7202611_51_40A.jpeg',
      title: 'Enjoy Every Cricket Matches',
      badge: 'Live TV',
      url: 'https://cinearena3.pages.dev/matches/' // Redirect to live TV page
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (sliderItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [sliderItems.length]);

  // Handle slide click
  const handleSlideClick = (url) => {
    if (url) {
      navigate(url);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  const renderMovieRow = (title, data) => {
    if (!data || data.length === 0) return null;
    const allMovies = data.flatMap(cat => cat.movies || []);
    if (allMovies.length === 0) return null;

    return (
      <div className="movie-row">
        <div className="movie-row-header">
          <h2 className="movie-row-title">{title}</h2>
        </div>
        <div className="scroll-row">
          {allMovies.slice(0, 15).map((movie, index) => (
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

  return (
    <div className="home-page">
      {/* Slider */}
      <div className="slider-container">
        {sliderItems.map((item, index) => (
          <div 
            key={index} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleSlideClick(item.url)}
          >
            <img src={item.image} alt={item.title} className="slide-image" />
            <div className="slide-overlay">
              <div className="slide-content">
                <span className="badge red">{item.badge}</span>
                <h2>{item.title}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="home-content">
        {renderMovieRow('Movies', globalData.movie)}
        {renderMovieRow('Live TV', globalData.livetv)}
        {renderMovieRow('18+ Adult', globalData.adult)}
      </div>
    </div>
  );
};

export default HomePage;
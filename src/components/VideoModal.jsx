// src/components/VideoModal.jsx
import React, { useEffect, useState, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { useData } from '../contexts/DataContext';
import { showToast } from './Toast';

const VideoModal = ({ isOpen, movie, onClose }) => {
  const { globalData } = useData();
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);

  // Update current movie when prop changes
  useEffect(() => {
    if (movie) {
      setCurrentMovie(movie);
    }
  }, [movie]);

  // Load suggested movies
  useEffect(() => {
    if (currentMovie && globalData) {
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
      
      const filtered = allMovies.filter(m => m.link !== currentMovie.link);
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      setSuggestedMovies(shuffled.slice(0, 12));
    }
  }, [currentMovie, globalData]);

  // Handle suggested video click
  const handleSuggestedClick = useCallback((suggestedMovie) => {
    setCurrentMovie(suggestedMovie);
    // Close and reopen modal with new movie
    // The parent component will handle this
    window.dispatchEvent(new CustomEvent('playMovie', { detail: { movie: suggestedMovie } }));
  }, []);

  const handleShare = async () => {
    if (!currentMovie) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentMovie.name,
          text: `Watch "${currentMovie.name}" on CineArena!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Share link copied!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!isOpen || !currentMovie) return null;

  return (
    <div className={`video-modal ${isOpen ? 'open' : ''}`}>
      <div className="video-modal-header">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="video-title">{currentMovie.name}</h3>
        <button className="share-btn" onClick={handleShare}>
          <i className="fas fa-share-alt"></i>
        </button>
      </div>

      <div className="video-modal-body">
        <div className="video-container">
          {/* Key ensures VideoPlayer re-mounts when movie changes */}
          <VideoPlayer key={currentMovie.link} movie={currentMovie} />
        </div>
        <div className="suggested-section">
          <div className="suggested-header">
            <img src={currentMovie.logo || 'https://picsum.photos/100/100'} alt="thumbnail" />
            <span>🔥 Watch Next</span>
          </div>
          <div className="suggested-grid">
            {suggestedMovies.map((item, index) => (
              <div 
                key={item.link || index}
                className="suggested-item"
                onClick={() => handleSuggestedClick(item)}
              >
                <img src={item.logo || 'https://picsum.photos/400/220'} alt={item.name} />
                <div className="suggested-name">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
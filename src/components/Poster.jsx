// src/components/Poster.jsx
import React, { useState, useRef, useEffect } from 'react';

const Poster = ({ movie, isFavorite, onFavoriteToggle, onClick, onLongPress }) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  const handlePointerDown = () => {
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      onLongPress?.(movie);
    }, 700);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = (e) => {
    if (isLongPress) {
      setIsLongPress(false);
      return;
    }
    onClick?.(movie);
  };

  return (
    <div 
      className="poster"
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onClick={handleClick}
    >
      <div className="poster-image-wrapper">
        {movie.premium && (
          <span className="premium-badge">
            <i className="fas fa-crown"></i> VIP
          </span>
        )}
        {isFavorite && (
          <span className="fav-heart-badge">
            <i className="fas fa-heart"></i>
          </span>
        )}
        <img 
          src={movie.logo || 'https://picsum.photos/400/220'} 
          alt={movie.name || 'Movie poster'} 
          className="poster-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://picsum.photos/400/220';
          }}
        />
      </div>
      <p className="poster-name">{movie.name || 'Untitled'}</p>
    </div>
  );
};

export default Poster;
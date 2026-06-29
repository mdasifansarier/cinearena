// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { openGhostProblem } from './GhostProblemModal';

const Sidebar = ({ isOpen, onClose, onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdultVisible, setIsAdultVisible] = useState(
    localStorage.getItem('cinearena_adult_visible') === 'true'
  );
  const { playerSettings, setPlayerSetting } = usePlayer();

  const toggleAdultVisibility = (checked) => {
    setIsAdultVisible(checked);
    localStorage.setItem('cinearena_adult_visible', String(checked));
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPageChange('search', searchQuery);
      onClose();
    }
  };

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </form>
          </div>

          <nav className="sidebar-nav">
            <button onClick={() => { onPageChange('home'); onClose(); }}>
              <i className="fas fa-home"></i> Home
            </button>
            <button onClick={() => { onPageChange('movie'); onClose(); }}>
              <i className="fas fa-film"></i> Movies
            </button>
            <button onClick={() => { onPageChange('livetv'); onClose(); }}>
              <i className="fas fa-tv"></i> Live TV
            </button>
            
            <div className="adult-toggle">
              <div className="adult-label" onClick={() => {
                if (isAdultVisible) {
                  onPageChange('adult');
                  onClose();
                }
              }}>
                <i className="fas fa-exclamation-triangle text-amber-500"></i>
                <span>18+ Adult</span>
              </div>
              <input
                type="checkbox"
                checked={isAdultVisible}
                onChange={(e) => toggleAdultVisibility(e.target.checked)}
              />
            </div>
            
            <button onClick={() => { onPageChange('favorite'); onClose(); }}>
              <i className="fas fa-heart"></i> Favorites
            </button>
          </nav>

          <div className="sidebar-player-settings">
            <h4>Player Settings</h4>
            <div className="player-select">
              <label>Movie Player</label>
              <select 
                value={playerSettings.movie || 'videojs'}
                onChange={(e) => setPlayerSetting('movie', e.target.value)}
              >
                <option value="videojs">Ghost Basic</option>
                <option value="plyr">Ghost Prime</option>
                <option value="dplayer">Ghost Ultra</option>
                <option value="clappr">Ghost Premium</option>
              </select>
            </div>
            <div className="player-select">
              <label>Live TV Player</label>
              <select 
                value={playerSettings.livetv || 'videojs'}
                onChange={(e) => setPlayerSetting('livetv', e.target.value)}
              >
                <option value="videojs">Ghost Basic</option>
                <option value="plyr">Ghost Prime</option>
                <option value="dplayer">Ghost Ultra</option>
                <option value="clappr">Ghost Premium</option>
              </select>
            </div>
            <div className="player-select">
              <label>Adult Player</label>
              <select 
                value={playerSettings.adult || 'videojs'}
                onChange={(e) => setPlayerSetting('adult', e.target.value)}
              >
                <option value="videojs">Ghost Basic</option>
                <option value="plyr">Ghost Prime</option>
                <option value="dplayer">Ghost Ultra</option>
                <option value="clappr">Ghost Premium</option>
              </select>
            </div>
          </div>

          <button 
            className="ghost-problem-btn" 
            onClick={() => { openGhostProblem(); onClose(); }}
          >
            <i className="fas fa-ghost"></i> Ghost Problem Fix
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
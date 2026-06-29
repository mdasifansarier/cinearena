// src/contexts/PlayerContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playerSettings, setPlayerSettings] = useState({
    movie: 'videojs',
    livetv: 'videojs',
    adult: 'videojs'
  });

  useEffect(() => {
    ['movie', 'livetv', 'adult'].forEach(page => {
      const saved = localStorage.getItem(`cinearena_player_${page}`);
      if (saved) {
        setPlayerSettings(prev => ({ ...prev, [page]: saved }));
      }
    });
  }, []);

  const setPlayerSetting = useCallback((page, value) => {
    setPlayerSettings(prev => ({ ...prev, [page]: value }));
    localStorage.setItem(`cinearena_player_${page}`, value);
  }, []);

  const getPlayerForPage = useCallback((page) => {
    return playerSettings[page] || 'videojs';
  }, [playerSettings]);

  return (
    <PlayerContext.Provider value={{
      playerSettings,
      setPlayerSetting,
      getPlayerForPage
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
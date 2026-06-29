// src/contexts/DataContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext();

const KEYS = {
  movie: { 
    url: "https://raw.githubusercontent.com/ghosttv620/Ghost-Movie/main/Ghost%20Movie.json", 
    title: "Movies" 
  },
  livetv: { 
    url: "https://raw.githubusercontent.com/ghosttv620/Ghost-Tv/main/Ghost%20Tv.json", 
    title: "Live TV" 
  },
  adult: { 
    url: "https://raw.githubusercontent.com/ghosttv620/Ghost-Adult/main/Ghost%20Adult.json", 
    title: "18+ Adult" 
  }
};

export const DataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState({ movie: [], livetv: [], adult: [] });
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = useCallback(() => {
    const saved = localStorage.getItem('cinearena_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('cinearena_favorites', JSON.stringify(newFavorites));
  }, []);

  const toggleFavorite = useCallback((movie) => {
    const exists = favorites.some(f => f.link === movie.link);
    let newFavorites;
    if (exists) {
      newFavorites = favorites.filter(f => f.link !== movie.link);
    } else {
      newFavorites = [...favorites, movie];
    }
    saveFavorites(newFavorites);
    return !exists;
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((movie) => {
    return favorites.some(f => f.link === movie.link);
  }, [favorites]);

  const fetchData = useCallback(async (type) => {
    try {
      const response = await fetch(KEYS[type].url);
      if (!response.ok) return [];
      const json = await response.json();
      return json.categories || [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [movie, livetv, adult] = await Promise.all([
        fetchData('movie'),
        fetchData('livetv'),
        fetchData('adult')
      ]);
      setGlobalData({ movie, livetv, adult });
      loadFavorites();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, loadFavorites]);

  const getAllMovies = useCallback(() => {
    const all = [];
    ['movie', 'livetv', 'adult'].forEach(type => {
      if (globalData[type]) {
        globalData[type].forEach(category => {
          if (category?.movies) {
            all.push(...category.movies);
          }
        });
      }
    });
    return all;
  }, [globalData]);

  const searchMovies = useCallback((query) => {
    const all = getAllMovies();
    const lowerQuery = query.toLowerCase();
    return all.filter(movie => 
      movie.name?.toLowerCase().includes(lowerQuery)
    );
  }, [getAllMovies]);

  return (
    <DataContext.Provider value={{
      globalData,
      isLoading,
      favorites,
      toggleFavorite,
      isFavorite,
      loadData,
      getAllMovies,
      searchMovies,
      KEYS
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
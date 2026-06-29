// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import LiveTvPage from './pages/LiveTvPage';
import AdultPage from './pages/AdultPage';
import FavoritePage from './pages/FavoritePage';
import SearchPage from './pages/SearchPage';
import VideoModal from './components/VideoModal';
import LoginModal from './components/LoginModal';
import PremiumAlert from './components/PremiumAlert';
import GhostProblemModal from './components/GhostProblemModal';
import Toast from './components/Toast';
import './styles/globals.css';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const navigate = useNavigate();

  // Listen for playMovie events from VideoModal
  useEffect(() => {
    const handlePlayMovie = (event) => {
      const { movie } = event.detail;
      if (movie) {
        setCurrentMovie(movie);
        setIsVideoModalOpen(true);
      }
    };

    window.addEventListener('playMovie', handlePlayMovie);
    return () => window.removeEventListener('playMovie', handlePlayMovie);
  }, []);

  const handlePageChange = (page, searchQuery = '') => {
    setIsSidebarOpen(false);
    if (page === 'home') navigate('/');
    else if (page === 'search') navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    else if (page === 'ghost-problem') {
      document.querySelector('.ghost-problem-overlay')?.classList.add('show');
    } else {
      navigate(`/${page}`);
    }
  };

  const handleMovieClick = (movie) => {
    if (movie) {
      setCurrentMovie(movie);
      setIsVideoModalOpen(true);
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setTimeout(() => {
      setCurrentMovie(null);
    }, 300);
  };

  return (
    <div className="app-container">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onPageChange={handlePageChange}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onPageChange={handlePageChange}
      />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage onMovieClick={handleMovieClick} />} />
          <Route path="/movie" element={<MoviePage onMovieClick={handleMovieClick} />} />
          <Route path="/livetv" element={<LiveTvPage onMovieClick={handleMovieClick} />} />
          <Route path="/adult" element={<AdultPage onMovieClick={handleMovieClick} />} />
          <Route path="/favorite" element={<FavoritePage onMovieClick={handleMovieClick} />} />
          <Route path="/search" element={<SearchPage onMovieClick={handleMovieClick} />} />
        </Routes>
      </main>

      <BottomNav onPageChange={handlePageChange} />

      <VideoModal 
        isOpen={isVideoModalOpen}
        movie={currentMovie}
        onClose={closeVideoModal}
      />

      <LoginModal />
      <PremiumAlert />
      <GhostProblemModal />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <PlayerProvider>
            <AppContent />
          </PlayerProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
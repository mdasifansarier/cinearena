// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuToggle, onPageChange }) => {
  const { currentUser, logout, openLogin } = useAuth();

  const handleLoginClick = () => {
    openLogin();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <i className="fas fa-bars"></i>
        </button>
        <div className="logo">CineArena</div>
      </div>
      <div className="header-right">
        {currentUser ? (
          <div className="user-info">
            <span className="username">
              <i className="fas fa-user-check"></i> {currentUser.username}
            </span>
            <button className="logout-btn" onClick={logout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLoginClick}>
            <i className="fas fa-user-lock"></i> Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
// src/components/PremiumAlert.jsx
import React, { useState, useEffect } from 'react';

const PremiumAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handlePremiumAlert = (event) => {
      setMessage(event.detail.message || '⚠️ This content is premium! Please login.');
      setIsVisible(true);
    };

    window.addEventListener('showPremiumAlert', handlePremiumAlert);
    return () => window.removeEventListener('showPremiumAlert', handlePremiumAlert);
  }, []);

  const closeAlert = () => {
    setIsVisible(false);
    // Open login modal
    const loginModal = document.querySelector('.login-modal-overlay');
    if (loginModal) {
      loginModal.style.display = 'flex';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="premium-alert-overlay show">
      <div className="premium-alert-box">
        <div className="icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2>CineArena</h2>
        <p>{message}</p>
        <button className="ok-btn" onClick={closeAlert}>
          OK
        </button>
      </div>
    </div>
  );
};

export const showPremiumAlert = (message) => {
  window.dispatchEvent(new CustomEvent('showPremiumAlert', { detail: { message } }));
};

export default PremiumAlert;
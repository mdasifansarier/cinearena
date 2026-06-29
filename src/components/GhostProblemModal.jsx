// src/components/GhostProblemModal.jsx
import React, { useState, useEffect } from 'react';
import { showToast } from './Toast';

const GhostProblemModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [movieName, setMovieName] = useState('');
  const [problemDesc, setProblemDesc] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsVisible(true);
      setIsSuccess(false);
      setMovieName('');
      setProblemDesc('');
      setCharCount(0);
    };

    window.addEventListener('openGhostProblem', handleOpen);
    return () => window.removeEventListener('openGhostProblem', handleOpen);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    setIsSuccess(false);
  };

  const handleSend = async () => {
    if (!movieName.trim()) {
      showToast('⚠️ Please enter the TV or Movie name!');
      return;
    }
    if (!problemDesc.trim() || problemDesc.length < 5) {
      showToast('⚠️ Please describe the problem in detail!');
      return;
    }

    setIsSending(true);
    const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1520076484738416700/u82UBIcHlqgXP4uBcJCEJexHgRna2UTspg_b3VXyhXDTcn8Wxaff4byvDO3zzCEq_iRS";

    try {
      const payload = {
        embeds: [{
          title: '👻 Ghost Problem Fix',
          color: 0xe50914,
          fields: [
            { name: '🎬 TV / Movie Name', value: movieName, inline: false },
            { name: '⚠️ Problem', value: problemDesc, inline: false },
            { name: '📅 Time', value: new Date().toLocaleString('en-US'), inline: false }
          ],
          footer: { text: 'CineArena — Problem Report' },
          timestamp: new Date().toISOString()
        }]
      };

      const response = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSuccess(true);
        showToast('✅ Successfully sent!');
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        showToast('⚠️ Failed to send! Please try again.');
      }
    } catch (error) {
      showToast('⚠️ Network error! Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="ghost-problem-overlay show">
      <div className="ghost-problem-box">
        <div className="header">
          <h2><i className="fas fa-ghost"></i> Ghost Problem Fix</h2>
          <button className="close-btn" onClick={closeModal}>✕</button>
        </div>
        
        <div className="form-group">
          <label><i className="fas fa-film"></i> TV or Movie Name</label>
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Enter movie or TV name"
            disabled={isSending}
          />
        </div>

        <div className="form-group">
          <label><i className="fas fa-exclamation-circle"></i> Problem or Request</label>
          <textarea
            value={problemDesc}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 1000) {
                setProblemDesc(value);
                setCharCount(value.length);
              }
            }}
            placeholder="Describe in detail..."
            disabled={isSending}
          />
          <div className="char-counter">
            {charCount} / 1000
          </div>
        </div>

        <button 
          className="send-btn" 
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <><i className="fas fa-spinner fa-spin"></i> Sending...</>
          ) : (
            <><i className="fas fa-paper-plane"></i> Send</>
          )}
        </button>

        <div className={`success-msg ${isSuccess ? 'show' : ''}`}>
          <i className="fas fa-check-circle"></i> Successfully sent!
        </div>
      </div>
    </div>
  );
};

export const openGhostProblem = () => {
  window.dispatchEvent(new CustomEvent('openGhostProblem'));
};

export default GhostProblemModal;
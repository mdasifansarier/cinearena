// src/components/VideoPlayer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { showToast } from './Toast';

// Import CSS for players
import 'video.js/dist/video-js.css';
import 'plyr/dist/plyr.css';

// For DPlayer - we'll import dynamically with correct path
// For Clappr - no CSS import needed

const VideoPlayer = ({ movie }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const { getPlayerForPage } = usePlayer();
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);

  useEffect(() => {
    const destroyPlayer = () => {
      // Destroy HLS instance if exists
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (e) {}
        hlsRef.current = null;
      }

      if (playerRef.current) {
        try {
          if (typeof playerRef.current.dispose === 'function') {
            playerRef.current.dispose();
          } else if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          } else if (typeof playerRef.current.pause === 'function') {
            playerRef.current.pause();
          }
          if (typeof playerRef.current.off === 'function') {
            playerRef.current.off();
          }
        } catch (e) {
          console.log('Player cleanup error:', e);
        }
        playerRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      setIsInitialized(false);
      initializationRef.current = false;
    };

    if (!movie || !containerRef.current || initializationRef.current) {
      return;
    }

    destroyPlayer();

    const playerType = getPlayerForPage('movie') || 'videojs';
    const isM3u8 = movie.link?.includes('.m3u8');

    const initializePlayer = async () => {
      try {
        if (playerType === 'videojs') {
          const videojs = await import('video.js');
          
          const existingPlayer = document.getElementById('videojs-player');
          if (existingPlayer) {
            existingPlayer.remove();
          }

          const videoEl = document.createElement('video');
          videoEl.id = 'videojs-player';
          videoEl.className = 'video-js vjs-default-skin vjs-big-play-centered';
          videoEl.setAttribute('controls', 'true');
          videoEl.setAttribute('playsinline', 'true');
          videoEl.setAttribute('preload', 'auto');
          containerRef.current.appendChild(videoEl);

          const existingVideoJs = videojs.default.getPlayers()['videojs-player'];
          if (existingVideoJs) {
            existingVideoJs.dispose();
          }

          const player = videojs.default(videoEl, {
            autoplay: true,
            controls: true,
            liveui: true,
            fluid: true,
            sources: [{
              src: movie.link,
              type: isM3u8 ? 'application/x-mpegURL' : 'video/mp4'
            }]
          });
          
          playerRef.current = player;
          setIsInitialized(true);
          initializationRef.current = true;
          
        } else if (playerType === 'plyr') {
          const Plyr = await import('plyr');
          
          const existingPlyr = document.getElementById('plyr-player');
          if (existingPlyr) {
            existingPlyr.remove();
          }

          const videoEl = document.createElement('video');
          videoEl.id = 'plyr-player';
          videoEl.className = 'w-full h-full';
          videoEl.setAttribute('controls', 'true');
          videoEl.setAttribute('playsinline', 'true');
          videoEl.setAttribute('preload', 'auto');
          containerRef.current.appendChild(videoEl);

          if (isM3u8) {
            const Hls = await import('hls.js');
            if (Hls.default.isSupported()) {
              if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
              }
              const hls = new Hls.default();
              hls.loadSource(movie.link);
              hls.attachMedia(videoEl);
              hlsRef.current = hls;
            }
          } else {
            videoEl.src = movie.link;
          }

          const player = new Plyr.default(videoEl, { 
            autoplay: true, 
            volume: 1,
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
          });
          playerRef.current = player;
          setIsInitialized(true);
          initializationRef.current = true;
          
        } else if (playerType === 'dplayer') {
          // DPlayer - import without CSS since we'll handle it differently
          const DPlayer = await import('dplayer');
          
          const existingDp = document.getElementById('dplayer-container');
          if (existingDp) {
            existingDp.remove();
          }

          const dpDiv = document.createElement('div');
          dpDiv.id = 'dplayer-container';
          dpDiv.className = 'w-full h-full';
          containerRef.current.appendChild(dpDiv);

          const player = new DPlayer.default({
            container: dpDiv,
            video: { 
              url: movie.link, 
              type: isM3u8 ? 'hls' : 'auto' 
            },
            autoplay: true,
            theme: '#e50914',
            logo: 'CineArena',
            lang: 'en',
            preload: 'auto'
          });
          playerRef.current = player;
          setIsInitialized(true);
          initializationRef.current = true;
          
        } else if (playerType === 'clappr') {
          const Clappr = await import('@clappr/player');
          
          const existingClappr = document.getElementById('clappr-container');
          if (existingClappr) {
            existingClappr.remove();
          }

          const clapprDiv = document.createElement('div');
          clapprDiv.id = 'clappr-container';
          clapprDiv.className = 'w-full h-full';
          containerRef.current.appendChild(clapprDiv);

          const player = new Clappr.default.Player({
            source: movie.link,
            parentId: '#clappr-container',
            autoPlay: true,
            width: '100%',
            height: '100%',
            mute: false,
            volume: 100
          });
          playerRef.current = player;
          setIsInitialized(true);
          initializationRef.current = true;
        }
      } catch (error) {
        console.error('Player initialization error:', error);
        showToast('⚠️ Failed to load player!');
      }
    };

    setTimeout(() => {
      initializePlayer();
    }, 100);

    return () => {
      setTimeout(() => {
        destroyPlayer();
      }, 50);
    };
  }, [movie, getPlayerForPage]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (e) {}
        hlsRef.current = null;
      }

      if (playerRef.current) {
        try {
          if (typeof playerRef.current.dispose === 'function') {
            playerRef.current.dispose();
          } else if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (e) {}
        playerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      setIsInitialized(false);
      initializationRef.current = false;
    };
  }, []);

  return <div ref={containerRef} className="video-player-container" />;
};

export default VideoPlayer;
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

const USER_BIN = "6a351a15da38895dfedcd033";
const MASTER_KEY = "$2a$10$HxsYIZoT7QPdPK.EtQZnG.e7AqIWHwpgQ/wsSSavXR3kTM6r.bsWG";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('cinearena_device_id');
    if (id) {
      setDeviceId(id);
    } else {
      const newId = 'dv_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('cinearena_device_id', newId);
      setDeviceId(newId);
    }

    // Auto login
    const savedUser = localStorage.getItem('cinearena_user');
    const savedPass = localStorage.getItem('cinearena_pass');
    if (savedUser && savedPass) {
      verifyUser(savedUser, savedPass, true);
    }
  }, []);

  const verifyUser = useCallback(async (username, password, isAuto = false) => {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${USER_BIN}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY, "X-Bin-Meta": "false" }
      });
      if (!res.ok) return false;

      const data = await res.json();
      const users = Array.isArray(data) ? data : (data.users || []);
      const user = users.find(u => u.username === username && u.password === password);

      if (!user) return false;

      const today = new Date();
      const expiryDate = new Date(user.expiry);
      if (expiryDate < today) {
        localStorage.clear();
        return false;
      }

      if (user.device_id && user.device_id !== "" && user.device_id !== deviceId) {
        return false;
      }

      if (!user.device_id || user.device_id === "") {
        user.device_id = deviceId;
        const updatedData = Array.isArray(data) ? data : { ...data, users };
        await fetch(`https://api.jsonbin.io/v3/b/${USER_BIN}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
          body: JSON.stringify(updatedData)
        });
      }

      setCurrentUser(user);
      localStorage.setItem('cinearena_user', username);
      localStorage.setItem('cinearena_pass', password);
      return true;
    } catch (error) {
      console.error('Verify error:', error);
      return false;
    }
  }, [deviceId]);

  const login = useCallback(async (username, password) => {
    const success = await verifyUser(username, password, false);
    if (success) {
      setIsLoginOpen(false);
    }
    return success;
  }, [verifyUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('cinearena_user');
    localStorage.removeItem('cinearena_pass');
    setCurrentUser(null);
  }, []);

  const resetDevice = useCallback(async (username, password) => {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${USER_BIN}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY, "X-Bin-Meta": "false" }
      });
      if (!res.ok) return false;

      const data = await res.json();
      const users = Array.isArray(data) ? data : (data.users || []);
      const userIndex = users.findIndex(u => u.username === username && u.password === password);
      
      if (userIndex === -1) return false;

      users[userIndex].device_id = "";
      const updatedData = Array.isArray(data) ? users : { ...data, users };

      await fetch(`https://api.jsonbin.io/v3/b/${USER_BIN}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
        body: JSON.stringify(updatedData)
      });

      localStorage.removeItem('cinearena_user');
      localStorage.removeItem('cinearena_pass');
      setCurrentUser(null);
      return true;
    } catch (error) {
      console.error('Reset error:', error);
      return false;
    }
  }, []);

  const openLogin = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoginOpen,
      login,
      logout,
      openLogin,
      closeLogin,
      resetDevice,
      deviceId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
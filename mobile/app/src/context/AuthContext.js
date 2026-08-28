// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

// Safe storage helpers — SecureStore can fail on some Android/Expo Go versions
const safeGet = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    try { return await AsyncStorage.getItem(key); } catch { return null; }
  }
};

const safeSet = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    try { await AsyncStorage.setItem(key, value); } catch {}
  }
};

const safeDelete = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    try { await AsyncStorage.removeItem(key); } catch {}
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(undefined); // undefined = loading
  const [user, setUser] = useState({ name: 'Praveen', email: 'praveen@interviewx.ai' });

  // Shared stats across the app
  const [userStats, setUserStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    streak: 0,
    solvedCount: 0,
    recentInterviews: [],
    careerProgress: {},
    atsScore: null,
    atsFileName: null,
  });

  useEffect(() => {
    safeGet('jwt').then((t) => setToken(t || null));
    // Load persisted stats
    safeGet('userStats').then((raw) => {
      if (raw) {
        try { setUserStats(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

  const signIn = async (newToken) => {
    await safeSet('jwt', newToken);
    setToken(newToken);
  };

  const signOut = async () => {
    await safeDelete('jwt');
    setToken(null);
  };

  const updateStats = async (updates) => {
    setUserStats((prev) => {
      const next = { ...prev, ...updates };
      safeSet('userStats', JSON.stringify(next));
      return next;
    });
  };

  const addInterview = (interview) => {
    setUserStats((prev) => {
      const interviews = [interview, ...prev.recentInterviews].slice(0, 10);
      const total = interviews.length;
      const avg = Math.round(interviews.reduce((s, i) => s + i.score, 0) / total);
      const streak = prev.streak + 1;
      const next = { ...prev, recentInterviews: interviews, totalInterviews: total, avgScore: avg, streak };
      safeSet('userStats', JSON.stringify(next));
      return next;
    });
  };

  const incrementSolved = () => {
    setUserStats((prev) => {
      const next = { ...prev, solvedCount: prev.solvedCount + 1 };
      safeSet('userStats', JSON.stringify(next));
      return next;
    });
  };

  const updateCareerProgress = (role, stepId, progress) => {
    setUserStats((prev) => {
      const roleData = prev.careerProgress[role] || {};
      const next = {
        ...prev,
        careerProgress: { ...prev.careerProgress, [role]: { ...roleData, [stepId]: progress } },
      };
      safeSet('userStats', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ token, user, userStats, signIn, signOut, updateStats, addInterview, incrementSolved, updateCareerProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

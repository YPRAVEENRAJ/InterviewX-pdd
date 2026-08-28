// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Charcoal',
    emoji: '🌑',
    bg: '#121214',
    card: '#1a1a1f',
    card2: '#16161a',
    border: '#26262e',
    text: '#ffffff',
    subtext: '#9ca3af',
    muted: '#6b7280',
    primary: '#3b82f6',
    primarySubtle: '#0a2540',
    primaryBorder: '#1e3a8a',
  },
  indigo: {
    id: 'indigo',
    name: 'Cyber Indigo',
    emoji: '🌌',
    bg: '#0d0d1a',
    card: '#151528',
    card2: '#111124',
    border: '#1e2040',
    text: '#ffffff',
    subtext: '#a5b4fc',
    muted: '#64748b',
    primary: '#6366f1',
    primarySubtle: '#1e1b4b',
    primaryBorder: '#3730a3',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    emoji: '🌲',
    bg: '#0a140f',
    card: '#11221a',
    card2: '#0d1a14',
    border: '#1a382b',
    text: '#ffffff',
    subtext: '#86efac',
    muted: '#4ade8099',
    primary: '#22c55e',
    primarySubtle: '#052e16',
    primaryBorder: '#166534',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Pure Obsidian',
    emoji: '⬛',
    bg: '#000000',
    card: '#111111',
    card2: '#0a0a0a',
    border: '#222222',
    text: '#ffffff',
    subtext: '#cccccc',
    muted: '#666666',
    primary: '#38bdf8',
    primarySubtle: '#082f49',
    primaryBorder: '#0369a1',
  },
};

export const ACCENT_PALETTES = {
  blue: { id: 'blue', name: 'Electric Blue', color: '#3b82f6', bg: '#10284e' },
  green: { id: 'green', name: 'Emerald Green', color: '#22c55e', bg: '#143820' },
  amber: { id: 'amber', name: 'Amber Gold', color: '#f59e0b', bg: '#382810' },
  purple: { id: 'purple', name: 'Vibrant Violet', color: '#8b5cf6', bg: '#2e1065' },
  rose: { id: 'rose', name: 'Crimson Rose', color: '#f43f5e', bg: '#4c0519' },
  cyan: { id: 'cyan', name: 'Cyber Cyan', color: '#06b6d4', bg: '#083344' },
};

const defaultSectionAccents = {
  interview: 'blue',
  resume: 'green',
  coding: 'cyan',
  career: 'purple',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState('midnight');
  const [sectionAccents, setSectionAccents] = useState(defaultSectionAccents);

  useEffect(() => {
    AsyncStorage.getItem('app_theme_id').then(saved => {
      if (saved && THEMES[saved]) setThemeIdState(saved);
    });
    AsyncStorage.getItem('app_section_accents').then(saved => {
      if (saved) {
        try { setSectionAccents(JSON.parse(saved)); } catch {}
      }
    });
  }, []);

  const setThemeId = async (id) => {
    if (THEMES[id]) {
      setThemeIdState(id);
      await AsyncStorage.setItem('app_theme_id', id);
    }
  };

  const setSectionAccent = async (section, accentId) => {
    const next = { ...sectionAccents, [section]: accentId };
    setSectionAccents(next);
    await AsyncStorage.setItem('app_section_accents', JSON.stringify(next));
  };

  const currentTheme = THEMES[themeId] || THEMES.midnight;

  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      themeId,
      setThemeId,
      sectionAccents,
      setSectionAccent,
      THEMES,
      ACCENT_PALETTES,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

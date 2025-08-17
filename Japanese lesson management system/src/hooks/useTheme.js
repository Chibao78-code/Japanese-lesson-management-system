import { useState, useEffect } from 'react';

/**
 * Custom hook for theme management (Dark/Light mode)
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('japanese-lesson-theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('japanese-lesson-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};

export default useTheme;

// src/core/components/ui/ThemeToggle.tsx
import { useState, useEffect } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const rootElement = window.document.documentElement;
    if (isDarkMode) {
      rootElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      rootElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle theme"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? <LuSun size={20} /> : <LuMoon size={20} />}
    </button>
  );
}
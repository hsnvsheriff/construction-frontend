import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setThemeState] = useState(() =>
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => setThemeState(newTheme);

  return { theme, setTheme };
};

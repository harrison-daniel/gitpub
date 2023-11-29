'use client';

import { useState, useEffect } from 'react';
import { SunMoon } from 'lucide-react';

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

export default function ModeToggle() {
  // const [theme, setTheme] = useState(() => {
  //   return localStorage.getItem('theme') || DARK_THEME;
  // });

  // useEffect(() => {
  //   document.documentElement.classList.toggle(DARK_THEME, theme === DARK_THEME);
  // }, [theme]);

  // const switchTheme = () => {
  //   const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  //   localStorage.setItem('theme', newTheme);
  //   setTheme(newTheme);
  // };

  const [theme, setTheme] = useState(DARK_THEME);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_THEME, theme === DARK_THEME);
  }, [theme]);

  const switchTheme = () => {
    const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className='mode-toggle'>
      <button
        onClick={switchTheme}
        className='mode-toggle absolute right-1 top-0 rounded-full bg-gray-800 px-1 py-1 text-sm capitalize text-gray-200 dark:text-gray-800'>
        <SunMoon />
        {/* {theme === DARK_THEME ? 'Switch to Light Mode' : 'Switch to Dark Mode'} */}
      </button>
    </div>
  );
}

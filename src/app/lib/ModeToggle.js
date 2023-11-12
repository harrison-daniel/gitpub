'use client';
import { useState } from 'react';
import { SunMoon } from 'lucide-react';

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

export default function ModeToggle() {
  const [theme, setTheme] = useState(LIGHT_THEME);
  const switchTheme = () => {
    if (!document.documentElement.classList.contains(DARK_THEME)) {
      document.documentElement.classList.add(DARK_THEME);
      setTheme(DARK_THEME);
    } else {
      document.documentElement.classList.remove(DARK_THEME);
      setTheme(LIGHT_THEME);
    }
  };
  return (
    <div className='mode-toggle'>
      <button
        onClick={switchTheme}
        className='mode-toggle absolute right-1 top-0 rounded-full bg-gray-800 px-1 py-1 text-sm capitalize text-gray-200  dark:text-gray-800'>
        {/* {theme} Mode */}
        <SunMoon />
      </button>
    </div>
  );
}

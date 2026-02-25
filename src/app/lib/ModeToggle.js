'use client';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const toggleClass =
  'absolute right-1 top-0 cursor-pointer px-1 py-1 text-4xl transition-transform active:scale-[0.85]';

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={toggleClass} aria-hidden>
        <FiMoon className='opacity-0' />
      </div>
    );
  }

  if (resolvedTheme === 'dark') {
    return (
      <button
        onClick={() => setTheme('light')}
        aria-label='Switch to light mode'
        className={toggleClass}>
        <FiSun />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme('dark')}
      aria-label='Switch to dark mode'
      className={toggleClass}>
      <FiMoon />
    </button>
  );
}

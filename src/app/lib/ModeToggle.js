'use client';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className='absolute right-1 top-0 px-1 py-1 text-4xl' />
    );

  if (resolvedTheme === 'dark') {
    return (
      <button
        onClick={() => setTheme('light')}
        aria-label='Switch to light mode'
        className='absolute right-1 top-0 cursor-pointer px-1 py-1 text-4xl'>
        <FiSun />
      </button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <button
        onClick={() => setTheme('dark')}
        aria-label='Switch to dark mode'
        className='absolute right-1 top-0 cursor-pointer px-1 py-1 text-4xl'>
        <FiMoon />
      </button>
    );
  }
}

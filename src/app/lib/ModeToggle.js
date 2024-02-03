'use client';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
// import { SunMoon } from 'lucide-react';
import Image from 'next/image';

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className='absolute right-1 top-0 cursor-pointer px-1 py-1 text-4xl' />
    );

  if (resolvedTheme === 'dark') {
    return (
      <FiSun
        onClick={() => setTheme('light')}
        className='absolute right-1 top-0 cursor-pointer px-1 py-1 text-4xl'
      />
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <FiMoon
        onClick={() => setTheme('dark')}
        className='absolute right-1 top-0 cursor-pointer px-1 py-1 text-4xl'
      />
    );
  }
}

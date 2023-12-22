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

// 'use client';

// import { useState, useEffect } from 'react';
// import { SunMoon } from 'lucide-react';

// const LIGHT_THEME = 'light';
// const DARK_THEME = 'dark';

// export default function ModeToggle() {
//   const [theme, setTheme] = useState(DARK_THEME);

//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme');
//     if (storedTheme) {
//       setTheme(storedTheme);
//     }
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle(DARK_THEME, theme === DARK_THEME);
//   }, [theme]);

//   const switchTheme = () => {
//     const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
//     localStorage.setItem('theme', newTheme);
//     setTheme(newTheme);
//   };

//   return (
//     <div className='mode-toggle'>
//       <button
//         onClick={switchTheme}
//         className='mode-toggle absolute right-1 top-0 rounded-full bg-gray-800 px-1 py-1 text-sm capitalize text-gray-200 dark:text-gray-800'>
//         <SunMoon />
//         {/* {theme === DARK_THEME ? 'Switch to Light Mode' : 'Switch to Dark Mode'} */}
//       </button>
//     </div>
//   );
// }

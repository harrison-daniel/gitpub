'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu on route change (covers auth redirects, Link navigation, etc.)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSearchClick = () => {
    setIsOpen(false);
    if (pathname !== '/') {
      router.push('/');
      setTimeout(
        () => window.dispatchEvent(new CustomEvent('open-state-search')),
        500,
      );
    } else {
      window.dispatchEvent(new CustomEvent('open-state-search'));
    }
  };

  const menuItemVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: 5, opacity: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.75 },
  };

  const topBarVariants = {
    closed: { d: 'M 3 4 L 21 4' },
    open: { d: 'M 3 4 L 21 20' },
  };
  const middleBarVariants = {
    closed: { scaleY: 1, opacity: 1, transition: { duration: 0.1 } },
    open: { scaleY: 0, opacity: 0, transition: { duration: 0.1 } },
  };
  const bottomBarVariants = {
    closed: { d: 'M 3 20 L 21 20' },
    open: { d: 'M 21 4 L 3 20' },
  };

  const navLinkClass =
    'rounded bg-amber-700 px-4 py-1 font-extrabold text-amber-100 hover:bg-amber-600 dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-200';

  return (
    <>
      {/* Desktop Navigation */}
      <div className='flex'>
        <div className='hidden md:mx-auto md:flex md:max-w-3xl md:flex-row md:items-center md:justify-center'>
          <div className='flex items-center gap-8 px-12 pt-2 align-middle'>
            <Link href='/' className={navLinkClass}>
              Home
            </Link>

            {status === 'authenticated' ? (
              <>
                <Link href='/addEntry' className={navLinkClass}>
                  Add Entry
                </Link>
                <Link href='/userDash' className={navLinkClass}>
                  Dashboard
                </Link>
                <button onClick={() => signOut()} className={navLinkClass}>
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => signIn()} className={navLinkClass}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={overlayVariants}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            className='fixed inset-0 z-40 bg-black/80'
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile nav */}
      <div className='fixed bottom-24 right-1 z-40 max-w-[100vw] md:hidden'>
        <motion.div
          className='menu-container'
          initial={false}
          animate={isOpen ? 'open' : 'closed'}>
          <motion.ul
            className={`absolute bottom-16 right-1 mb-2 w-32 text-center ${
              isOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}>
            <motion.li variants={menuItemVariants}>
              {status === 'authenticated' ? (
                <div>
                  <div className='flex flex-row justify-center pb-4 font-bold text-amber-100 dark:text-white'>
                    {session?.user?.name}
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className='mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'>
                    Sign Out
                  </button>
                  <Link
                    href='/userDash'
                    onClick={() => setIsOpen(false)}
                    className='mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'>
                    Dashboard
                  </Link>
                  <Link
                    href='/addEntry'
                    onClick={() => setIsOpen(false)}
                    className='mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'>
                    Add Entry
                  </Link>
                  <button
                    onClick={handleSearchClick}
                    className='mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'>
                    Search
                  </button>
                </div>
              ) : (
                <div>
                  <div className='mb-2 font-bold text-slate-300 dark:bg-none'>
                    You are not logged in
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signIn();
                    }}
                    className='mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'>
                    Sign In
                  </button>
                  <button
                    onClick={handleSearchClick}
                    className='mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'>
                    Search
                  </button>
                </div>
              )}
            </motion.li>

            <motion.li variants={menuItemVariants}>
              <Link
                href='/'
                passHref
                className='mobile-navItem block rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100'
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </motion.li>
          </motion.ul>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className='mobile-nav flex items-center justify-center rounded-full bg-amber-700 p-3.5 text-amber-200'>
            <svg width='23.5' height='23.5' viewBox='0 0 23.5 23.5' fill='none'>
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 4 L 21 4' }}
                variants={topBarVariants}
              />
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 12 L 21 12' }}
                variants={middleBarVariants}
              />
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 20 L 21 20' }}
                variants={bottomBarVariants}
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}

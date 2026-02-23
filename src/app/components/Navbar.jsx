'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

const springSnap = { type: 'spring', stiffness: 400, damping: 28 };

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

const navVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.04, staggerDirection: -1 },
  },
  closed: {
    transition: { staggerChildren: 0.02, staggerDirection: 1 },
  },
};

// Single unified transition per state — one JS animation track per element
const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.15, ease: [0.42, 0, 1, 1] },
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleSearchClick = () => {
    close();
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

  const navLinkClass =
    'nav-link rounded bg-amber-700 px-4 py-1 font-extrabold text-amber-100 hover:bg-amber-600 dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-200';

  const mobileItemClass =
    'mobile-navItem mb-3 block w-32 rounded bg-amber-700 py-3 text-amber-100 hover:bg-amber-600 active:bg-amber-600 dark:hover:bg-yellow-100 dark:active:bg-yellow-100';

  const menuItems = [];
  if (status === 'authenticated') {
    menuItems.push(
      <span
        key='user'
        className='block pb-1 font-bold text-amber-100 dark:text-white'>
        {session?.user?.name}
      </span>,
    );
    menuItems.push(
      <button
        key='signout'
        onClick={() => {
          close();
          signOut();
        }}
        className={mobileItemClass}>
        Sign Out
      </button>,
    );
    menuItems.push(
      <Link
        key='dash'
        href='/userDash'
        onClick={close}
        className={mobileItemClass}>
        Dashboard
      </Link>,
    );
    menuItems.push(
      <Link
        key='add'
        href='/addEntry'
        onClick={close}
        className={mobileItemClass}>
        Add Entry
      </Link>,
    );
  } else {
    menuItems.push(
      <span key='guest' className='mb-2 block font-bold text-slate-300'>
        You are not logged in
      </span>,
    );
    menuItems.push(
      <button
        key='signin'
        onClick={() => {
          close();
          signIn();
        }}
        className={mobileItemClass}>
        Sign In
      </button>,
    );
  }
  menuItems.push(
    <button
      key='search'
      onClick={handleSearchClick}
      className={mobileItemClass}>
      Search
    </button>,
  );
  menuItems.push(
    <Link key='home' href='/' onClick={close} className={mobileItemClass}>
      Home
    </Link>,
  );

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
            key='nav-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='fixed inset-0 z-40 bg-black/60'
            style={{ WebkitTapHighlightColor: 'transparent' }}
            onClick={close}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Mobile nav */}
      <div className='fixed bottom-24 right-1 z-40 max-w-[100vw] md:hidden'>
        <motion.div
          className='menu-container'
          initial={false}
          animate={isOpen ? 'open' : 'closed'}>
          {/* Always-mounted menu — variants handle open/closed */}
          <motion.ul
            className='absolute bottom-16 right-1 mb-2 w-32 list-none text-center'
            variants={navVariants}
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            aria-hidden={!isOpen}>
            {menuItems.map((item) => (
              <motion.li
                key={item.key}
                variants={itemVariants}
                style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}>
                {item}
              </motion.li>
            ))}
          </motion.ul>

          {/* Hamburger */}
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            transition={springSnap}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className='mobile-nav flex items-center justify-center rounded-full bg-amber-700 p-3.5 text-amber-200'
            style={{ WebkitTapHighlightColor: 'transparent' }}>
            <svg
              width='23.5'
              height='23.5'
              viewBox='0 0 23.5 23.5'
              fill='none'>
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 4 L 21 4' }}
                variants={topBarVariants}
                transition={springSnap}
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
                transition={springSnap}
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}

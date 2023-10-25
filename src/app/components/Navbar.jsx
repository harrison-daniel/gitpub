'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Menu,
  PlusSquare,
  PlusCircle,
  MenuSquare,
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return; // Only add the listener if the menu is open

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.menu-container')) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => window.removeEventListener('click', handleOutsideClick); // Clean up the event listener on unmount
  }, [isOpen]);

  // Simplified variants for animations
  const menuItemVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: 5, opacity: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.75 },
  };

  // const buttonVariants = {
  //   open: { rotate: 90 },
  //   closed: { rotate: 0 },
  // };

  const topBarVariants = {
    closed: { d: 'M 2 2.5 L 20 2.5' },
    open: { d: 'M 3 16.5 L 17 2.5' },
  };
  const middleBarVariants = {
    // d: 'M 2 9.423 L 20 9.423',
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };
  const bottomBarVariants = {
    closed: { d: 'M 2 16.346 L 20 16.346' },
    open: { d: 'M 3 2.5 L 17 16.346' },
  };

  return (
    <div>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={overlayVariants}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            className='fixed inset-0 z-40 bg-black'
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className='fixed bottom-32 right-0 z-50 md:hidden'>
        <motion.div
          className='menu-container'
          initial={false}
          animate={isOpen ? 'open' : 'closed'}>
          <motion.ul className='absolute bottom-10 right-2 w-32  text-center'>
            <motion.li variants={menuItemVariants}>
              <Link
                href='/addEntry'
                passHref
                className=' block rounded  bg-amber-700 px-4 py-2 text-white hover:bg-amber-600'
                onClick={() => setIsOpen(false)}>
                Add Entry
              </Link>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <Link
                href='/'
                passHref
                className='mt-2 block  rounded bg-amber-700 px-4 py-2 text-white hover:bg-amber-600'
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </motion.li>
          </motion.ul>
          <motion.button
            className='relative h-6 w-6 focus:outline-none'
            onClick={() => setIsOpen(!isOpen)}>
            <div className=' '>
              <svg width='23' height='23' viewBox='0 0 23 23' fill='none'>
                <motion.path
                  fill='none'
                  strokeWidth='3'
                  strokeLinecap='round'
                  stroke='currentColor'
                  initial={{ d: 'M 2 2.5 L 20 2.5' }} // initial state
                  variants={topBarVariants}
                />
                <motion.path
                  fill='none'
                  strokeWidth='3'
                  strokeLinecap='round'
                  stroke='currentColor'
                  initial={{ d: 'M 2 9.423 L 20 9.423', opacity: 1 }} // initial state with opacity
                  variants={middleBarVariants}
                />
                <motion.path
                  fill='none'
                  strokeWidth='3'
                  strokeLinecap='round'
                  stroke='currentColor'
                  initial={{ d: 'M 2 16.346 L 20 16.346' }} // initial state
                  variants={bottomBarVariants}
                />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

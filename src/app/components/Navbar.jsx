'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Simplified variants for animations
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
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };

  const bottomBarVariants = {
    closed: { d: 'M 3 20 L 21 20' },
    open: { d: 'M 21 4 L 3 20' },
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className='flex  '>
        <div className='hidden md:mx-auto md:flex md:max-w-3xl md:flex-row md:items-center md:justify-center'>
          <div className='flex items-center gap-8 px-12 pt-2 align-middle'>
            <Link
              href={'/'}
              className=' rounded border border-zinc-950 px-4 py-1 font-extrabold text-black hover:bg-zinc-950 hover:text-white'>
              Home
            </Link>

            <Link
              href={'/addEntry'}
              className='  rounded border border-zinc-950 px-4 py-1 font-extrabold text-black hover:bg-zinc-950 hover:text-white'>
              Add Entry
            </Link>
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
            className='fixed inset-0 z-40  bg-black'
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* mobile nav */}
      <div className='fixed bottom-24 right-3 z-40  md:hidden'>
        <motion.div
          className='menu-container'
          initial={false}
          animate={isOpen ? 'open' : 'closed'}>
          <motion.ul
            className={`absolute bottom-16 right-1 mb-2 w-32  text-center ${
              isOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}>
            <motion.li variants={menuItemVariants}>
              <Link
                href='/addEntry'
                passHref
                className=' block rounded  bg-amber-700  py-3 text-white hover:bg-amber-600'
                onClick={() => setIsOpen(false)}>
                Add Entry
              </Link>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <Link
                href='/'
                passHref
                className='mt-3 block  rounded bg-amber-700  py-3 text-white hover:bg-amber-600'
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </motion.li>
          </motion.ul>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center justify-center  rounded-full bg-white p-5'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 4 L 21 4' }} // initial state
                variants={topBarVariants}
              />
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 12 L 21 12' }} // initial state with opacity
                variants={middleBarVariants}
              />
              <motion.path
                fill='none'
                strokeWidth='3'
                strokeLinecap='square'
                stroke='currentColor'
                initial={{ d: 'M 3 20 L 21 20' }} // initial state
                variants={bottomBarVariants}
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}

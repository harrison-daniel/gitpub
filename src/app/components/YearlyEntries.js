'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EntryListItem from './EntryListItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { HiOutlineSelector } from 'react-icons/hi';

const itemVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
};

export default function YearlyEntries({ year, entries, onDelete, onEdit }) {
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortOption === 'date') {
      return sortDirection === 'desc'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    } else if (sortOption === 'title') {
      return sortDirection === 'asc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    } else {
      return sortDirection === 'asc'
        ? b.cityStateAddress.localeCompare(a.cityStateAddress)
        : a.cityStateAddress.localeCompare(b.cityStateAddress);
    }
  });

  return (
    <Accordion
      type='single'
      collapsible
      className='mb-3 overflow-hidden rounded-xl border border-amber-200/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/80'>
      <AccordionItem value={`year-${year}`} className='border-none'>
        <AccordionTrigger className='entryList-header px-4 py-3 text-2xl font-extrabold hover:no-underline'>
          <span className='flex items-baseline gap-2'>
            {year}
            <span className='text-sm font-medium text-stone-600 dark:text-gray-400'>
              · {entries.length} {entries.length === 1 ? 'trip' : 'trips'}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className='px-3 pb-3'>
          <div className='mb-3 flex justify-between gap-2'>
            <Button
              onClick={() => handleSort('title')}
              variant='sort'
              size='form'>
              Name
              {sortOption === 'title' && (
                <HiOutlineSelector className='h-4 w-4' />
              )}
            </Button>
            <Button
              onClick={() => handleSort('address')}
              variant='sort'
              size='form'>
              Location
              {sortOption === 'address' && (
                <HiOutlineSelector className='h-4 w-4' />
              )}
            </Button>
            <Button
              onClick={() => handleSort('date')}
              variant='sort'
              size='form'>
              Date
              {sortOption === 'date' && (
                <HiOutlineSelector className='h-4 w-4' />
              )}
            </Button>
          </div>
          <AnimatePresence initial={false}>
            {sortedEntries.map((entry) => (
              <motion.div
                key={entry._id}
                layout
                variants={itemVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}>
                <EntryListItem entry={entry} onDelete={onDelete} onEdit={onEdit} />
              </motion.div>
            ))}
          </AnimatePresence>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

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

export default function NoDateEntries({ entries, onDelete, onEdit }) {
  const [sortOption, setSortOption] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (option) => {
    setSortOption(option);
    setSortDirection(
      sortOption === option && sortDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const sortedEntries = [...entries].sort((a, b) => {
    let valueA = a[sortOption];
    let valueB = b[sortOption];

    if (valueA == null || valueB == null) return 0;

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });

  return (
    <Accordion
      key='no-date'
      type='single'
      collapsible
      className='mb-3 overflow-hidden rounded-xl border border-amber-200/60 bg-white/50 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70'>
      <AccordionItem value='no-date' className='border-none'>
        <AccordionTrigger className='entryList-header px-4 py-3 text-2xl font-extrabold hover:no-underline'>
          <span className='flex items-baseline gap-2'>
            No Date
            <span className='text-sm font-normal text-stone-500 dark:text-gray-400'>
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
              onClick={() => handleSort('cityStateAddress')}
              variant='sort'
              size='form'>
              Location
              {sortOption === 'cityStateAddress' && (
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

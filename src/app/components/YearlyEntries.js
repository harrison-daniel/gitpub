'use client';

import { useState } from 'react';
import EntryListItem from './EntryListItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { HiOutlineSelector } from 'react-icons/hi';

export default function YearlyEntries({ year, entries, onDelete }) {
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
      className='mb-3 overflow-hidden rounded-xl border border-amber-200/60 bg-white/50 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70'>
      <AccordionItem value={`year-${year}`} className='border-none'>
        <AccordionTrigger className='entryList-header px-4 py-3 text-2xl font-extrabold hover:no-underline'>
          <span className='flex items-baseline gap-2'>
            {year}
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
          {sortedEntries.map((entry) => (
            <EntryListItem key={entry._id} entry={entry} onDelete={onDelete} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

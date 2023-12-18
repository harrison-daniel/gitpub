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

export default function YearlyEntries({ year, entries }) {
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortDirection((prevDirection) =>
        prevDirection === 'desc' ? 'asc' : 'desc',
      );
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortOption === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
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
  // const handleSort = (option) => {
  //   setSortOption(option);
  //   setSortDirection(
  //     sortOption === option && sortDirection === 'asc' ? 'desc' : 'asc',
  //   );
  // };

  // const sortedEntries = entries.sort((a, b) => {
  //   let comparison = 0;
  //   if (sortOption === 'date') {
  //     comparison = new Date(b.date) - new Date(a.date);
  //   } else if (sortOption === 'title' || sortOption === 'cityStateAddress') {
  //     comparison = a[sortOption].localeCompare(b[sortOption]);
  //   }
  //   return sortDirection === 'asc' ? comparison : -comparison;
  // });

  return (
    <Accordion
      key={year}
      type='single'
      collapsible
      className='my-2 border border-black'>
      <AccordionItem value={`year-${year}`} className='mx-2'>
        <AccordionTrigger className='entryList-header flex justify-center text-3xl font-extrabold'>
          {year}
        </AccordionTrigger>
        <AccordionContent>
          <div className=' mb-4 flex justify-center gap-2  '>
            <Button
              onClick={() => handleSort('title')}
              className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-neutral-800  dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Name
              {sortOption === 'title' && (
                <HiOutlineSelector className=' h-5 w-5' />
              )}
            </Button>
            <Button
              onClick={() => handleSort('address')}
              className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-neutral-800 dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Location
              {sortOption === 'address' && (
                <HiOutlineSelector className=' h-5 w-5' />
              )}
            </Button>
            <Button
              onClick={() => handleSort('date')}
              className='bg-amber-700  text-white hover:bg-amber-600 dark:bg-neutral-800  dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Date{' '}
              {sortOption === 'date' && (
                <HiOutlineSelector className=' h-5 w-5' />
              )}
            </Button>
          </div>
          {sortedEntries.map((entry) => (
            <EntryListItem key={entry._id} entry={entry} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

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

export default function NoDateEntries({ entries }) {
  const [sortOption, setSortOption] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (option) => {
    setSortOption(option);
    setSortDirection(
      sortOption === option && sortDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const sortedEntries = entries.sort((a, b) => {
    let valueA = a[sortOption];
    let valueB = b[sortOption];
  
    // Handling null or undefined
    if (valueA == null || valueB == null) {
      return 0;
    }
  
    // Custom logic for date comparison
    if (sortOption === 'date') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
  
    // String comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  
    // Numeric or Date comparison
    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });

  return (
    <Accordion
      key='no-date'
      type='single'
      collapsible
      className='my-2 border border-black'>
      <AccordionItem value='no-date ' className='mx-4'>
        <AccordionTrigger className='entryList-header flex justify-center text-3xl font-extrabold'>
          No Date
        </AccordionTrigger>
        <AccordionContent>
          <div className='mb-4 flex justify-around gap-4 '>
            <Button
              onClick={() => handleSort('title')}
              className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Name
              {sortOption === 'title' && (
                <HiOutlineSelector className=' h-5 w-5' />
              )}
            </Button>
            <Button
              onClick={() => handleSort('cityStateAddress')}
              className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Location
              {sortOption === 'address' && (
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
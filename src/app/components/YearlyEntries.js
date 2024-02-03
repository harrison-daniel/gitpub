'use client';

import { useState, useEffect } from 'react';
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
  const [sortDirection, setSortDirection] = useState('desc');

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
          <div className='  mb-3  flex justify-center gap-2 '>
            <Button onClick={() => handleSort('title')} variant='sort'>
              Sort by Name
              {sortOption === 'title' && (
                <HiOutlineSelector className=' h-5 w-5' />
              )}
            </Button>
            <Button onClick={() => handleSort('address')} variant='sort'>
              Sort by Location
              {sortOption === 'address' && (
                <HiOutlineSelector className=' h-5 w-5' />
              )}
            </Button>
            <Button onClick={() => handleSort('date')} variant='sort'>
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

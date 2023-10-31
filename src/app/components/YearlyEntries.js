import React, { useState } from 'react';
import EntryListItem from './EntryListItem';
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
        ? b.address.localeCompare(a.address)
        : a.address.localeCompare(b.address);
    }
  });

  return (
    <div>
      <div className='mb-4 flex justify-center gap-4'>
        {/* Sorting Buttons */}
        <div className=' mb-4 flex justify-center gap-4 '>
          <Button
            // size='md'
            className='bg-amber-700  text-white hover:bg-amber-600'
            onClick={() => handleSort('date')}>
            Sort by Date
            {sortOption === 'date' && (
              <HiOutlineSelector className=' h-5 w-5' />
            )}
          </Button>
          <Button
            // size='md'
            className='bg-amber-700  text-white hover:bg-amber-600'
            onClick={() => handleSort('title')}>
            Sort by Name
            {sortOption === 'title' && (
              <HiOutlineSelector className=' h-5 w-5' />
            )}
          </Button>
          <Button
            // size='md'
            className='bg-amber-700  text-white hover:bg-amber-600'
            onClick={() => handleSort('address')}>
            Sort by Location
            {sortOption === 'address' && (
              <HiOutlineSelector className=' h-5 w-5' />
            )}
          </Button>
        </div>
        {/* ... other sort options ... */}
      </div>
      {sortedEntries.map((entry) => (
        <EntryListItem key={entry._id} entry={entry} />
      ))}
    </div>
  );
}

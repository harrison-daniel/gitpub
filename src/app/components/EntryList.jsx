'use client';

import { Button } from '../components/ui/button';
import EntryListItem from './EntryListItem';
import React, { useState } from 'react';
import { HiOutlineSelector } from 'react-icons/hi';

export default function EntryList({ entries }) {
  const [sortOption, setSortOption] = useState('date'); // default sorting
  const [sortDirection, setSortDirection] = useState('desc'); // default to descending
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

  const handleSort = (option) => {
    if (sortOption === option) {
      // If the current sort option is clicked again, toggle the sort direction
      setSortDirection((prevDirection) =>
        prevDirection === 'desc' ? 'asc' : 'desc',
      );
    } else {
      // If a different sort option is clicked, set to that and default to descending
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  return (
    <div className='mx-auto max-w-3xl px-9 '>
      <h1 className='mt-16 flex justify-center pb-4 text-center text-2xl font-bold '>
        My Trips:
      </h1>
      <div className=' mb-4 flex justify-center gap-4 '>
        <Button
          // size='md'
          className='bg-amber-700  text-white hover:bg-amber-600'
          onClick={() => handleSort('date')}>
          Sort by Date{' '}
          {sortOption === 'date' && <HiOutlineSelector className=' h-5 w-5' />}
        </Button>
        <Button
          // size='md'
          className='bg-amber-700  text-white hover:bg-amber-600'
          onClick={() => handleSort('title')}>
          Sort by Name{' '}
          {sortOption === 'title' && <HiOutlineSelector className=' h-5 w-5' />}
        </Button>
        <Button
          // size='md'
          className='bg-amber-700  text-white hover:bg-amber-600'
          onClick={() => handleSort('address')}>
          Sort by Location{' '}
          {sortOption === 'address' && (
            <HiOutlineSelector className=' h-5 w-5' />
          )}
        </Button>
      </div>
      {entries && entries.length === 0 ? (
        <div> No Entries, Search or Click Add to start your list!</div>
      ) : null}
      {sortedEntries.map((entry) => (
        <EntryListItem key={entry._id} entry={entry} />
      ))}
    </div>
  );
}

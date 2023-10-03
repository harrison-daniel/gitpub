'use client';

import { Button } from '@nextui-org/react';
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
    <div className='mx-auto max-w-3xl '>
      <h1 className='flex justify-center pb-4 text-center text-3xl font-bold'>
        My Brewery Trips:
      </h1>
      <div className='flex justify-center gap-4   pb-4 '>
        <Button
          size='sm'
          className='bg-amber-600 font-semibold text-white hover:bg-amber-500'
          onClick={() => handleSort('date')}>
          Sort by Date {sortOption === 'date' && <HiOutlineSelector />}
        </Button>
        <Button
          size='sm'
          className='bg-amber-600 font-semibold text-white hover:bg-amber-500'
          onClick={() => handleSort('title')}>
          Sort by Name {sortOption === 'title' && <HiOutlineSelector />}
        </Button>
        <Button
          size='sm'
          className='bg-amber-600 font-semibold text-white hover:bg-amber-500'
          onClick={() => handleSort('address')}>
          Sort by Location {sortOption === 'address' && <HiOutlineSelector />}
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

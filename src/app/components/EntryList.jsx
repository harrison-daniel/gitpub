'use client';

// import React from 'react';
// import RemoveBtn from './RemoveBtn';
// import { HiPencilAlt } from 'react-icons/hi';
// import Link from 'next/link';
// import { format } from 'date-fns';
import { Button } from '@nextui-org/react';
import EntryListItem from './EntryListItem';
import React, { useState } from 'react';
import { HiOutlineSelector } from 'react-icons/hi';
import { Suspense } from 'react';
// import { IconName } from "react-icons/hi";

export default function EntryList({ entries }) {
  const [sortOption, setSortOption] = useState('date'); // default sorting
  const [sortDirection, setSortDirection] = useState('desc'); // default to descending
  const sortedEntries = [...entries].sort((a, b) => {
    if (sortOption === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    } else if (sortOption === 'title') {
      return sortDirection === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    } else {
      return sortDirection === 'desc'
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
      <div className='sorting-options flex justify-center gap-8  pb-4 '>
        <Button
          className='bg-amber-600 font-semibold text-white hover:bg-amber-500'
          onClick={() => handleSort('date')}>
          Sort by Date{' '}
          {sortOption === 'date' && <HiOutlineSelector className='text-2xl' />}
        </Button>
        <Button
          className='bg-amber-600 font-semibold text-white hover:bg-amber-500'
          onClick={() => handleSort('title')}>
          Sort by Brewery Name{' '}
          {sortOption === 'title' && <HiOutlineSelector className='text-2xl' />}
        </Button>

        <Button
          className='bg-amber-600 font-semibold text-white hover:bg-amber-500'
          onClick={() => handleSort('address')}>
          Sort by Location{' '}
          {sortOption === 'address' && (
            <HiOutlineSelector className='text-2xl' />
          )}
        </Button>
      </div>

      {entries && entries.length === 0 ? (
        <div> No Entries, Search or Click Add to start your list!</div>
      ) : null}
      {/* <Suspense fallback={<div>Loading...</div>}> */}

      {sortedEntries.map((entry) => (
        <EntryListItem key={entry._id} entry={entry} />
      ))}

      {/* </Suspense> */}
    </div>
  );
}

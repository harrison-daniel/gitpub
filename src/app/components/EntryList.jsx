'use client';
import React from 'react';
import useUserEntries from '../lib/useUserEntries';
import YearlyEntries from './YearlyEntries';
import NoDateEntries from './NoDateEntries';
import Loading from '../loading';

export default function EntryList() {
  const { entries, isLoading, isError } = useUserEntries();

  if (isLoading) {
    return <div>{Loading()}</div>;
  }

  if (isError) {
    return (
      <p className='top-52 mx-auto mt-32 gap-4 text-center '>
        Error loading entries. Please try again later.
      </p>
    );
  }

  if (!Array.isArray(entries)) {
    return (
      <div>
        <p className=' mx-auto mt-52 gap-4 text-center '>No entries found.</p>
      </div>
    );
  }

  const { datedEntries, noDateEntries } = entries.reduce(
    (acc, entry) => {
      const entryDate = new Date(entry.date);
      const entryYear =
        entry.date && !isNaN(entryDate.getTime())
          ? entryDate.getFullYear().toString()
          : 'No Date';

      if (entryYear === 'No Date') {
        acc.noDateEntries.push(entry);
      } else {
        if (!acc.datedEntries[entryYear]) {
          acc.datedEntries[entryYear] = [];
        }
        acc.datedEntries[entryYear].push(entry);
      }
      return acc;
    },
    { datedEntries: {}, noDateEntries: [] },
  );

  const yearsSortedDescending = Object.keys(datedEntries).sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <div className='z-50  mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
      <h1 className='entryList-header  pb-4 text-center text-4xl font-extrabold'>
        My Trips:
      </h1>

      {yearsSortedDescending.map((year) => (
        <YearlyEntries key={year} year={year} entries={datedEntries[year]} />
      ))}

      {noDateEntries.length > 0 && <NoDateEntries entries={noDateEntries} />}
    </div>
  );
}

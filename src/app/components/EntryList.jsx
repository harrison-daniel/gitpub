// components/NewestEntryList.js
'use client';
import React from 'react';
import useUserEntries from '../lib/useUserEntries';
import YearlyEntries from './YearlyEntries';
import NoDateEntries from './NoDateEntries';

export default function NewestEntryList() {
  const { entries, isLoading, isError } = useUserEntries();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading entries.</p>;

  if (!Array.isArray(entries)) {
    return <p>No entries found.</p>;
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
    <div className='mx-auto max-w-md px-7 pb-12 md:max-w-xl'>
      <h1 className='entryList-header pb-4 text-center text-4xl font-extrabold'>
        My Trips:
      </h1>

      {/* Render YearlyEntries and NoDateEntries with the sorted entries */}
      {yearsSortedDescending.map((year) => (
        <YearlyEntries key={year} year={year} entries={datedEntries[year]} />
      ))}

      {noDateEntries.length > 0 && <NoDateEntries entries={noDateEntries} />}
    </div>
  );
}

// 'use client';

import React from 'react';
import YearlyEntries from './YearlyEntries';
import NoDateEntries from './NoDateEntries';

export default async function EntryList({ userEntries }) {
  if (!Array.isArray(userEntries)) {
    console.error('userEntries is not an array.', userEntries);
    return <p>Error: Entries data is not in the correct format.</p>;
  }

  const { datedEntries, noDateEntries } = userEntries.reduce(
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

  // Sort the years in descending order
  const yearsSortedDescending = Object.keys(datedEntries).sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <div className='mx-auto max-w-md  px-7 pb-12 md:max-w-xl'>
      <h1 className='entryList-header pb-4 text-center text-4xl font-extrabold '>
        My Trips:
      </h1>

      {yearsSortedDescending.map((year) => (
        <YearlyEntries key={year} year={year} entries={datedEntries[year]} />
      ))}

      {noDateEntries.length > 0 && <NoDateEntries entries={noDateEntries} />}
    </div>
  );
}

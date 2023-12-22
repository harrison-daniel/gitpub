// 'use client';

import React from 'react';
import YearlyEntries from './YearlyEntries';
import NoDateEntries from './NoDateEntries';

export default function EntryList({ userEntries }) {
  console.log('ENTRYLIST ENTRIES:', userEntries);

  if (!userEntries || userEntries.length === 0) {
    return (
      <p>
        Search for a brewery above, and create an Account to save one to your
        list!
      </p>
    );
  }

  // Sort the entries into dated and no date entries

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

// import React, { useState, useEffect } from 'react';

// const [datedEntries, setDatedEntries] = useState({});
// const [noDateEntries, setNoDateEntries] = useState([]);

// const processEntries = (entries) => {
//   const dated = {};
//   const noDate = [];

//   entries.forEach((entry) => {
//     const entryYear = entry.date
//       ? new Date(entry.date).getFullYear()
//       : 'No Date';
//     if (entryYear === 'No Date') {
//       noDate.push(entry);
//     } else {
//       dated[entryYear] = dated[entryYear] || [];
//       dated[entryYear].push(entry);
//     }
//   });

//   setDatedEntries(dated);
//   setNoDateEntries(noDate);
// };

// useEffect(() => {
//   if (session) {
//     fetchEntries().then((entries) => processEntries(entries));
//   }
// }, [session]);

// 'use client';
// import { groupEntriesByYear } from './lib/groupEntriesByYear';
import getAllEntries from './lib/getAllEntries';
import BrewerySearch from './components/BrewerySearch';
import Background from './components/Background';
import EntryList from './components/EntryList';
import { Analytics } from '@vercel/analytics/react';
import './loading';
// import React, { useEffect, useState } from 'react';

export default async function Home() {
  // const [entries, setEntries] = useState([]);
  const { entries = [] } = (await getAllEntries()) || {};

  // useEffect(() => {
  //   const fetchEntries = async () => {
  //     try {
  //       const data = await getAllEntries('date', 'desc');
  //       setEntries(data.entries || []);
  //       Router.refresh();
  //     } catch (error) {
  //       console.error('Failed to fetch entries:', error);
  //     }
  //   };

  //   fetchEntries();
  // }, []);

  return (
    <>
      <Background />
      <BrewerySearch />
      <EntryList entries={entries} />
      <Analytics />
    </>
  );
}

// export default async function Home() {
//   const { entries = [] } = (await getAllEntries()) || {};

//   return (
//     <>
//       <Background />
//       <BrewerySearch />
//       <EntryList entries={entries} />
//       <Analytics />
//     </>
//   );
// }

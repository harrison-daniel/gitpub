// 'use client';

import RemoveBtn from './RemoveBtn';
// change icon??
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';

const getEntries = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/entries', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (error) {
    console.log('Error loading entries: ', error);
  }
};

export default async function EntryList() {
  const { entries } = await getEntries();

  return (
    <>
      <h1 className='font-mono text-3xl font-bold'>My Brewery Trips:</h1>
      {entries.map((entry) => (
        <div
          className='flex justify-between items-start border border-slate-900 p-4 m-4 gap-5 bg-amber-500 bg-opacity-80'
          key={entry._id}>
          <div>
            <h1 className='text-2xl font-bold whitespace-pre-wrap'>
              {entry.title}
            </h1>
            <div className='whitespace-pre-wrap'>{entry.description}</div>
          </div>

          <div>
            <RemoveBtn id={entry._id} />

            <Link href={`/editEntry/${entry._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}

'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { groupEntriesByYear } from '../lib/groupEntriesByYear';
import YearlyEntries from './YearlyEntries';
import { Spinner } from '@nextui-org/react';

export default function EntryList({ entries }) {
  const sortedAndGroupedEntries = groupEntriesByYear(entries);

  return (
    <div className='mx-auto max-w-sm px-8'>
      <h1 className='pb-4 text-center text-2xl font-bold '>My Trips:</h1>
      {/* {entries.length === 0 ? (
        <div>No Entries, Search or Click Add to start your list!</div>
      ) : null} */}
      {/* {entries.length === 0 ? (
        <div className='mx-auto mt-56 gap-4 text-center'>
          <Spinner label='Loading...' size='lg' className='top-50' />
        </div>
      ) : null} */}

      {sortedAndGroupedEntries.map(({ year, entries }) => (
        <Accordion
          key={year}
          type='single'
          collapsible
          className='my-2 border border-black'>
          <AccordionItem value={`year-${year}`}>
            <AccordionTrigger className='flex justify-center text-2xl font-bold'>
              {year}
            </AccordionTrigger>
            <AccordionContent>
              <YearlyEntries year={year} entries={entries} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}

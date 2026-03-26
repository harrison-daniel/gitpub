'use client';
import { useOptimistic, startTransition, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useUserEntries from '../lib/useUserEntries';
import EntryListItem from './EntryListItem';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { HiOutlineSelector } from 'react-icons/hi';

function EntryListSkeleton() {
  return (
    <div className='z-50 mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
      <h1 className='entryList-header pb-4 text-center text-4xl font-extrabold'>
        My Trips
      </h1>
      <Skeleton className='mb-4 h-10 w-full rounded-xl' />
      {[0, 1].map((i) => (
        <div key={i} className='mb-3'>
          <Skeleton className='h-10 w-full rounded-t-xl' />
          {[0, 1, 2].map((j) => (
            <Skeleton key={j} className='mt-1 h-18 w-full last:rounded-b-xl' />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function EntryList({ onEdit }) {
  const { entries, isLoading, isError, mutate } = useUserEntries();
  const [filterText, setFilterText] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const shouldReduceMotion = useReducedMotion();

  const [optimisticEntries, removeOptimisticEntry] = useOptimistic(
    entries,
    (state, idToRemove) => state.filter((e) => e._id !== idToRemove),
  );

  const handleDelete = (id) => {
    startTransition(async () => {
      removeOptimisticEntry(id);
      try {
        const res = await fetch(`/api/entries?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        await mutate();
        toast('Entry deleted');
      } catch {
        await mutate();
        toast('Failed to delete entry.', { style: { background: 'red' } });
      }
    });
  };

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortOption(option);
      setSortDirection(option === 'date' ? 'desc' : 'asc');
    }
  };

  if (isLoading) return <EntryListSkeleton />;

  if (isError) {
    return (
      <p className='mx-auto mt-32 text-center'>
        Error loading entries. Please try again later.
      </p>
    );
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    return (
      <div className='mx-auto mt-16 flex max-w-xs flex-col items-center gap-3 px-6 text-center'>
        <p className='text-2xl font-bold'>No trips logged yet</p>
        <p className='text-sm text-muted-foreground'>
          Search for a brewery above and add it to start building your journal.
        </p>
      </div>
    );
  }

  // Filter
  const filtered = filterText
    ? optimisticEntries.filter(
        (e) =>
          e.title?.toLowerCase().includes(filterText.toLowerCase()) ||
          e.cityStateAddress?.toLowerCase().includes(filterText.toLowerCase()) ||
          e.streetAddress?.toLowerCase().includes(filterText.toLowerCase()),
      )
    : optimisticEntries;

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'date') {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return sortDirection === 'desc' ? db - da : da - db;
    } else if (sortOption === 'title') {
      const cmp = (a.title ?? '').localeCompare(b.title ?? '');
      return sortDirection === 'asc' ? cmp : -cmp;
    } else {
      const cmp = (a.cityStateAddress ?? '').localeCompare(b.cityStateAddress ?? '');
      return sortDirection === 'asc' ? cmp : -cmp;
    }
  });

  // Group entries by year (for date sort) or single group (for name/location sort)
  const yearGroups = [];
  if (sortOption === 'date') {
    let currentYear = null;
    for (const entry of sorted) {
      const entryDate = new Date(entry.date);
      const year =
        entry.date && !isNaN(entryDate.getTime())
          ? entryDate.getFullYear().toString()
          : 'No Date';
      if (year !== currentYear) {
        yearGroups.push({ year, entries: [] });
        currentYear = year;
      }
      yearGroups[yearGroups.length - 1].entries.push(entry);
    }
  } else {
    yearGroups.push({ year: null, entries: sorted });
  }

  return (
    <div className='z-50 mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
      {/* Header */}
      <div className='mb-3 flex items-baseline justify-between'>
        <h1 className='entryList-header text-4xl font-extrabold'>
          My Trips
        </h1>
        <span className='text-sm font-medium text-stone-500 dark:text-gray-400'>
          {filtered.length} {filtered.length === 1 ? 'trip' : 'trips'}
        </span>
      </div>

      {/* Always-visible search */}
      <div className='relative mb-3'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <input
          type='text'
          placeholder='Search trips...'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className='w-full rounded-xl border border-amber-200/60 bg-white/80 py-2.5 pl-10 pr-3 text-sm shadow-sm backdrop-blur-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-neutral-700/60 dark:bg-neutral-900/80 dark:focus:ring-amber-600'
        />
      </div>

      {/* Sort controls */}
      <div className='mb-4 flex gap-2'>
        {[
          { key: 'date', label: 'Date' },
          { key: 'title', label: 'Name' },
          { key: 'address', label: 'Location' },
        ].map(({ key, label }) => (
          <Button
            key={key}
            onClick={() => handleSort(key)}
            variant='sort'
            size='form'
            className='flex-1'>
            {label}
            {sortOption === key && <HiOutlineSelector className='ml-1 h-3.5 w-3.5' />}
          </Button>
        ))}
      </div>

      {/* Entry groups */}
      {filtered.length === 0 && filterText ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>
          No entries match &ldquo;{filterText}&rdquo;
        </p>
      ) : (
        yearGroups.map((group) => (
          <div
            key={group.year ?? 'all'}
            className='mb-3 overflow-hidden rounded-2xl border border-amber-200/40 bg-white/80 shadow-sm backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-900/80'>
            {/* Year header */}
            {group.year && (
              <div className='entryList-header flex items-baseline justify-between px-4 py-2.5'>
                <span className='text-xl font-extrabold'>{group.year}</span>
                <span className='text-xs font-medium text-stone-500 dark:text-gray-400'>
                  {group.entries.length}{' '}
                  {group.entries.length === 1 ? 'trip' : 'trips'}
                </span>
              </div>
            )}

            {/* Entries inside the group */}
            <div className='px-2.5 pb-2.5'>
              <AnimatePresence initial={false}>
                {group.entries.map((entry, index) => (
                  <motion.div
                    key={entry._id}
                    layout={!shouldReduceMotion}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 0.2,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.03, 0.25),
                    }}>
                    <EntryListItem
                      entry={entry}
                      onDelete={handleDelete}
                      onEdit={onEdit}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

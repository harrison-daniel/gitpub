'use client';
import { useOptimistic, startTransition, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useUserEntries from '../lib/useUserEntries';
import EntryListItem from './EntryListItem';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

function BeerMugAnimation({ reduced }) {
  const d = reduced ? 0.01 : 1;

  return (
    <motion.svg
      width={120}
      height={130}
      viewBox='0 0 120 130'
      className='text-amber-600/80 dark:text-amber-400/60'
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0.01 : 0.5 }}>
      <motion.path
        d='M30 25 L30 95 Q30 108 43 108 L77 108 Q90 108 90 95 L90 25'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: d * 1.2, ease: 'easeOut' }}
      />
      <motion.path
        d='M90 45 Q107 45 107 62 Q107 79 90 79'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        fill='none'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: d * 0.8, delay: d * 0.6, ease: 'easeOut' }}
      />
      <motion.rect
        x='33'
        width='54'
        rx='4'
        fill='currentColor'
        opacity={0.12}
        initial={{ height: 0, y: 105 }}
        animate={{ height: 77, y: 28 }}
        transition={{ duration: d * 1.8, delay: d * 1, ease: [0.33, 1, 0.68, 1] }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d * 2.5, duration: d * 0.4 }}>
        <circle cx='43' cy='30' r='7' fill='currentColor' opacity={0.08} />
        <circle cx='60' cy='27' r='9' fill='currentColor' opacity={0.1} />
        <circle cx='77' cy='30' r='7' fill='currentColor' opacity={0.08} />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={43 + i * 14}
          r={2}
          fill='currentColor'
          initial={{ cy: 95, opacity: 0 }}
          animate={{ cy: [95, 50], opacity: [0, 0.12, 0] }}
          transition={{
            duration: reduced ? 0.01 : 2.5,
            delay: reduced ? 0 : 2.8 + i * 0.6,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
      ))}
    </motion.svg>
  );
}

function EntryCardSkeleton() {
  return (
    <div className='mb-2 last:mb-0 overflow-hidden rounded-xl border border-amber-200/30 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-neutral-700/30 dark:bg-neutral-800/60'>
      <div className='flex'>
        <div className='w-1 flex-shrink-0 bg-gradient-to-b from-amber-400 to-amber-600' />
        <div className='flex-1 px-3 py-2.5'>
          <Skeleton className='mb-1 h-[14px] w-24 rounded-md' />
          <Skeleton className='mb-1 h-[15px] w-44 rounded' />
          <Skeleton className='mb-2.5 h-3.5 w-32 rounded' />
          <Skeleton className='h-3 w-12 rounded' />
        </div>
      </div>
    </div>
  );
}

function EntryListSkeleton() {
  return (
    <div className='z-50 mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
      <div className='mb-3 flex items-baseline justify-between'>
        <h1 className='entryList-header text-4xl font-extrabold'>My Trips</h1>
        <Skeleton className='h-5 w-14 rounded' />
      </div>
      <Skeleton className='mb-3 h-10 w-full rounded-xl' />
      <div className='mb-4 flex gap-2'>
        <Skeleton className='h-9 flex-1 rounded-md' />
        <Skeleton className='h-9 flex-1 rounded-md' />
        <Skeleton className='h-9 flex-1 rounded-md' />
      </div>
      {[3, 2].map((count, g) => (
        <section key={g}>
          <div className='entryList-header flex items-baseline justify-between border-b border-amber-200/40 bg-amber-50/90 px-1 py-2 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-950/90'>
            <Skeleton className='h-7 w-12 rounded' />
            <Skeleton className='h-4 w-10 rounded' />
          </div>
          <div className='pb-1 pt-1.5'>
            {Array.from({ length: count }).map((_, i) => (
              <EntryCardSkeleton key={i} />
            ))}
          </div>
        </section>
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
      <div className='mx-auto mt-12 flex max-w-xs flex-col items-center px-6 text-center'>
        <BeerMugAnimation reduced={shouldReduceMotion} />
        <p className='mt-6 text-2xl font-bold'>Start your journey</p>
        <p className='mt-1.5 text-sm text-muted-foreground'>
          Search for a brewery above and add your first visit.
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
            className={`flex-1 ${sortOption !== key ? 'opacity-70' : ''}`}>
            {label}
            {sortOption === key && (
              sortDirection === 'asc'
                ? <ChevronUp className='ml-1 h-3.5 w-3.5' />
                : <ChevronDown className='ml-1 h-3.5 w-3.5' />
            )}
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
          <section key={group.year ?? 'all'}>
            {group.year && (
              <div className='entryList-header sticky top-0 z-10 flex items-baseline justify-between border-b border-amber-200/40 bg-amber-50/90 px-1 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-950/90 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]'>
                <span className='text-lg font-extrabold'>{group.year}</span>
                <span className='text-xs font-medium text-stone-500 dark:text-gray-400'>
                  {group.entries.length}{' '}
                  {group.entries.length === 1 ? 'trip' : 'trips'}
                </span>
              </div>
            )}
            <div className='pb-1 pt-1.5'>
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
          </section>
        ))
      )}
    </div>
  );
}

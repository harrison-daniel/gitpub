'use client';
import { useOptimistic, startTransition, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserEntries from '../lib/useUserEntries';
import YearlyEntries from './YearlyEntries';
import NoDateEntries from './NoDateEntries';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { Search, SlidersHorizontal } from 'lucide-react';

function EntryListSkeleton() {
  return (
    <div className='z-50 mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
      <h1 className='entryList-header pb-4 text-center text-4xl font-extrabold'>
        My Trips:
      </h1>
      {[0, 1].map((i) => (
        <div key={i} className='mb-4'>
          <Skeleton className='mb-2 h-12 w-full rounded-xl' />
          {[0, 1, 2].map((j) => (
            <Skeleton key={j} className='mb-2 h-16 w-full rounded-xl' />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function EntryList({ onEdit }) {
  const { entries, isLoading, isError, mutate } = useUserEntries();
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

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
        toast('Entry deleted', { position: 'bottom-right' });
      } catch {
        await mutate();
        toast('Failed to delete entry.', {
          style: { background: 'red' },
          position: 'bottom-right',
        });
      }
    });
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

  const filteredEntries = filterText
    ? optimisticEntries.filter(
        (e) =>
          e.title?.toLowerCase().includes(filterText.toLowerCase()) ||
          e.cityStateAddress
            ?.toLowerCase()
            .includes(filterText.toLowerCase()) ||
          e.streetAddress?.toLowerCase().includes(filterText.toLowerCase()),
      )
    : optimisticEntries;

  const { datedEntries, noDateEntries } = filteredEntries.reduce(
    (acc, entry) => {
      const entryDate = new Date(entry.date);
      const entryYear =
        entry.date && !isNaN(entryDate.getTime())
          ? entryDate.getFullYear().toString()
          : 'No Date';
      if (entryYear === 'No Date') {
        acc.noDateEntries.push(entry);
      } else {
        if (!acc.datedEntries[entryYear]) acc.datedEntries[entryYear] = [];
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
    <div className='z-50 mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
      {/* Header + filter toggle */}
      <div className='mb-3 flex items-center justify-between'>
        <h1 className='entryList-header text-4xl font-extrabold'>My Trips:</h1>
        <button
          onClick={() => {
            setShowFilter((v) => !v);
            if (showFilter) setFilterText('');
          }}
          title='Filter entries'
          className={`rounded-lg p-2 transition-colors ${
            showFilter
              ? 'bg-amber-600 text-white'
              : 'text-stone-500 hover:bg-amber-100 hover:text-amber-700 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-amber-400'
          }`}>
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'>
            <div className='relative mb-4'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <input
                autoFocus
                type='text'
                placeholder='Filter by name, city, or address...'
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className='w-full rounded-xl border border-amber-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-amber-600'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredEntries.length === 0 && filterText ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>
          No entries match &ldquo;{filterText}&rdquo;
        </p>
      ) : (
        <>
          {yearsSortedDescending.map((year) => (
            <YearlyEntries
              key={year}
              year={year}
              entries={datedEntries[year]}
              onDelete={handleDelete}
              onEdit={onEdit}
            />
          ))}
          {noDateEntries.length > 0 && (
            <NoDateEntries entries={noDateEntries} onDelete={handleDelete} onEdit={onEdit} />
          )}
        </>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Hop, Plus, X, Loader2 } from 'lucide-react';
import useUserEntries from '../lib/useUserEntries';
import { useHaptics } from '../lib/haptics';
import { toast } from 'sonner';

function HopRating({ rating, size = 13 }) {
  return (
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Hop
          key={i}
          size={size}
          className={
            i <= rating
              ? 'fill-amber-500 text-amber-500'
              : 'text-stone-300 dark:text-neutral-600'
          }
        />
      ))}
    </div>
  );
}

function HopSelector({ rating, onChange }) {
  const haptics = useHaptics();

  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type='button'
          onClick={() => {
            haptics.tap();
            onChange(i);
          }}
          className='rounded p-0.5 transition-transform active:scale-90'>
          <Hop
            size={18}
            className={
              i <= rating
                ? 'fill-amber-500 text-amber-500'
                : 'text-stone-300 dark:text-neutral-600'
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function BeerLog({ entryId, beers = [] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useUserEntries();
  const haptics = useHaptics();
  const shouldReduceMotion = useReducedMotion();

  const handleAdd = async () => {
    if (!name.trim() || rating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/entries/${entryId}/beers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), rating }),
      });
      if (!res.ok) throw new Error();
      await mutate();
      setName('');
      setRating(0);
      setIsAdding(false);
      haptics.success();
    } catch {
      toast('Failed to add beer', { style: { background: 'red' } });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (beerId) => {
    try {
      const res = await fetch(
        `/api/entries/${entryId}/beers?beerId=${beerId}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error();
      await mutate();
      haptics.tap();
    } catch {
      toast('Failed to remove beer', { style: { background: 'red' } });
    }
  };

  const dur = shouldReduceMotion ? 0.01 : 0.2;

  return (
    <div className='mt-2.5 border-t border-stone-100 pt-2.5 dark:border-neutral-800'>
      <div className='mb-1.5 flex items-center gap-1.5'>
        <Hop size={13} className='text-amber-600 dark:text-amber-400' />
        <span className='text-xs font-semibold text-stone-700 dark:text-gray-300'>
          Beer Log
        </span>
        {beers.length > 0 && (
          <span className='text-xs text-stone-400 dark:text-gray-500'>
            ({beers.length})
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {beers.map((beer) => (
          <motion.div
            key={beer._id}
            layout={!shouldReduceMotion}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12, height: 0 }}
            transition={{ duration: dur, ease: [0.25, 0.1, 0.25, 1] }}
            className='group flex items-center justify-between py-1'>
            <span className='truncate text-sm text-stone-700 dark:text-gray-300'>
              {beer.name}
            </span>
            <div className='flex items-center gap-2'>
              <HopRating rating={beer.rating} />
              <button
                onClick={() => handleRemove(beer._id)}
                className='rounded p-0.5 text-stone-300 transition-opacity md:opacity-0 md:group-hover:opacity-100 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400'>
                <X size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: dur }}
            className='overflow-hidden'>
            <div className='flex flex-col gap-2 pt-1.5'>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Beer name'
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && rating > 0 && handleAdd()}
                className='w-full rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-amber-600'
              />
              <div className='flex items-center justify-between'>
                <HopSelector rating={rating} onChange={setRating} />
                <div className='flex gap-1.5'>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setName('');
                      setRating(0);
                    }}
                    className='rounded-md px-2 py-1 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:text-gray-400 dark:hover:bg-neutral-800'>
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={submitting || !name.trim() || rating === 0}
                    className='rounded-md bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40 hover:bg-amber-500'>
                    {submitting ? (
                      <Loader2 size={12} className='animate-spin' />
                    ) : (
                      'Add'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className='mt-1 flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300'>
          <Plus size={12} />
          Add a beer
        </button>
      )}
    </div>
  );
}

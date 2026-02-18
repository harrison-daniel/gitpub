'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { format } from 'date-fns';
import useUserEntries from '../lib/useUserEntries';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Skeleton } from './ui/skeleton';
import { MapPin, Beer, Calendar, TrendingUp, ChevronLeft } from 'lucide-react';

function StatCard({ value, label, icon: Icon }) {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-amber-200/60 bg-white/70 p-4 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-800/70'>
      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'>
        <Icon size={18} />
      </div>
      <div>
        <div className='text-2xl font-extrabold leading-none text-stone-900 dark:text-[#d5cea3]'>
          {value}
        </div>
        <div className='mt-0.5 text-xs font-medium text-stone-500 dark:text-gray-400'>
          {label}
        </div>
      </div>
    </div>
  );
}

function AvatarOrInitials({ image, name }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? 'avatar'}
        referrerPolicy='no-referrer'
        className='h-16 w-16 rounded-full object-cover ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-neutral-900'
      />
    );
  }

  return (
    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-xl font-extrabold text-white ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-neutral-900'>
      {initials}
    </div>
  );
}

export default function UserInfo() {
  const { data: session } = useSession();
  const { entries, isLoading } = useUserEntries();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await signOut({ callbackUrl: '/' });
    } catch {
      setIsDeleting(false);
    }
  };

  // Compute stats from entries
  const currentYear = new Date().getFullYear();

  const totalTrips = entries.length;

  const tripsThisYear = entries.filter(
    (e) => e.date && new Date(e.date).getFullYear() === currentYear,
  ).length;

  const uniqueStates = new Set(
    entries
      .map((e) => e.cityStateAddress?.split(',').pop()?.trim())
      .filter(Boolean),
  ).size;

  const uniqueCities = new Set(
    entries
      .map((e) => e.cityStateAddress?.split(',')[0]?.trim())
      .filter(Boolean),
  ).size;

  // Top state by visit count
  const stateCounts = entries.reduce((acc, e) => {
    const state = e.cityStateAddress?.split(',').pop()?.trim();
    if (state) acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});
  const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0];

  // Member since — earliest entry's createdAt
  const memberSince =
    entries.length > 0
      ? new Date(
          Math.min(...entries.map((e) => new Date(e.createdAt).getTime())),
        )
      : null;

  return (
    <div className='mx-auto w-full max-w-md px-4 pb-12 pt-6'>
      <button
        onClick={() => router.back()}
        className='mb-4 -ml-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300'>
        <ChevronLeft size={16} />
        Back
      </button>
      <h1 className='entryList-header mb-6 text-center text-3xl font-extrabold'>
        Dashboard
      </h1>

      <div className='flex flex-col gap-4'>
        {/* Profile card */}
        <div className='rounded-2xl border border-amber-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/80'>
          <div className='flex items-center gap-4'>
            <AvatarOrInitials
              image={session?.user?.image}
              name={session?.user?.name}
            />
            <div className='min-w-0'>
              <p className='truncate text-lg font-extrabold text-stone-900 dark:text-[#d5cea3]'>
                {session?.user?.name}
              </p>
              <p className='truncate text-sm text-stone-500 dark:text-gray-400'>
                {session?.user?.email}
              </p>
              {memberSince && (
                <p className='mt-1 text-xs text-stone-400 dark:text-gray-500'>
                  Member since {format(memberSince, 'MMMM yyyy')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {isLoading ? (
          <div className='grid grid-cols-2 gap-3'>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-20 rounded-xl' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-3'>
            <StatCard value={totalTrips} label='Total Trips' icon={Beer} />
            <StatCard
              value={tripsThisYear}
              label={`${currentYear} Trips`}
              icon={TrendingUp}
            />
            <StatCard value={uniqueStates} label='States Visited' icon={MapPin} />
            <StatCard value={uniqueCities} label='Cities Visited' icon={Calendar} />
          </div>
        )}

        {/* Top state insight */}
        {topState && topState[1] > 1 && (
          <div className='rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3 text-sm dark:border-amber-900/40 dark:bg-amber-900/10'>
            <span className='text-stone-500 dark:text-gray-400'>
              Most visited state:{' '}
            </span>
            <span className='font-bold text-stone-800 dark:text-[#d5cea3]'>
              {topState[0]}
            </span>
            <span className='text-stone-400 dark:text-gray-500'>
              {' '}
              · {topState[1]} trips
            </span>
          </div>
        )}

        {/* Actions */}
        <div className='flex flex-col gap-2 pt-1'>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant='outline'
            className='w-full border-amber-200 dark:border-neutral-700'>
            Sign Out
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                className='w-full text-xs text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30'>
                Delete my account data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes all {totalTrips}{' '}
                  {totalTrips === 1 ? 'entry' : 'entries'} in your journal.
                  You&apos;ll be signed out immediately. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className='bg-red-700 text-white hover:bg-red-800'>
                  {isDeleting ? 'Deleting...' : 'Delete everything'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

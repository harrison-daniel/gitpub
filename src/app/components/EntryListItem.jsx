'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { HiPencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { Link2, MoreHorizontal, Phone, ChevronDown, Hop } from 'lucide-react';
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
} from '../components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { formatPhoneNumber } from '../lib/utils';
import { useHaptics } from '../lib/haptics';
import BeerLog from './BeerLog';

export default function EntryListItem({ entry, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const haptics = useHaptics();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className='mb-2 last:mb-0 overflow-hidden rounded-xl border border-amber-200/30 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[shadow,border-color] duration-200 hover:border-amber-300/50 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)] dark:border-neutral-700/30 dark:bg-neutral-800/60 dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:hover:border-neutral-600/50 dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)]'>
      <div className='flex'>
        <div className='w-1 flex-shrink-0 bg-gradient-to-b from-amber-400 to-amber-600' />

        <div className='flex-1 px-3 py-2.5'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0 flex-1'>
              {entry.date && !isNaN(new Date(entry.date).getTime()) && (
                <span className='mb-1 inline-block rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-amber-700/80 dark:bg-amber-900/20 dark:text-amber-400/80'>
                  {format(new Date(entry.date), 'MMM dd, yyyy')}
                </span>
              )}
              {entry.beers?.length > 0 && (
                <span className='mb-1 ml-1.5 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700/80 dark:bg-amber-900/20 dark:text-amber-400/80'>
                  <Hop size={10} className='fill-amber-500/80 text-amber-500/80' />
                  {entry.beers.length}
                </span>
              )}
              <h3 className='entryListItem-header text-[15px] font-bold leading-snug tracking-tight text-stone-900 dark:text-[#d5cea3]'>
                {entry.title}
              </h3>
              {entry.cityStateAddress && (
                <p className='font-mono text-sm text-stone-600 dark:text-gray-400'>
                  {entry.cityStateAddress}
                </p>
              )}
              {entry.streetAddress && (
                <p className='font-mono text-xs italic text-stone-400 dark:text-gray-500'>
                  {entry.streetAddress}
                </p>
              )}
            </div>

            <AlertDialog>
              <DropdownMenu modal={false} onOpenChange={(open) => open && haptics.tap()}>
                <DropdownMenuTrigger
                  aria-label='Entry actions'
                  className='mt-0.5 rounded p-1.5 -m-1 text-stone-400 transition-colors duration-100 hover:text-stone-600 data-[state=open]:text-stone-600 dark:text-gray-500 dark:hover:text-gray-300 dark:data-[state=open]:text-gray-300'>
                  <MoreHorizontal size={19} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mr-4 mt-1 flex flex-col items-start bg-white shadow-lg dark:bg-neutral-800'>
                  <DropdownMenuItem
                    onClick={() =>
                      onEdit
                        ? onEdit(entry)
                        : router.push(`/editEntry/${entry._id}`)
                    }
                    className='flex cursor-pointer flex-row items-center gap-2 font-semibold text-stone-700 hover:text-stone-900 dark:text-neutral-300 dark:hover:text-white'>
                    <HiPencilAlt size={16} />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className='flex cursor-pointer flex-row items-center gap-2 font-semibold text-red-600 hover:text-red-800 dark:hover:text-red-400'>
                      <HiOutlineTrash size={16} />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be undone. &ldquo;{entry.title}&rdquo; will be
                    permanently removed from your journal.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => { haptics.delete(); onDelete(entry._id); }}
                    className='bg-red-700 text-white hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800'>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <button
            onClick={() => { haptics.tap(); setExpanded((v) => !v); }}
            className='-ml-1.5 mt-2 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-stone-500 transition-colors duration-150 active:scale-[0.97] hover:bg-stone-100/60 hover:text-stone-700 dark:text-gray-500 dark:hover:bg-neutral-800/60 dark:hover:text-gray-300'>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
              <ChevronDown size={13} />
            </motion.span>
            {expanded ? 'Less' : 'More'}
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -4 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -4 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className='overflow-hidden'>
                <BeerLog entryId={entry._id} beers={entry.beers} />
                {(entry.phoneNumber ||
                  entry.websiteUrl ||
                  (entry.description &&
                    entry.description !== 'Edit entry to add notes')) && (
                  <div className='mt-2 flex flex-col gap-2 border-t border-stone-100 pt-2 dark:border-neutral-800'>
                    {entry.phoneNumber && (
                      <a
                        href={`tel:${entry.phoneNumber.replace(/\D/g, '')}`}
                        className='flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                        <Phone className='h-3.5 w-3.5 flex-shrink-0' />
                        {formatPhoneNumber(entry.phoneNumber)}
                      </a>
                    )}
                    {entry.websiteUrl && (
                      <a
                        href={
                          entry.websiteUrl.startsWith('http')
                            ? entry.websiteUrl
                            : `https://${entry.websiteUrl}`
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-sm text-blue-600 visited:text-purple-600 hover:text-blue-800'>
                        <Link2 className='h-3.5 w-3.5 flex-shrink-0' />
                        Website
                      </a>
                    )}
                    {entry.description &&
                      entry.description !== 'Edit entry to add notes' && (
                        <p className='text-sm leading-relaxed text-stone-600 dark:text-gray-400'>
                          {entry.description}
                        </p>
                      )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

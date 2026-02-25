'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { HiPencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { Link2, MoreHorizontal, Phone, ChevronDown } from 'lucide-react';
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
  DropdownMenuPortal,
} from '../components/ui/dropdown-menu';
import { formatPhoneNumber } from '../lib/utils';

export default function EntryListItem({ entry, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const hasDetails =
    entry.phoneNumber ||
    entry.websiteUrl ||
    (entry.description && entry.description !== 'Edit entry to add notes');

  return (
    <div className='bg-white/85 dark:bg-neutral-900/85 mb-3 overflow-hidden rounded-xl border border-amber-200/60 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-neutral-700/60'>
      <div className='flex'>
        <div className='w-1 flex-shrink-0 bg-amber-500' />

        <div className='flex-1 px-3 py-2.5'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0 flex-1'>
              {entry.date && !isNaN(new Date(entry.date).getTime()) && (
                <span className='mb-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'>
                  {format(new Date(entry.date), 'MMM dd, yyyy')}
                </span>
              )}
              <h3 className='entryListItem-header text-base font-extrabold leading-snug text-stone-900 dark:text-[#d5cea3]'>
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
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label='Entry actions'
                  className='mt-0.5 rounded p-0.5 text-stone-400 transition-transform active:scale-[0.90] hover:text-stone-600 dark:text-gray-500 dark:hover:text-gray-300'>
                  <MoreHorizontal size={19} />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
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
                </DropdownMenuPortal>
              </DropdownMenu>

              <AlertDialogContent>
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
                    onClick={() => onDelete(entry._id)}
                    className='bg-red-700 text-white hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800'>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {hasDetails && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className='mt-2 flex items-center gap-1 text-xs font-semibold text-amber-700 transition-transform active:scale-[0.95] hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300'>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
                <ChevronDown size={13} />
              </motion.span>
              {expanded ? 'Hide details' : 'Show details'}
            </button>
          )}

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className='overflow-hidden'>
                <div className='mt-2.5 flex flex-col gap-2 border-t border-amber-100 pt-2.5 dark:border-neutral-700'>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

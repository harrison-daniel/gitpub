'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Link2, MoreHorizontal } from 'lucide-react';

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
import { toast } from 'sonner';

import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import useUserEntries from '../lib/useUserEntries';

export default function EntryListItem({ entry }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate } = useUserEntries();

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return 'N/A';
    }
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.substring(0, 3)}) ${digits.substring(
        3,
        6,
      )}-${digits.substring(6)}`;
    }
    return phoneNumber;
  }

  const removeEntry = async () => {
    await mutate((currentEntries) => {
      if (Array.isArray(currentEntries)) {
        return currentEntries.filter((entry) => entry._id !== id);
      }
      return currentEntries;
    }, false); // false to not revalidate immediately

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${entry._id}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        const errorData = response.status !== 204 ? await response.json() : {};
        throw new Error(errorData.error || 'Failed to delete entry');
      }

      mutate();
      toast('Entry Deleted', {
        style: {
          // background: 'green',
          // width: '90%',
        },
        className: 'class',
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({ description: error.message, status: 'error' });

      mutate();
    }
  };

  return (
    <>
      <div className=' mb-4 rounded-lg border border-slate-900 bg-amber-400  p-2  dark:bg-neutral-800'>
        <div className='mb-2 ml-3 mr-2 flex  flex-row justify-between'>
          {/* DATE */}

          <div className='flex flex-row justify-around gap-1'>
            <div className='flex  font-mono  text-xl font-semibold text-stone-800 dark:text-gray-400 '>
              {entry.date && !isNaN(new Date(entry.date).getTime())
                ? format(new Date(entry.date), 'MM/dd/yyyy')
                : null}
            </div>
          </div>

          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal size={22} />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent className='mr-2 flex  flex-col  items-center  bg-amber-300 text-center'>
                  <DropdownMenuItem>
                    <Link
                      href={`/editEntry/${entry._id}`}
                      className='flex flex-row  gap-2  text-black hover:text-stone-600 dark:text-neutral-300 dark:hover:text-white'>
                      <HiPencilAlt size={18} />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <AlertDialogTrigger>
                    <DropdownMenuItem className=' flex flex-row gap-2  text-red-600 hover:text-red-800 dark:hover:text-red-500 '>
                      <HiOutlineTrash size={19} />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and will permanently delete this
                  entry from your profile.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={removeEntry}
                  className='   bg-red-700  text-white hover:bg-red-700 dark:bg-red-700  dark:text-white dark:hover:bg-red-800 '>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* rest of accordion / entry details */}
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='text-md  flex  flex-col items-start  gap-0  pl-3 pt-0'>
              {/* TITLE */}
              <div className='entryListItem-header border-b-medium border-black pb-1.5  text-left text-lg font-extrabold'>
                {entry.title}
              </div>

              <div className=' text-md mb-2 mt-1 dark:text-gray-400'>
                {entry.cityStateAddress}
              </div>
            </AccordionTrigger>

            <AccordionContent className='pl-6 '>
              <div className='  mb-2  flex flex-row items-center justify-between gap-4'>
                <div className='flex items-center'>{entry.streetAddress}</div>

                <div
                  href={`tel:${
                    entry.phoneNumber
                      ? entry.phoneNumber.replace(/\D/g, '')
                      : ''
                  }`}
                  className=' cursor-pointer font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                  {entry.phoneNumber
                    ? formatPhoneNumber(entry.phoneNumber)
                    : ''}
                </div>
                <div className='flex items-center'>
                  {entry.websiteUrl && (
                    <div>
                      <a
                        href={
                          entry.websiteUrl.startsWith('http')
                            ? entry.websiteUrl
                            : `http://${entry.websiteUrl}`
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        className='  flex w-24 flex-row items-center gap-2 py-1  text-blue-600 visited:text-purple-600 hover:text-blue-800'>
                        <Link2 />
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div>{entry.description}</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

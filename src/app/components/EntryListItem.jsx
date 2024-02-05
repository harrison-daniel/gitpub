'use client';

import React, { useState } from 'react';
import { format, set } from 'date-fns';
// import RemoveBtn from './RemoveBtn';
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Link2, Settings, MoreVertical, MoreHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ui/use-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import { Button } from '../components/ui/button';
import useUserEntries from '../lib/useUserEntries';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/ui/drawer';

export default function EntryListItem({ entry }) {
  const [open, setOpen] = useState(false);

  function formatPhoneNumber(phoneNumber) {
    // Check if phoneNumber is null or undefined
    if (!phoneNumber) {
      return 'N/A';
    }

    // Remove all non-numeric characters
    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length === 10) {
      return `(${digits.substring(0, 3)}) ${digits.substring(
        3,
        6,
      )}-${digits.substring(6)}`;
    }

    // Return original string if it doesn't have 10 digits
    return phoneNumber;
  }

  const { mutate } = useUserEntries();
  const { toast } = useToast();
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

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

      setOpen(false);
      mutate();
      toast({ description: 'Entry Deleted' });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({ description: error.message, status: 'error' });

      mutate();
    }
  };

  return (
    <>
      <div className=' mb-4 rounded-lg border border-slate-900 bg-amber-400  p-2  dark:bg-neutral-800'>
        {/* SETTINGS & DATE DIV  */}
        <div className='mb-2 ml-3 mr-2 flex  flex-row justify-between'>
          {/* DATE */}
          <div className='flex  font-mono  text-xl font-semibold text-stone-800 dark:text-gray-400 '>
            {entry.date && !isNaN(new Date(entry.date).getTime())
              ? format(new Date(entry.date), 'MM/dd/yyyy')
              : null}
          </div>
          {/* SETTING COG WHEEL */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <MoreHorizontal size={22} />
            </PopoverTrigger>
            <PopoverContent className='fixed -right-4  w-fit flex-col items-end gap-2 bg-amber-300 px-3 py-3 font-semibold dark:bg-zinc-950 '>
              <Link
                href={`/editEntry/${entry._id}`}
                className='dark:active:white mb-2 flex flex-row  items-center gap-2 hover:text-stone-400 dark:text-neutral-300 dark:hover:text-white'>
                <HiPencilAlt size={18} />
                Edit
              </Link>

              <Drawer>
                <DrawerTrigger className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
                  <HiOutlineTrash size={19} />
                  Delete
                </DrawerTrigger>
                <DrawerContent className='bg-amber-400 dark:bg-zinc-800'>
                  <DrawerHeader className='mx-auto flex flex-col items-center'>
                    <DrawerTitle className='text-lg font-bold'>
                      Are you sure you want to delete this entry?
                    </DrawerTitle>
                    <DrawerDescription className='font-semibold text-amber-900 '>
                      This action cannot be undone.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className='mx-auto'>
                    <button
                      onClick={removeEntry}
                      className='rounded-md bg-red-600  p-2 px-4 text-sm font-semibold text-slate-200'>
                      Delete
                    </button>
                    <DrawerClose
                      onClick={handleClose}
                      className=' rounded-md bg-slate-200 p-2 px-4 text-sm font-semibold dark:text-black'>
                      No, Go Back
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </PopoverContent>
          </Popover>
        </div>

        {/* rest of accordion / entry details */}
        <Accordion type='single' collapsible className='  '>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='text-md pointer-events-auto flex  flex-col items-start  gap-0  pl-3 pt-0'>
              {/* TITLE */}
              <div className='entryListItem-header border-b-medium border-black pb-1.5  text-left text-lg font-extrabold'>
                {entry.title}
              </div>

              <div className=' text-md mb-2 mt-1 dark:text-gray-400'>
                {entry.cityStateAddress}
              </div>
            </AccordionTrigger>

            <AccordionContent className='pl-3 '>
              <div className='mb-2 mt-0 flex flex-row items-center gap-9 '>
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

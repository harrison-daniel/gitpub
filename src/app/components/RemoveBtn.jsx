'use client';

import React from 'react';
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

export default function RemoveBtn({ id, onClose }) {
  const { mutate } = useUserEntries();
  const { toast } = useToast();
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  const removeEntry = async (event) => {
    event.stopPropagation();
    await mutate((currentEntries) => {
      if (Array.isArray(currentEntries)) {
        return currentEntries.filter((entry) => entry._id !== id);
      }
      return currentEntries;
    }, false); // false to not revalidate immediately

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${id}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        const errorData = response.status !== 204 ? await response.json() : {};
        throw new Error(errorData.error || 'Failed to delete entry');
      }

      // Revalidate from the server
      mutate();
      onClose();
      toast({ description: 'Entry Deleted' });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({ description: error.message, status: 'error' });
      // Revert changes if error occurs
      mutate();
    }
  };

  return (
    <div className='flex  flex-col gap-2'>
      <Drawer className=''>
        <DrawerTrigger className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
          {/* <button
            className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'> */}
          <HiOutlineTrash size={19} />
          Delete
          {/* </button> */}
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
          <div className='mx-auto mb-4 flex flex-col gap-2.5'>
            <Button
              className='bg-red-700 text-white hover:bg-red-500 dark:bg-red-700 dark:text-white  dark:hover:bg-red-600 '
              onClick={(e) => removeEntry(e)}>
              Delete Entry
            </Button>

            <Button
              onClick={handleClose}
              variant='sort'
              className='bg-amber-200 text-black dark:bg-neutral-200 dark:text-black'>
              No, Go Back
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

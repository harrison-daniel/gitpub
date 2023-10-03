'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea, Button } from '@nextui-org/react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { ButtonShad } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { HiOutlineX } from 'react-icons/hi';

export default function EditEntryForm({
  id,
  title,
  address,
  description,
  date,
}) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newAddress, setNewAddress] = useState(address);
  const [newDate, setNewDate] = useState(date ? new Date(date) : null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const router = useRouter();

  const handleDateSelection = (date) => {
    setNewDate(date);
    // Close the popover when a date is selected
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bodyData = {
        newTitle,
        newAddress,
        newDescription,
      };
      if (newDate) {
        // Only add newDate if it's set
        bodyData.newDate = newDate;
      }
      const res = await fetch(`https://gitpub.vercel.app/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newTitle, newAddress, newDescription }),
      });

      // const res = await fetch(`http://localhost:3000/api/entries/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ newTitle, newAddress, newDescription, newDate }),
      // });

      if (!res.ok) {
        throw new Error('Failed to update entry');
      }
      router.refresh();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-6'>
        <Textarea
          isRequired
          label='Entry Name'
          labelPlacement='outside'
          placeholder='Enter your description'
          className='max-w-2xl'
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          rows={3}
        />
        <Textarea
          isRequired
          label='Location'
          labelPlacement='outside'
          placeholder='Enter your location'
          className='max-w-2xl'
          onChange={(e) => setNewAddress(e.target.value)}
          value={newAddress}
          rows={3}
        />
        <Textarea
          isRequired
          label='Notes'
          labelPlacement='outside'
          placeholder='Enter your notes'
          className='max-w-2xl'
          onChange={(e) => setNewDescription(e.target.value)}
          value={newDescription}
          rows={3}
        />
        {/* DATE PICKER  */}
        <div className='flex  pt-4'>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild className='rounded-xl'>
              <ButtonShad
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
                  !newDate && 'text-muted-foreground',
                )}>
                <CalendarIcon className='mr-2 h-4 w-4 ' />
                {newDate ? format(newDate, 'PPP') : <span>Pick a date</span>}
              </ButtonShad>
            </PopoverTrigger>
            <PopoverContent className='w-auto rounded-xl p-0'>
              <Calendar
                mode='single'
                selected={newDate}
                onSelect={handleDateSelection}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {newDate && ( // Only show the clear button if there's a date set ✖️
            <div className='flex items-center gap-1 text-center align-middle'>
              <button
                onClick={() => setNewDate(null)}
                title='Clear date'
                className='pl-4  text-lg font-semibold text-red-600'>
                Clear Date
              </button>
              <HiOutlineX className=' text-2xl text-red-600' />
            </div>
          )}
        </div>
        <div className='pt-6'>
          <Button
            type='submit'
            className='bg-amber-600 font-semibold text-white hover:bg-amber-500'>
            Update Entry
          </Button>
        </div>
      </form>
    </>
  );
}

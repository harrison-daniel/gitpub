'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@nextui-org/react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { X } from 'lucide-react';

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
      // const res = await fetch(`https://gitpub.vercel.app/api/entries/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ newTitle, newAddress, newDescription, newDate }),
      // });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newTitle,
            newAddress,
            newDescription,
            newDate,
          }),
        },
      );

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
      <div className=''>
        <form onSubmit={handleSubmit} className='mx-auto flex flex-col  '>
          <div className='flex flex-col items-center p-5 '>
            <Textarea
              size='lg'
              radius='sm'
              isRequired
              label='Entry Name'
              labelPlacement='outside'
              placeholder='Enter your description'
              className='max-w-2xl'
              onChange={(e) => setNewTitle(e.target.value)}
              value={newTitle}
              rows={3}
              fullWidth='false'
            />
            <Textarea
              size='lg'
              radius='sm'
              isRequired
              label='Location'
              labelPlacement='outside'
              placeholder='Enter your location'
              className='max-w-2xl'
              onChange={(e) => setNewAddress(e.target.value)}
              value={newAddress}
              rows={3}
              fullWidth='false'
            />
            <Textarea
              size='lg'
              radius='sm'
              isRequired
              label='Notes'
              labelPlacement='outside'
              placeholder='Enter your notes'
              className='max-w-2xl'
              onChange={(e) => setNewDescription(e.target.value)}
              value={newDescription}
              rows={3}
              fullWidth='false'
            />
          </div>

          <div className='mx-auto flex flex-row'>
            {/* DATE PICKER  */}
            <div className=' '>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild className='rounded-md'>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[200px] justify-start text-left font-normal',
                      !newDate && 'text-muted-foreground',
                    )}>
                    <CalendarIcon className='mr-2 h-4 w-4 ' />
                    {newDate ? (
                      format(newDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
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
            </div>
            <div className='flex '>
              {newDate && (
                <Button
                  onClick={() => setNewDate(null)}
                  title='Clear Date'
                  className='  bg-transparent text-base font-semibold text-red-600 hover:bg-transparent hover:text-red-500'>
                  Clear Date
                  <X />
                </Button>
              )}
            </div>
          </div>

          <div className='flex justify-center pt-4'>
            <Button
              type='submit'
              className='bg-amber-700  text-white hover:bg-amber-600'>
              Update Entry
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

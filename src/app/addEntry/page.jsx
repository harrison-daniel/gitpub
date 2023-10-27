'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@nextui-org/react';

import { X } from 'lucide-react';
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

export default function AddEntry() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const router = useRouter();

  const handleDateSelection = (date) => {
    setDate(date);
    // Close the popover when a date is selected
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Date:', date);

    if (!title || !address || !description) {
      alert('One or more fields are required');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries`,
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ title, address, description, date }),
        },
      );

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Failed to create an entry');
      }
    } catch (error) {}
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='mx-auto flex flex-col  px-8'>
        <div className='flex flex-col items-center  '>
          <Textarea
            size='lg'
            radius='sm'
            isRequired
            label='Entry Name'
            labelPlacement='outside'
            placeholder='Enter your description'
            className='max-w-2xl'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
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
            onChange={(e) => setAddress(e.target.value)}
            value={address}
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
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={3}
            fullWidth='false'
          />
        </div>

        <div className='mx-auto mt-4 flex flex-row'>
          {/* DATE PICKER  */}
          <div className=' '>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild className='rounded-md '>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[140px] gap-3 text-center font-normal ',
                    !date && 'text-muted-foreground',
                  )}>
                  <CalendarIcon className=' h-5 w-5 ' />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='mx-4  w-auto rounded-xl p-0'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={handleDateSelection}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className=' flex'>
            {date && (
              <Button
                onClick={() => setDate(null)}
                title='Clear Date'
                className='  bg-transparent text-base font-semibold text-red-600 hover:bg-transparent hover:text-red-500'>
                Clear Date
                <X />
              </Button>
            )}
          </div>
        </div>

        <div className='flex justify-center pt-8'>
          <Button
            type='submit'
            className='bg-amber-700  text-white hover:bg-amber-600'>
            Add Entry
          </Button>
        </div>
      </form>
    </>
  );
}

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
      // const res = await fetch('https://gitpub.vercel.app/api/entries', {
      const res = await fetch('http://localhost:3000/api/entries', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, address, description, date }),
      });

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
      <div>
        <div className='p-6'>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col items-center  '>
            <Textarea
              isRequired
              label='Entry Name'
              labelPlacement='outside'
              placeholder='Enter your description'
              className='max-w-2xl '
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              rows={3}
              fullWidth='false'
            />
            <Textarea
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

            {/* DATE PICKER  */}
            <div className=' flex  pt-6'>
              <div>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild className='rounded-xl '>
                    <ButtonShad
                      variant={'outline'}
                      className={cn(
                        'w-[200px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </ButtonShad>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto rounded-xl p-0'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={handleDateSelection}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                {date && (
                  <Button
                    endContent={<HiOutlineX className='text-xl' />}
                    onClick={() => setDate(null)}
                    title='Clear date'
                    className='bg-transparent  text-base font-semibold text-red-600 '>
                    Clear Date
                  </Button>
                )}
              </div>
            </div>
            <div className='pt-6'>
              <Button
                type='submit'
                className='bg-amber-600 font-semibold text-white hover:bg-amber-500'>
                Add Entry
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

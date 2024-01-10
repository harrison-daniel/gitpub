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
import { useSession, getSession } from "next-auth/react"
import { redirect } from 'next/navigation';

export default function AddEntry() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityStateAddress, setCityStateAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession()

  if (!session || !session.user) {
    redirect ('/');
  }


  const handleDateSelection = (date) => {
    setDate(date);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Date:', date);

    if (!title || !cityStateAddress || !description) {
      alert('One or more fields are required');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries`,
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            title,
            streetAddress,
            cityStateAddress,
            description,
            date,
            websiteUrl,
          }),
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
        <div className='mx-auto mb-4 mt-12 flex flex-row gap-3'>
          {/* DATE PICKER  */}
          <div className=' '>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild className='rounded-md '>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}>
                  <CalendarIcon className=' mr-2 h-4 w-4 ' />
                  {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
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
          <div className=' flex '>
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
        <div className='flex flex-col items-center  '>
          <Textarea
            size='lg'
            radius='sm'
            isRequired
            label='Entry or Brewery Name'
            labelPlacement='outside'
            placeholder='Enter your description'
            className=' max-w-2xl'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            rows={3}
            fullWidth='false'
          />
          <Textarea
            size='lg'
            radius='sm'
            isRequired
            label='Street'
            labelPlacement='outside'
            placeholder='Enter your description'
            className=' max-w-2xl'
            onChange={(e) => setStreetAddress(e.target.value)}
            value={streetAddress}
            rows={3}
            fullWidth='false'
          />
          <Textarea
            size='lg'
            radius='sm'
            isRequired
            label='City and State'
            labelPlacement='outside'
            placeholder='Enter your location'
            className='max-w-2xl'
            onChange={(e) => setCityStateAddress(e.target.value)}
            value={cityStateAddress}
            rows={3}
            fullWidth='false'
          />
          <Textarea
            size='lg'
            radius='sm'
            isRequired
            label='Entry Name'
            labelPlacement='outside'
            placeholder='Enter your description'
            className=' max-w-2xl'
            onChange={(e) => setWebsiteUrl(e.target.value)}
            value={websiteUrl}
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


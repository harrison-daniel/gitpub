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
  streetAddress,
  cityStateAddress,
  description,
  date,
  websiteUrl,
}) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newStreetAddress, setNewStreetAddress] = useState(streetAddress);
  const [newCityStateAddress, setNewCityStateAddress] =
    useState(cityStateAddress);
  const [newDate, setNewDate] = useState(date ? new Date(date) : null);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState(websiteUrl);
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
        newStreetAddress,
        newCityStateAddress,
        newDescription,
        newWebsiteUrl,
      };
      if (newDate) {
        // Only add newDate if it's set
        bodyData.newDate = newDate;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newTitle,
            newStreetAddress,
            newCityStateAddress,
            newDescription,
            newDate,
            newWebsiteUrl,
          }),
        },
      );

      if (!res.ok) {
        throw new Error('Failed to update entry');
      }
      router.push('/');
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=''>
        <form onSubmit={handleSubmit} className='mx-auto flex flex-col  px-8 '>
          <div className='mx-auto mb-4 mt-6 flex flex-row gap-3'>
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
                      format(newDate, 'MM/dd/yyyy')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='mx-4  w-auto rounded-xl p-0'>
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
                  className='bg-transparent text-base font-semibold text-red-600 hover:bg-transparent hover:text-red-500'>
                  Clear Date
                  <X />
                </Button>
              )}
            </div>
          </div>
          <div className='flex flex-col items-center   '>
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
              label='Street'
              labelPlacement='outside'
              placeholder='Enter your description'
              className='max-w-2xl'
              onChange={(e) => setNewStreetAddress(e.target.value)}
              value={newStreetAddress}
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
              onChange={(e) => setNewCityStateAddress(e.target.value)}
              value={newCityStateAddress}
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
            <Textarea
              size='lg'
              radius='sm'
              isRequired
              label='Website'
              labelPlacement='outside'
              placeholder='Enter your notes'
              className='max-w-2xl'
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
              value={newWebsiteUrl}
              rows={3}
              fullWidth='false'
            />
          </div>

          <div className='mb-12 flex justify-center pt-8'>
            <Button
              type='submit'
              className='  bg-amber-700 text-white hover:bg-amber-600'>
              Update Entry
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

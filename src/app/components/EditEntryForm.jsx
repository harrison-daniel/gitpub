'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
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
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
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
        newPhoneNumber,
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
            newPhoneNumber,
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
      <div>
        <form
          onSubmit={handleSubmit}
          className='mx-auto  flex w-full max-w-md  flex-col  px-8'>
          <div className='mx-auto mb-4 mt-5 flex flex-row gap-3'>
            {/* DATE PICKER  */}
            <div>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild className='rounded-md'>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[200px] justify-start bg-amber-200 text-left  font-normal hover:bg-amber-200',
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
                <PopoverContent className='mx-4 w-auto  rounded-xl bg-amber-200 p-0'>
                  <Calendar
                    mode='single'
                    selected={newDate}
                    onSelect={handleDateSelection}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex'>
              {newDate && (
                <Button
                  onClick={() => setNewDate(null)}
                  title='Clear Date'
                  variant='formAction'
                  className='gap-1 bg-transparent  text-sm font-semibold text-red-600 hover:bg-transparent hover:text-red-500'>
                  Clear Date
                  <X size={20} />
                </Button>
              )}
            </div>
          </div>
          <div className='flex  flex-col items-center gap-2'>
            <div className='w-full'>
              <Label
                className='  rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='phoneNumber'>
                Phone: {''}
              </Label>
              <Textarea
                label='phoneNumber'
                type='text'
                id='phoneNumber'
                placeholder='Enter the phone number'
                className='  resize-none '
                autoComplete='off'
                rows={1}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                value={newPhoneNumber}
              />
            </div>
            <div className='w-full'>
              <Label
                className='rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='breweryName'>
                Entry or Brewery Name
              </Label>
              <Textarea
                label='breweryName'
                type='text'
                id='breweryName'
                placeholder='Enter the entry or brewery name'
                className='resize-none'
                autoComplete='off'
                rows={1}
                onChange={(e) => setNewTitle(e.target.value)}
                value={newTitle}
              />
            </div>
            <div className='w-full'>
              <Label
                className='rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='street'>
                Street Address
              </Label>
              <Textarea
                variant='addEntryTextArea'
                label='street'
                type='text'
                id='street'
                placeholder='Enter the street address'
                className=' max-w-2xl resize-none bg-amber-200'
                autoComplete='off'
                rows={1}
                onChange={(e) => setNewStreetAddress(e.target.value)}
                value={newStreetAddress}
              />
            </div>
            <div className='w-full'>
              <Label
                className='rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='cityState'>
                City / State
              </Label>
              <Textarea
                label='cityState'
                type='text'
                id='cityState'
                placeholder='Enter the location'
                className=' max-w-2xl resize-none bg-amber-200'
                autoComplete='off'
                rows={1}
                onChange={(e) => setNewCityStateAddress(e.target.value)}
                value={newCityStateAddress}
              />
            </div>
            <div className='w-full'>
              <Label
                className='rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='webUrl'>
                Website
              </Label>
              <Textarea
                label='webUrl'
                type='text'
                id='webUrl'
                placeholder='Enter the website url'
                className=' max-w-2xl bg-amber-200'
                autoComplete='off'
                rows={1}
                onChange={(e) => setNewWebsiteUrl(e.target.value)}
                value={newWebsiteUrl}
              />
            </div>
            <div className='w-full'>
              <Label
                className='rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='notes'>
                Notes
              </Label>
              <Textarea
                label='notes'
                type='text'
                id='notes'
                placeholder='Enter your notes'
                className='max-w-2xl bg-amber-200'
                autoComplete='off'
                onChange={(e) => setNewDescription(e.target.value)}
                value={newDescription}
              />
            </div>
          </div>

          <div className='flex justify-center pt-6'>
            <Button type='submit' variant='formAction'>
              Update Entry
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

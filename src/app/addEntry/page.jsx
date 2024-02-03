'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
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
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import useUserEntries from '../lib/useUserEntries';

export default function AddEntry() {
  const { data: session } = useSession();
  const { mutate } = useUserEntries();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityStateAddress, setCityStateAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const router = useRouter();

  const handleDateSelection = (date) => {
    setDate(date);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Date:', date);

    if (!title) {
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
            phoneNumber,
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

  if (session) {
    return (
      <>
        <form
          onSubmit={handleSubmit}
          className='mx-auto  flex w-full max-w-md  flex-col  px-8'>
          <div className='mx-auto mb-4 mt-5 flex flex-row gap-3'>
            {/* DATE PICKER  */}
            <div>
              <Popover
                open={isCalendarOpen}
                onOpenChange={setIsCalendarOpen}
                className=''>
                <PopoverTrigger asChild className='rounded-md '>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[200px] justify-start bg-amber-200 text-left  font-normal hover:bg-amber-200',
                      !date && '  text-muted-foreground',
                    )}>
                    <CalendarIcon className=' mr-2 h-4 w-4 ' />
                    {date ? (
                      format(date, 'MM/dd/yyyy')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='mx-4 w-auto  rounded-xl bg-amber-200 p-0'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={handleDateSelection}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex'>
              {date && (
                <Button
                  onClick={() => setDate(null)}
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
            <div className='w-full '>
              <Label
                className=' rounded-md bg-amber-200 bg-opacity-80 p-0.5 font-bold text-black dark:bg-neutral-800 dark:text-white'
                htmlFor='breweryName'>
                Entry or Brewery Name
              </Label>
              <Textarea
                label='breweryName'
                type='text'
                id='breweryName'
                placeholder='Enter the entry or brewery name'
                className='  resize-none '
                autoComplete='off'
                rows={1}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
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
                className=' resize-none '
                autoComplete='off'
                rows={1}
                onChange={(e) => setStreetAddress(e.target.value)}
                value={streetAddress}
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
                className=' resize-none '
                autoComplete='off'
                rows={1}
                onChange={(e) => setCityStateAddress(e.target.value)}
                value={cityStateAddress}
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
                autoComplete='off'
                rows={1}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                value={websiteUrl}
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
                autoComplete='off'
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
          </div>

          <div className='flex justify-center pt-6'>
            <Button type='submit' variant='formAction'>
              Add Entry
            </Button>
          </div>
        </form>
      </>
    );
  } else {
    redirect('/');
  }
}

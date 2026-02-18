'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { toast } from 'sonner';

function Field({ label, htmlFor, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label
        htmlFor={htmlFor}
        className='text-sm font-semibold text-stone-700 dark:text-gray-300'>
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function AddEntryForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityStateAddress, setCityStateAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleDateSelection = (selected) => {
    setDate(selected);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      toast('Brewery or entry name is required.', {
        style: { background: 'red' },
        position: 'bottom-right',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/entries', {
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
      });

      if (res.ok) {
        toast('Entry saved!', { position: 'bottom-right' });
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Failed to create entry');
      }
    } catch {
      toast('Failed to save entry. Please try again.', {
        style: { background: 'red' },
        position: 'bottom-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md px-4 pb-12 pt-6'>
      <button
        type='button'
        onClick={() => router.back()}
        className='mb-4 -ml-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300'>
        <ChevronLeft size={16} />
        Back
      </button>
      <h1 className='entryList-header mb-6 text-center text-3xl font-extrabold'>
        Add Entry
      </h1>

      <div className='rounded-2xl border border-amber-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/80'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-6'>
          {/* Date picker */}
          <div className='flex items-center gap-3'>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  className={cn(
                    'w-[175px] justify-start border-amber-200 text-left font-normal dark:border-neutral-700',
                    !date && 'text-muted-foreground',
                  )}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date ? format(date, 'MM/dd/yyyy') : 'Pick a date'}
                </Button>
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

            {date && (
              <button
                type='button'
                onClick={() => setDate(null)}
                className='flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-400'>
                Clear <X size={14} />
              </button>
            )}
          </div>

          <Field label='Brewery / Entry Name *' htmlFor='title'>
            <Input
              id='title'
              placeholder="e.g. Bell's Brewery"
              autoComplete='off'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          <Field label='Phone' htmlFor='phone'>
            <Input
              id='phone'
              type='tel'
              placeholder='(555) 555-5555'
              autoComplete='off'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Field>

          <Field label='Street Address' htmlFor='street'>
            <Input
              id='street'
              placeholder='123 Main St'
              autoComplete='off'
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </Field>

          <Field label='City / State' htmlFor='cityState'>
            <Input
              id='cityState'
              placeholder='Grand Rapids, MI'
              autoComplete='off'
              value={cityStateAddress}
              onChange={(e) => setCityStateAddress(e.target.value)}
            />
          </Field>

          <Field label='Website' htmlFor='website'>
            <Input
              id='website'
              type='url'
              placeholder='https://example.com'
              autoComplete='off'
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </Field>

          <Field label='Notes' htmlFor='notes'>
            <Textarea
              id='notes'
              placeholder='Tasting notes, what you tried, how it was...'
              autoComplete='off'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Button
            type='submit'
            variant='formAction'
            disabled={isSubmitting}
            className='mt-2 w-full'>
            {isSubmitting ? 'Saving...' : 'Add Entry'}
          </Button>
        </form>
      </div>
    </div>
  );
}

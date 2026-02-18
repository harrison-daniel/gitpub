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

export default function EditEntryForm({
  id,
  title,
  streetAddress,
  cityStateAddress,
  description,
  date,
  websiteUrl,
  phoneNumber,
}) {
  const [newTitle, setNewTitle] = useState(title ?? '');
  const [newDescription, setNewDescription] = useState(description ?? '');
  const [newStreetAddress, setNewStreetAddress] = useState(streetAddress ?? '');
  const [newCityStateAddress, setNewCityStateAddress] = useState(
    cityStateAddress ?? '',
  );
  const [newDate, setNewDate] = useState(date ? new Date(date) : null);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState(websiteUrl ?? '');
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber ?? '');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleDateSelection = (selected) => {
    setNewDate(selected);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newTitle,
          newStreetAddress,
          newCityStateAddress,
          newDescription,
          newDate: newDate ?? null,
          newWebsiteUrl,
          newPhoneNumber,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update entry');
      }
      toast('Entry updated!', { position: 'bottom-right' });
      router.push('/');
      router.refresh();
    } catch {
      toast('Failed to update entry. Please try again.', {
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
        Edit Entry
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
                    !newDate && 'text-muted-foreground',
                  )}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {newDate ? format(newDate, 'MM/dd/yyyy') : 'Pick a date'}
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

            {newDate && (
              <button
                type='button'
                onClick={() => setNewDate(null)}
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
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Field>

          <Field label='Phone' htmlFor='phone'>
            <Input
              id='phone'
              type='tel'
              placeholder='(555) 555-5555'
              autoComplete='off'
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
            />
          </Field>

          <Field label='Street Address' htmlFor='street'>
            <Input
              id='street'
              placeholder='123 Main St'
              autoComplete='off'
              value={newStreetAddress}
              onChange={(e) => setNewStreetAddress(e.target.value)}
            />
          </Field>

          <Field label='City / State' htmlFor='cityState'>
            <Input
              id='cityState'
              placeholder='Grand Rapids, MI'
              autoComplete='off'
              value={newCityStateAddress}
              onChange={(e) => setNewCityStateAddress(e.target.value)}
            />
          </Field>

          <Field label='Website' htmlFor='website'>
            <Input
              id='website'
              type='url'
              placeholder='https://example.com'
              autoComplete='off'
              value={newWebsiteUrl}
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
            />
          </Field>

          <Field label='Notes' htmlFor='notes'>
            <Textarea
              id='notes'
              placeholder='Tasting notes, what you tried, how it was...'
              autoComplete='off'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Field>

          <Button
            type='submit'
            variant='formAction'
            disabled={isSubmitting}
            className='mt-2 w-full'>
            {isSubmitting ? 'Saving...' : 'Update Entry'}
          </Button>
        </form>
      </div>
    </div>
  );
}

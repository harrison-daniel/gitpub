'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn, formatPhoneInput, isValidUrl, normalizeUrl } from '../lib/utils';
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

export default function EntryForm({
  mode = 'add',
  id,
  initialValues = {},
  isModal = false,
  onSuccess,
  onDirtyChange,
}) {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const initDescription =
    initialValues.description === 'Edit entry to add notes'
      ? ''
      : (initialValues.description ?? '');
  const [description, setDescription] = useState(initDescription);
  const [streetAddress, setStreetAddress] = useState(
    initialValues.streetAddress ?? '',
  );
  const [cityStateAddress, setCityStateAddress] = useState(
    initialValues.cityStateAddress ?? '',
  );
  const [date, setDate] = useState(
    initialValues.date ? new Date(initialValues.date) : (mode === 'add' ? new Date() : null),
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    initialValues.websiteUrl ?? '',
  );
  const [phoneNumber, setPhoneNumber] = useState(
    initialValues.phoneNumber ?? '',
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Refs for field-to-field keyboard navigation
  const titleRef = useRef(null);
  const phoneRef = useRef(null);
  const streetRef = useRef(null);
  const cityStateRef = useRef(null);
  const websiteRef = useRef(null);
  const notesRef = useRef(null);

  const fieldRefs = [titleRef, phoneRef, streetRef, cityStateRef, websiteRef, notesRef];

  const handleInputKeyDown = useCallback((e, currentIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextRef = fieldRefs[currentIndex + 1];
      nextRef?.current?.focus();
    }
  }, []);

  const handleFieldFocus = useCallback((e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 300);
  }, []);

  // Auto-expand textarea on mount if pre-filled
  useEffect(() => {
    const el = notesRef.current;
    if (el && description) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  // Track dirty state for unsaved changes detection
  const isDirty =
    title !== (initialValues.title ?? '') ||
    description !== initDescription ||
    streetAddress !== (initialValues.streetAddress ?? '') ||
    cityStateAddress !== (initialValues.cityStateAddress ?? '') ||
    websiteUrl !== (initialValues.websiteUrl ?? '') ||
    phoneNumber !== (initialValues.phoneNumber ?? '');

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const isEdit = mode === 'edit';

  const handleDateSelection = (selected) => {
    setDate(selected);
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast('Brewery or entry name is required.', {
        style: { background: 'red' },
        position: 'bottom-right',
      });
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      toast('Website doesn\u2019t look like a valid URL (e.g. beer.com).', {
        style: { background: 'red' },
        position: 'bottom-right',
      });
      websiteRef.current?.focus();
      return;
    }

    const normalizedUrl = normalizeUrl(websiteUrl);

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        streetAddress,
        cityStateAddress,
        description,
        date: date ?? null,
        websiteUrl: normalizedUrl,
        phoneNumber,
      };

      const res = await fetch(
        isEdit ? `/api/entries/${id}` : '/api/entries',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        const data = await res.json();
        toast(isEdit ? 'Entry updated!' : 'Entry saved!', {
          position: 'bottom-right',
        });
        if (onSuccess) {
          onSuccess(data);
        } else {
          router.push('/');
          router.refresh();
        }
      } else {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} entry`);
      }
    } catch {
      toast(`Failed to ${isEdit ? 'update' : 'save'} entry. Please try again.`, {
        style: { background: 'red' },
        position: 'bottom-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
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
              ref={titleRef}
              id='title'
              placeholder="e.g. Bell's Brewery"
              autoComplete='off'
              enterKeyHint='next'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => handleInputKeyDown(e, 0)}
              onFocus={handleFieldFocus}
            />
          </Field>

          <Field label='Phone' htmlFor='phone'>
            <Input
              ref={phoneRef}
              id='phone'
              type='tel'
              inputMode='numeric'
              placeholder='(555) 555-5555'
              autoComplete='off'
              enterKeyHint='next'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneInput(e.target.value))}
              onKeyDown={(e) => handleInputKeyDown(e, 1)}
              onFocus={handleFieldFocus}
            />
          </Field>

          <Field label='Street Address' htmlFor='street'>
            <Input
              ref={streetRef}
              id='street'
              placeholder='123 Main St'
              autoComplete='off'
              enterKeyHint='next'
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              onKeyDown={(e) => handleInputKeyDown(e, 2)}
              onFocus={handleFieldFocus}
            />
          </Field>

          <Field label='City / State' htmlFor='cityState'>
            <Input
              ref={cityStateRef}
              id='cityState'
              placeholder='Grand Rapids, MI'
              autoComplete='off'
              enterKeyHint='next'
              value={cityStateAddress}
              onChange={(e) => setCityStateAddress(e.target.value)}
              onKeyDown={(e) => handleInputKeyDown(e, 3)}
              onFocus={handleFieldFocus}
            />
          </Field>

          <Field label='Website' htmlFor='website'>
            <Input
              ref={websiteRef}
              id='website'
              placeholder='example.com'
              autoComplete='off'
              enterKeyHint='next'
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onKeyDown={(e) => handleInputKeyDown(e, 4)}
              onFocus={handleFieldFocus}
            />
          </Field>

          <Field label='Notes' htmlFor='notes'>
            <Textarea
              ref={notesRef}
              id='notes'
              rows={3}
              className='resize-none'
              placeholder='Tasting notes, what you tried, how it was...'
              autoComplete='off'
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onFocus={handleFieldFocus}
            />
          </Field>

          <Button
            type='submit'
            variant='formAction'
            disabled={isSubmitting}
            className='mt-2 w-full'>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Entry' : 'Add Entry'}
          </Button>
    </form>
  );

  if (isModal) return formContent;

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
        {isEdit ? 'Edit Entry' : 'Add Entry'}
      </h1>
      <div className='rounded-2xl border border-amber-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/80'>
        {formContent}
      </div>
    </div>
  );
}

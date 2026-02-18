'use client';

import { useSession, signIn } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import StateComboBox from './StateComboBox';
import CityComboBox from '../components/CityComboBox';
import { Button } from '../components/ui/button';
import { Search, RotateCcw, Link2, Phone, Check, Loader2 } from 'lucide-react';
import useUserEntries from '../lib/useUserEntries';
import { toast } from 'sonner';
import { formatPhoneNumber } from '../lib/utils';

const BREWERY_TYPE_META = {
  micro: { label: 'Micro', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  nano: { label: 'Nano', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
  brewpub: { label: 'Brewpub', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  large: { label: 'Large', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  regional: { label: 'Regional', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  bar: { label: 'Bar', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  planning: { label: 'Planning', className: 'bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-gray-400' },
  taproom: { label: 'Taproom', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
  contract: { label: 'Contract', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  proprietor: { label: 'Proprietor', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  closed: { label: 'Closed', className: 'bg-red-200 text-red-700 line-through dark:bg-red-900/40 dark:text-red-400' },
};

function BreweryCard({ brewery, session, addingBreweryId, onAdd }) {
  const typeMeta = BREWERY_TYPE_META[brewery.brewery_type] ?? null;
  const isAdding = addingBreweryId === brewery.id;

  return (
    <div className='overflow-hidden rounded-xl border border-white/20 bg-white/90 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-800/90'>
      <div className='flex'>
        {/* Left accent bar — amber for open, red for closed */}
        <div className={`w-1 flex-shrink-0 ${brewery.brewery_type === 'closed' ? 'bg-red-500' : 'bg-amber-500'}`} />

        <div className='flex-1 px-3 py-3'>
          {/* Name row + badge */}
          <div className='mb-1 flex flex-wrap items-start gap-2'>
            <h3 className='flex-1 text-base font-extrabold leading-snug text-stone-900 dark:text-[#d5cea3]'>
              {brewery.name}
            </h3>
            {typeMeta && (
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-semibold ${typeMeta.className}`}>
                {typeMeta.label}
              </span>
            )}
          </div>

          {/* Address */}
          {brewery.address_1 && (
            <p className='font-mono text-xs text-stone-500 dark:text-gray-400'>
              {brewery.address_1}
            </p>
          )}

          {/* Contact row */}
          {(brewery.phone || brewery.website_url) && (
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              {brewery.phone && (
                <a
                  href={`tel:${brewery.phone.replace(/\D/g, '')}`}
                  className='flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                  <Phone className='h-3 w-3' />
                  {formatPhoneNumber(brewery.phone)}
                </a>
              )}
              {brewery.website_url && (
                <a
                  href={
                    brewery.website_url.startsWith('http')
                      ? brewery.website_url
                      : `http://${brewery.website_url}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-xs text-blue-600 visited:text-purple-600 hover:text-blue-800 dark:text-blue-400'>
                  <Link2 className='h-3 w-3' />
                  Website
                </a>
              )}
            </div>
          )}

          {/* Action */}
          <div className='mt-3 flex justify-end'>
            {session ? (
              <Button
                size='sm'
                disabled={isAdding}
                className='rounded-lg bg-amber-700 px-4 text-xs font-semibold text-amber-100 shadow hover:bg-amber-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200 dark:hover:text-black'
                onClick={() => onAdd(brewery)}>
                {isAdding ? (
                  <>
                    <Loader2 className='mr-1.5 h-3 w-3 animate-spin' />
                    Adding...
                  </>
                ) : (
                  'Add to Journal'
                )}
              </Button>
            ) : (
              <Button
                size='sm'
                variant='outline'
                className='rounded-lg border-amber-700 px-4 text-xs font-semibold text-amber-900 hover:bg-amber-100 dark:border-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-700'
                onClick={() => signIn()}>
                Sign in to save
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrewerySearch() {
  const { data: session } = useSession();
  const { mutate } = useUserEntries();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [breweries, setBreweries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoadingBreweries, setIsLoadingBreweries] = useState(false);
  const [addingBreweryId, setAddingBreweryId] = useState(null);
  const [stateComboOpen, setStateComboOpen] = useState(false);

  // Cache breweries per state in sessionStorage (survives page reload, resets on tab close)
  const breweryCacheRef = useRef({});

  // Listen for the 'open-state-search' event dispatched by the Navbar Search button
  useEffect(() => {
    const handleOpenSearch = () => {
      document
        .getElementById('brewery-search')
        ?.scrollIntoView({ behavior: 'smooth' });
      setStateComboOpen(true);
    };
    window.addEventListener('open-state-search', handleOpenSearch);
    return () =>
      window.removeEventListener('open-state-search', handleOpenSearch);
  }, []);

  useEffect(() => {
    if (!state) {
      setCities([]);
      setBreweries([]);
      return;
    }

    const sessionKey = `breweries_${state}`;

    // 1. Check in-memory cache (fastest — same component mount)
    if (breweryCacheRef.current[state]) {
      const cached = breweryCacheRef.current[state];
      setBreweries(cached);
      setCities([...new Set(cached.map((b) => b.city))].sort());
      return;
    }

    // 2. Check sessionStorage (survives page reload within the same tab)
    try {
      const stored = sessionStorage.getItem(sessionKey);
      if (stored) {
        const cached = JSON.parse(stored);
        breweryCacheRef.current[state] = cached;
        setBreweries(cached);
        setCities([...new Set(cached.map((b) => b.city))].sort());
        return;
      }
    } catch {
      // sessionStorage unavailable (SSR guard) — fall through to fetch
    }

    const fetchBreweries = async () => {
      setIsLoadingBreweries(true);
      let page = 1;
      let fetchedBreweries = [];

      try {
        while (true) {
          const response = await fetch(
            `https://api.openbrewerydb.org/v1/breweries?by_state=${state}&page=${page}&per_page=200`,
          );
          const data = await response.json();
          if (data.length === 0) break;
          fetchedBreweries = [...fetchedBreweries, ...data];
          page++;
        }

        breweryCacheRef.current[state] = fetchedBreweries;
        try {
          sessionStorage.setItem(sessionKey, JSON.stringify(fetchedBreweries));
        } catch {
          // sessionStorage full or unavailable — in-memory cache still works
        }
        setBreweries(fetchedBreweries);
        setCities([...new Set(fetchedBreweries.map((b) => b.city))].sort());
      } catch {
        toast('Failed to load breweries. Please try again.', {
          style: { background: 'red' },
          position: 'bottom-right',
        });
      } finally {
        setIsLoadingBreweries(false);
      }
    };

    fetchBreweries();
  }, [state]);

  useEffect(() => {
    setCity('');
  }, [state]);

  const handleCityFilter = () => {
    const matchingBreweries = breweries.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase(),
    );
    setFilteredBreweries(matchingBreweries);
    setOpen(true);
  };

  const handleClearSearch = () => {
    setState('');
    setCity('');
  };

  const capitalizeState = (stateStr) =>
    stateStr
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  async function handleAddBrewery(brewery) {
    setAddingBreweryId(brewery.id);

    const entryData = {
      title: brewery.name,
      streetAddress: brewery.address_1,
      cityStateAddress: `${brewery.city}, ${brewery.state}`,
      description: 'Edit entry to add notes',
      date: new Date().toISOString(),
      websiteUrl: brewery.website_url,
      phoneNumber: brewery.phone,
    };

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(entryData),
      });

      if (res.ok) {
        const { entry: newEntry } = await res.json();
        await mutate((currentData) => {
          return {
            ...currentData,
            userEntries: [...(currentData?.userEntries ?? []), newEntry],
          };
        }, false);

        toast(`${brewery.name} Added!`, {
          icon: <Check />,
          style: { background: 'green' },
          position: 'bottom-right',
        });
      } else {
        throw new Error('Failed to create entry');
      }
    } catch (error) {
      toast('Failed to add brewery. Please try again.', {
        style: { background: 'red' },
        position: 'bottom-right',
      });
    } finally {
      setAddingBreweryId(null);
    }
  }

  return (
    <>
      <div id='brewery-search' className='mx-12 mb-12 mt-3 flex flex-col lg:mt-5'>
        <h1 className='search-header mb-1 flex justify-center text-center text-2xl font-extrabold lg:text-4xl'>
          Find Your Next Brewery
        </h1>
        <div className='m-2 flex flex-col items-center gap-0.5'>
          <StateComboBox
            onStateSelect={(selectedState) => setState(selectedState)}
            value={state}
            externalOpen={stateComboOpen}
            onExternalOpenChange={setStateComboOpen}
          />

          {state &&
            (isLoadingBreweries ? (
              <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                <Loader2 className='h-4 w-4 animate-spin text-amber-600' />
                <span>Finding breweries...</span>
              </div>
            ) : (
              <CityComboBox
                cities={cities}
                onCitySelect={(selectedCity) => setCity(selectedCity)}
                value={city}
              />
            ))}
        </div>
        {city && !isLoadingBreweries && (
          <div className='flex flex-row items-center justify-center gap-6'>
            <Button
              className='bg-amber-700 text-white hover:bg-amber-600 dark:bg-slate-950 dark:text-yellow-100'
              onClick={handleCityFilter}>
              <Search className='mr-2 h-4 w-4' />
              Search
            </Button>

            <RotateCcw
              size={24}
              onClick={handleClearSearch}
              title='Clear Search'
              className='cursor-pointer text-red-600 hover:text-red-400 dark:text-red-600 dark:hover:text-red-400'
            />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay>
            <DialogContent className='max-h-[86vh] overflow-hidden p-2 dark:bg-slate-950'>
              <DialogHeader>
                <DialogTitle>
                  <div className='text-center font-semibold text-white'>
                    <h1>Breweries in:</h1>
                    <div className='text-center text-lg font-bold'>
                      {city}, {capitalizeState(state.replace(/_/g, ' '))}
                    </div>
                    <div className='mt-0.5 text-xs font-normal text-amber-200'>
                      {filteredBreweries.length}{' '}
                      {filteredBreweries.length === 1
                        ? 'brewery'
                        : 'breweries'}{' '}
                      found
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className='max-h-[74vh]'>
                <div className='flex flex-col gap-3 p-3'>
                  {filteredBreweries.map((brewery) => (
                    <BreweryCard
                      key={brewery.id}
                      brewery={brewery}
                      session={session}
                      addingBreweryId={addingBreweryId}
                      onAdd={handleAddBrewery}
                    />
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}

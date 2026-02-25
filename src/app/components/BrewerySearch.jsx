'use client';

import { useSession, signIn } from 'next-auth/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
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
  micro: {
    label: 'Micro',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  nano: {
    label: 'Nano',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
  brewpub: {
    label: 'Brewpub',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  },
  large: {
    label: 'Large',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  regional: {
    label: 'Regional',
    className:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
  bar: {
    label: 'Bar',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
  planning: {
    label: 'Planning',
    className:
      'bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-gray-400',
  },
  taproom: {
    label: 'Taproom',
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  },
  contract: {
    label: 'Contract',
    className:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  },
  proprietor: {
    label: 'Proprietor',
    className:
      'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  },
  closed: {
    label: 'Closed',
    className:
      'bg-red-200 text-red-700 line-through dark:bg-red-900/40 dark:text-red-400',
  },
};

function BreweryCard({ brewery, session, addingBreweryId, onAdd }) {
  const typeMeta = BREWERY_TYPE_META[brewery.brewery_type] ?? null;
  const isAdding = addingBreweryId === brewery.id;

  return (
    <div className='overflow-hidden rounded-xl border border-stone-200 bg-white shadow dark:border-neutral-700/60 dark:bg-neutral-800/90'>
      <div className='flex'>
        <div
          className={`w-1 flex-shrink-0 ${
            brewery.brewery_type === 'closed' ? 'bg-red-500' : 'bg-amber-500'
          }`}
        />

        <div className='flex-1 px-3 py-3'>
          <div className='mb-1 flex flex-wrap items-start gap-2'>
            <h3 className='flex-1 text-base font-extrabold leading-snug text-stone-900 dark:text-[#d5cea3]'>
              {brewery.name}
            </h3>
            {typeMeta && (
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-semibold ${typeMeta.className}`}>
                {typeMeta.label}
              </span>
            )}
          </div>

          {/* Address */}
          {brewery.address_1 && (
            <p className='font-mono text-xs text-stone-600 dark:text-gray-400'>
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

          <div className='mt-3 flex justify-end'>
            {session ? (
              <Button
                size='sm'
                disabled={isAdding}
                className='rounded-lg bg-amber-700 px-4 text-xs font-semibold text-amber-100 shadow hover:bg-amber-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200 dark:hover:text-black'
                onClick={(e) => {
                  e.currentTarget.blur();
                  onAdd(brewery);
                }}>
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
  const [dialogSearch, setDialogSearch] = useState('');

  // Cache breweries per state in sessionStorage (survives page reload, resets on tab close)
  const breweryCacheRef = useRef({});

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

    // 1. Check in-memory cache
    if (breweryCacheRef.current[state]) {
      const cached = breweryCacheRef.current[state];
      setBreweries(cached);
      setCities([...new Set(cached.map((b) => b.city))].sort());
      return;
    }

    try {
      const stored = sessionStorage.getItem(sessionKey);
      if (stored) {
        const cached = JSON.parse(stored);
        breweryCacheRef.current[state] = cached;
        setBreweries(cached);
        setCities([...new Set(cached.map((b) => b.city))].sort());
        return;
      }
    } catch {}

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
        } catch {}
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
    setDialogSearch('');
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

  const visibleBreweries = useMemo(() => {
    if (!dialogSearch.trim()) return filteredBreweries;
    const q = dialogSearch.toLowerCase();
    return filteredBreweries.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.brewery_type?.toLowerCase().includes(q) ||
        b.address_1?.toLowerCase().includes(q),
    );
  }, [filteredBreweries, dialogSearch]);

  async function handleAddBrewery(brewery) {
    setAddingBreweryId(brewery.id);

    const entryData = {
      title: brewery.name,
      streetAddress: brewery.address_1 ?? '',
      cityStateAddress: `${brewery.city}, ${brewery.state}`,
      description: '',
      date: new Date().toISOString(),
      websiteUrl: brewery.website_url ?? '',
      phoneNumber: brewery.phone ?? '',
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
      document.activeElement?.blur();
    }
  }

  return (
    <>
      <div
        id='brewery-search'
        className='mx-12 mb-12 mt-3 flex flex-col lg:mt-5'>
        <h1 className='search-header mb-1 flex justify-center text-center text-2xl font-extrabold lg:text-4xl'>
          Find Your Next Brewery
        </h1>
        {!session && (
          <p className='mx-auto mb-2 w-fit rounded-full bg-white/50 px-3 py-0.5 text-center text-sm font-medium text-stone-700 backdrop-blur-sm dark:bg-black/40 dark:text-stone-200'>
            Sign in to save your discoveries
          </p>
        )}
        <div className='m-2 flex flex-col items-center'>
          <StateComboBox
            onStateSelect={(selectedState) => setState(selectedState)}
            value={state}
            externalOpen={stateComboOpen}
            onExternalOpenChange={setStateComboOpen}
          />

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              state ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className='pt-1.5'>
              {isLoadingBreweries ? (
                <div className='flex h-10 items-center gap-2 text-sm text-muted-foreground'>
                  <Loader2 className='h-4 w-4 animate-spin text-amber-600' />
                  <span>Finding breweries...</span>
                </div>
              ) : (
                <CityComboBox
                  cities={cities}
                  onCitySelect={(selectedCity) => setCity(selectedCity)}
                  value={city}
                />
              )}
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              city && !isLoadingBreweries
                ? 'max-h-16 opacity-100'
                : 'max-h-0 opacity-0'
            }`}>
            <div className='flex flex-row items-center justify-center gap-6 pt-2.5'>
              <Button
                className='bg-amber-700 text-white hover:bg-amber-600 dark:bg-slate-950 dark:text-yellow-100'
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleCityFilter();
                }}>
                <Search className='mr-2 h-4 w-4' />
                Search
              </Button>
              <RotateCcw
                size={22}
                onClick={handleClearSearch}
                title='Clear Search'
                className='cursor-pointer text-red-600 transition-transform active:scale-[0.85] active:rotate-[-45deg] hover:text-red-400 dark:text-red-600 dark:hover:text-red-400'
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setDialogSearch('');
            document.activeElement?.blur();
          }
        }}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className='max-h-[78vh] overflow-hidden bg-white p-0 dark:bg-zinc-950'>
          <DialogHeader className='rounded-t-lg bg-amber-700 px-4 py-3 dark:bg-zinc-800'>
            <DialogTitle>
              <div className='text-center'>
                <p className='text-sm font-semibold text-amber-100 dark:text-amber-200'>
                  Breweries in:
                </p>
                <p className='text-lg font-bold text-white'>
                  {city}, {capitalizeState(state.replace(/_/g, ' '))}
                </p>
                <p className='mt-0.5 text-xs font-normal text-amber-200'>
                  {visibleBreweries.length}{' '}
                  {visibleBreweries.length === 1 ? 'brewery' : 'breweries'}{' '}
                  {dialogSearch ? 'matching' : 'found'}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Search within results */}
          {filteredBreweries.length > 3 && (
            <div className='px-3 pt-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Filter results...'
                  value={dialogSearch}
                  onChange={(e) => setDialogSearch(e.target.value)}
                  className='w-full rounded-lg border border-stone-200 bg-stone-50 py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-amber-600'
                />
              </div>
            </div>
          )}

          <ScrollArea className='max-h-[60vh]'>
            <div key={dialogSearch} className='flex flex-col gap-2.5 px-3 pb-6 pt-3'>
              {visibleBreweries.length === 0 && dialogSearch ? (
                <p className='py-6 text-center text-sm text-muted-foreground'>
                  No breweries match &ldquo;{dialogSearch}&rdquo;
                </p>
              ) : (
                visibleBreweries.map((brewery, index) => (
                  <motion.div
                    key={brewery.id}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                      delay: Math.min(index * 0.05, 0.4),
                    }}
                  >
                    <BreweryCard
                      brewery={brewery}
                      session={session}
                      addingBreweryId={addingBreweryId}
                      onAdd={handleAddBrewery}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

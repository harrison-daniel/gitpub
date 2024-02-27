'use client';

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import StateComboBox from './StateComboBox';
import CityComboBox from '../components/CityComboBox';
import { Button } from '../components/ui/button';
import { Search, X, RotateCcw } from 'lucide-react';
import useUserEntries from '../lib/useUserEntries';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BrewerySearch() {
  const { data: session } = useSession();
  const { data: userEntries, mutate } = useUserEntries();
  const router = useRouter();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [breweries, setBreweries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [open, setOpen] = useState(false);

  const [breweryEntry, setBreweryEntry] = useState({
    title: '',
    streetAddress: '',
    cityStateAddress: '',
    description: 'Edit entry to add notes',
    date: new Date(),
    websiteUrl: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!state) {
      setCities([]);
      setBreweries([]);
      return;
    }

    const fetchBreweries = async () => {
      let page = 1;
      let fetchedBreweries = [];

      while (true) {
        const response = await fetch(
          `https://api.openbrewerydb.org/breweries?by_state=${state}&page=${page}&per_page=200`,
        );
        console.log('fetching breweries');
        const data = await response.json();
        // console.log('fetching breweries');
        if (data.length === 0) break;

        fetchedBreweries = [...fetchedBreweries, ...data];
        page++;
      }

      setBreweries(fetchedBreweries);
      setCities([...new Set(fetchedBreweries.map((b) => b.city))].sort());
    };

    fetchBreweries();
  }, [state]);

  const handleCityFilter = () => {
    const matchingUniqueCities = breweries.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase(),
    );

    setFilteredBreweries(matchingUniqueCities);
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

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return 'N/A';
    }

    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length === 10) {
      return `(${digits.substring(0, 3)}) ${digits.substring(
        3,
        6,
      )}-${digits.substring(6)}`;
    }

    return phoneNumber;
  }

  async function addBreweryInfoToEntry(brewery) {
    setBreweryEntry({
      title: brewery.name,
      streetAddress: brewery.street,
      cityStateAddress: `${brewery.city}, ${brewery.state}`,
      description: 'Edit entry to add notes',
      date: new Date().toISOString(),
      websiteUrl: brewery.website_url,
      phoneNumber: brewery.phone,
    });

    toast(`${brewery.name}  Added!`, {
      style: {
        background: 'green',
      },

      position: 'bottom-right',
    });
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    const entryData = {
      title: breweryEntry.title,
      streetAddress: breweryEntry.streetAddress,
      cityStateAddress: breweryEntry.cityStateAddress,
      description: breweryEntry.description,
      date: breweryEntry.date,
      websiteUrl: breweryEntry.websiteUrl,
      phoneNumber: breweryEntry.phoneNumber,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries`,
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(entryData),
        },
      );

      if (res.ok) {
        const newEntry = await res.json();
        await mutate((currentData) => {
          const updatedEntries = currentData.entries
            ? [...currentData.entries, newEntry]
            : [newEntry];
          return { ...currentData, entries: updatedEntries };
        }, true); // false to not revalidate immediately

        console.log('Entry added successfully');
        // setOpen(false);
      } else {
        throw new Error('Failed to create an entry');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCity('');
  }, [state]);

  return (
    <>
      <div className=' mx-12 mb-12  mt-3 flex flex-col lg:mt-5 '>
        <h1 className='search-header  mb-1 flex  justify-center text-center text-2xl font-extrabold   lg:text-4xl '>
          Find Your Next Brewery <br />
        </h1>
        <div className='m-2 flex flex-col items-center gap-0.5'>
          {/* OLD COMBOBOXES */}
          {/* <StateComboBox
            onStateSelect={(selectedState) => setState(selectedState)}
            value={state}
          />

          {state && (
            <CityComboBox
              cities={cities}
              onCitySelect={(selectedCity) => setCity(selectedCity)}
              value={city}
            />
          )} */}

          {/* <NewestComboBox /> */}
          <StateComboBox
            onStateSelect={(selectedState) => setState(selectedState)}
            value={state}
          />

          {state && (
            <CityComboBox
              cities={cities}
              onCitySelect={(selectedCity) => setCity(selectedCity)}
              value={city}
            />
          )}
        </div>
        {city && (
          <div className='flex flex-row items-center justify-center gap-6'>
            <Button
              className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-slate-950 dark:text-yellow-100'
              onClick={handleCityFilter}>
              <Search className='mr-2 h-4 w-4' />
              Search
            </Button>

            <RotateCcw
              size={24}
              onClick={handleClearSearch}
              title='Clear Search'
              className='cursor-pointer   text-red-600 hover:text-red-400 dark:text-red-600 dark:hover:text-red-400 '
            />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal className>
          <DialogOverlay>
            <DialogContent className='max-h-[86vh] overflow-hidden bg-gray-900 p-2 dark:bg-slate-950'>
              <DialogHeader>
                <DialogTitle>
                  <div className='text-center  font-semibold text-white '>
                    <h1>Breweries in:</h1>

                    <div className=' text-center text-lg font-bold'>
                      {city}, {capitalizeState(state.replace(/_/g, ' '))}
                    </div>
                    {session?.user ? (
                      <></>
                    ) : (
                      <div className='mt-2 text-xs italic text-white'>
                        Sign into an account to save Entries
                      </div>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className='h-[74vh] '>
                {filteredBreweries.map((brewery) => (
                  <form
                    key={brewery.id}
                    type='submit'
                    className=' '
                    onSubmit={handleModalSubmit}>
                    <div
                      className='m-4 rounded-lg bg-amber-400 p-2 shadow-2xl dark:bg-neutral-800  '
                      key={brewery.id}>
                      <div className='text-lg font-bold dark:bg-neutral-800 dark:text-yellow-100'>
                        {brewery.name}
                      </div>
                      <div>
                        <div>{`${brewery.address_1}`}</div>
                        <div>
                          <div
                            href={`tel:${
                              brewery.phone
                                ? brewery.phone.replace(/\D/g, '')
                                : ''
                            }`}
                            className=' cursor-pointer font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                            {brewery.phone
                              ? formatPhoneNumber(brewery.phone)
                              : ''}
                          </div>

                          {brewery.website_url && (
                            <div>
                              <a
                                href={
                                  brewery.website_url.startsWith('http')
                                    ? brewery.website_url
                                    : `http://${brewery.website_url}`
                                }
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex w-24 flex-row items-center gap-2 py-1  text-blue-600 visited:text-purple-600 hover:text-blue-800'>
                                <Link2 />
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className=' flex justify-center '>
                        {session ? (
                          <div>
                            <Button
                              color='primary'
                              size='sm'
                              className='m-2 rounded-lg bg-amber-700 px-4  font-semibold text-amber-100  shadow hover:bg-amber-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200 dark:hover:text-black'
                              onClick={(e) => {
                                addBreweryInfoToEntry(brewery);
                              }}>
                              Add Brewery to Entries
                            </Button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </form>
                ))}
              </ScrollArea>
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}

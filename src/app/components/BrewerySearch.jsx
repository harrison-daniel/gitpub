'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import StateComboBox from './StateComboBox';
import CityComboBox from '../components/CityComboBox';
import { Button } from '../components/ui/button';
import { Search, X, RotateCcw } from 'lucide-react';

export default function BrewerySearch() {
  const router = useRouter();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [breweries, setBreweries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  // const [title, setTitle] = useState('');
  // const [address, setAddress] = useState('');
  // const [streetAddress, setStreetAddress] = useState('');
  // const [cityStateAddress, setCityStateAddress] = useState('');
  // const [description, setDescription] = useState('');
  // const [date, setDate] = useState(new Date());
  // const [websiteUrl, setWebsiteUrl] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior] = React.useState('inside');

  const [breweryEntry, setBreweryEntry] = useState({
    title: '',
    address: '',
    streetAddress: '',
    cityStateAddress: '',
    description: 'Edit entry to add notes',
    date: new Date(),
    websiteUrl: '',
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
        const data = await response.json();

        if (data.length === 0) break;

        fetchedBreweries = [...fetchedBreweries, ...data];
        page++;
      }

      setBreweries(fetchedBreweries);
      setCities([...new Set(fetchedBreweries.map((b) => b.city))]);
    };

    fetchBreweries();
  }, [state]);

  const handleCityFilter = () => {
    const matchingUniqueCities = breweries.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase(),
    );

    setFilteredBreweries(matchingUniqueCities);
    onOpen();
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

  function addBreweryInfoToEntry(brewery) {
    setBreweryEntry({
      title: brewery.name, // Title is the name of the brewery
      streetAddress: brewery.street, // Street address of the brewery
      cityStateAddress: `${brewery.city}, ${brewery.state}`,
      description: 'Edit entry to add notes',
      date: new Date().toISOString(),
      websiteUrl: brewery.website_url,
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
        // Handle successful addition
        console.log('Entry added successfully');
        onOpenChange(false);
        router.refresh();
      } else {
        throw new Error('Failed to create an entry');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // When state changes, reset city
    setCity('');
  }, [state]);

  return (
    <>
      <div className=' mb-12 mt-3  flex flex-col px-2 lg:mt-5 '>
        <h1 className='search-header m-auto mb-1 flex w-96 justify-center text-center text-2xl font-extrabold   lg:text-4xl '>
          Find Your Next Brewery <br />
        </h1>

        <div className='m-2  flex   flex-col items-center gap-0.5'>
          <StateComboBox
            onStateSelect={(selectedState) => setState(selectedState)}
            value={state}
          />

          {state && (
            <>
              <CityComboBox
                cities={cities}
                onCitySelect={(selectedCity) => setCity(selectedCity)}
                value={city}
              />
            </>
          )}
        </div>
        {/* show button after city is selected */}

        <div className='mt-2 flex justify-center gap-5'>
          {city && (
            <>
              <Button
                className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-slate-950 dark:text-yellow-100'
                onClick={handleCityFilter}>
                <Search className='mr-2 h-4 w-4' />
                Search
              </Button>
              {/* <Button
                onClick={handleClearSearch}
                title='Clear Search'
                className='    text-white  hover:bg-amber-600 dark:text-red-600'> */}
              <div className='flex items-center justify-center'>
                <RotateCcw
                  size={24}
                  onClick={handleClearSearch}
                  title='Clear Search'
                  className='  cursor-pointer text-red-600 hover:text-red-400 dark:text-red-600 dark:hover:text-red-400 '></RotateCcw>
              </div>
              {/* </Button> */}
            </>
          )}
        </div>

        <div className='-col  flex gap-2'>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior={scrollBehavior}>
            <form type='submit' onSubmit={handleModalSubmit}>
              <ModalContent className='bg-amber-400 dark:bg-neutral-800  '>
                {(onClose) => (
                  <>
                    <ModalHeader className='sticky top-0 flex items-center rounded-lg bg-amber-500  py-2 text-lg font-medium leading-6 text-black shadow-xl dark:bg-neutral-800  dark:text-yellow-100'>
                      <div className='flex-grow text-center  '>
                        Breweries in: <br />
                        <b>
                          {city}, {capitalizeState(state.replace(/_/g, ' '))}
                        </b>
                      </div>
                      <div className='ml-auto pr-4'>
                        <X
                          size={30}
                          onClick={onOpenChange}
                          aria-label='Close Modal'
                          className='cursor-pointer rounded-lg text-amber-950  hover:bg-amber-700 active:bg-amber-700 dark:text-red-700 dark:hover:bg-neutral-800 dark:hover:text-red-600'
                        />
                      </div>
                    </ModalHeader>

                    <ModalBody className='px-3 dark:bg-neutral-800'>
                      <div className='text-start '>
                        {filteredBreweries.map((brewery) => (
                          <div
                            className='m-4 rounded-lg bg-amber-500 p-2 shadow-2xl  dark:bg-neutral-800'
                            key={brewery.id}>
                            <h1 className='text-lg font-bold dark:bg-neutral-800 dark:text-yellow-100'>
                              {brewery.name}
                            </h1>
                            <div>
                              {`${brewery.address_1},
                                ${brewery.city},
                                ${brewery.state}
                                ${brewery.postal_code.substring(0, 5)}`}
                            </div>

                            <div className='mt-4 flex justify-center '>
                              <button
                                color='primary'
                                className='m-4 rounded-lg bg-amber-700 px-6 py-2  font-semibold text-amber-100  shadow hover:bg-amber-500 active:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200 dark:hover:text-black'
                                onClick={(e) => {
                                  addBreweryInfoToEntry(brewery);
                                }}>
                                Add Brewery to Entries
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ModalBody>
                    {/* <ModalFooter>
                      <Button
                        type='button'
                        className='bg-red-600 text-white hover:bg-red-500'
                        onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter> */}
                  </>
                )}
              </ModalContent>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}

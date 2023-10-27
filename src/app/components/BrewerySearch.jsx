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
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior] = React.useState('inside');
  const [date, setDate] = useState(new Date());

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
    const truncatedPostalCode = brewery.postal_code.substring(0, 5);
    const breweryListAddress = `${brewery.address_1}
    ${brewery.city}, ${brewery.state} ${truncatedPostalCode}`;

    setTitle(brewery.name);
    setAddress(breweryListAddress);
    setDescription('Edit entry to add notes');
    setDate(new Date());
    router.refresh();

    // onOpenChange(false);
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries`,
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ title, address, description, date }),
        },
      );

      if (res.ok) {
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
      <div className='mt-6 flex flex-col px-2  md:mt-12 '>
        <h1 className=' mb-4 flex justify-center text-center text-2xl font-bold '>
          Find Your Next Brewery <br />
        </h1>

        <div className='flex flex-col items-center  gap-2 '>
          <StateComboBox
            onStateSelect={(selectedState) => setState(selectedState)}
            // onMenuSearchClick={{ state: 'open' }}
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
        <div className='mt-2 flex justify-center gap-2'>
          {city && (
            <>
              <Button
                className=' bg-amber-700  text-white hover:bg-amber-600'
                onClick={handleCityFilter}>
                <Search className='mr-2 h-4 w-4' />
                Search
              </Button>
              <Button
                onClick={handleClearSearch}
                title='Clear Search'
                className='   bg-amber-700  text-white hover:bg-amber-600'>
                <RotateCcw size={21} />
              </Button>
            </>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior={scrollBehavior}>
            <form type='submit' onSubmit={handleModalSubmit}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className='sticky top-0 flex items-center justify-between rounded-2xl bg-white py-4 text-lg font-medium leading-6 text-gray-900 shadow-xl'>
                      <div className='flex-grow text-center '>
                        Breweries in <br />
                        {city}, {capitalizeState(state.replace(/_/g, ' '))}
                      </div>
                      <div className='ml-auto pr-4'>
                        <X
                          size={34}
                          onClick={onOpenChange}
                          aria-label='Close Modal'
                          className=' rounded-lg hover:bg-red-700 active:bg-red-600 '
                        />
                      </div>
                    </ModalHeader>

                    <ModalBody>
                      <div className='text-center'>
                        {filteredBreweries.map((brewery) => (
                          <div
                            className=' m-4 rounded-lg bg-white p-2  shadow-2xl'
                            key={brewery.id}>
                            <h1 className='text-lg font-bold'>
                              {brewery.name}
                            </h1>
                            <div>
                              {`${brewery.address_1},
                              ${brewery.city},
                              ${brewery.state}
                              ${brewery.postal_code.substring(0, 5)}`}
                            </div>

                            <div className='mt-4 '>
                              {/* <Button
                                  color=''
                                  className='bg-amber-600 font-semibold text-white hover:bg-amber-500 active:bg-amber-600'
                                  onClick={(e) => {
                                    addBreweryInfoToEntry(brewery);
                                  }}>
                                  Add Brewery to Entries
                                </Button> */}
                              <button
                                color='primary'
                                className='m-4 rounded-xl border bg-amber-600 px-6 py-2  font-semibold text-white  shadow hover:bg-amber-500 active:bg-amber-600 '
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
                    <ModalFooter>
                      <Button
                        type='button'
                        className='bg-red-600 text-white hover:bg-red-500'
                        onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
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

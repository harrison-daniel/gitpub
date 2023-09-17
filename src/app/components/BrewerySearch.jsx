'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { CgCloseR } from 'react-icons/cg';
import { useRouter } from 'next/navigation';

export default function BrewerySearchOpt() {
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
  const [scrollBehavior, setScrollBehavior] = React.useState('outside');

  const states = [
    // { value: "", label: "Choose a State" },
    { value: 'alabama', label: 'Alabama' },
    { value: 'alaska', label: 'Alaska' },
    { value: 'arizona', label: 'Arizona' },
    { value: 'arkansas', label: 'Arkansas' },
    { value: 'california', label: 'California' },
    { value: 'colorado', label: 'Colorado' },
    { value: 'connecticut', label: 'Connecticut' },
    { value: 'delaware', label: 'Delaware' },
    { value: 'district_of_columbia', label: 'District Of Columbia' },
    { value: 'florida', label: 'Florida' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'hawaii', label: 'Hawaii' },
    { value: 'idaho', label: 'Idaho' },
    { value: 'illinois', label: 'Illinois' },
    { value: 'indiana', label: 'Indiana' },
    { value: 'iowa', label: 'Iowa' },
    { value: 'kansas', label: 'Kansas' },
    { value: 'kentucky', label: 'Kentucky' },
    { value: 'louisiana', label: 'Louisiana' },
    { value: 'maine', label: 'Maine' },
    { value: 'maryland', label: 'Maryland' },
    { value: 'massachusetts', label: 'Massachusetts' },
    { value: 'michigan', label: 'Michigan' },
    { value: 'minnesota', label: 'Minnesota' },
    { value: 'mississippi', label: 'Mississippi' },
    { value: 'missouri', label: 'Missouri' },
    { value: 'montana', label: 'Montana' },
    { value: 'nebraska', label: 'Nebraska' },
    { value: 'nevada', label: 'Nevada' },
    { value: 'new_hampshire', label: 'New Hampshire' },
    { value: 'new_jersey', label: 'New Jersey' },
    { value: 'new_mexico', label: 'New Mexico' },
    { value: 'new_york', label: 'New York' },
    { value: 'north_carolina', label: 'North Carolina' },
    { value: 'north_dakota', label: 'North Dakota' },
    { value: 'ohio', label: 'Ohio' },
    { value: 'oklahoma', label: 'Oklahoma' },
    { value: 'oregon', label: 'Oregon' },
    { value: 'pennsylvania', label: 'Pennsylvania' },
    { value: 'rhode_island', label: 'Rhode Island' },
    { value: 'south_carolina', label: 'South Carolina' },
    { value: 'south_dakota', label: 'South Dakota' },
    { value: 'tennessee', label: 'Tennessee' },
    { value: 'texas', label: 'Texas' },
    { value: 'utah', label: 'Utah' },
    { value: 'vermont', label: 'Vermont' },
    { value: 'virginia', label: 'Virginia' },
    { value: 'washington', label: 'Washington' },
    { value: 'west_virginia', label: 'West Virginia' },
    { value: 'wisconsin', label: 'Wisconsin' },
    { value: 'wyoming', label: 'Wyoming' },
  ];

  // new useEffect
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

        console.log(`USEFFECT fetchedbreweries for ${state}`, fetchedBreweries);
      }

      setBreweries(fetchedBreweries);
      setCities([...new Set(fetchedBreweries.map((b) => b.city))]);
    };

    fetchBreweries();
  }, [state]);

  const handleCityFilter = () => {
    console.log('handleCityFilter button clicked');
    console.log('citites after HandleCItyFilter clicked', cities);

    const matchingUniqueCities = breweries.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase(),
    );
    setFilteredBreweries(matchingUniqueCities);
    onOpen();
  };

  const capitalizeState = (stateStr) =>
    stateStr
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  function addBreweryInfoToEntry(brewery) {
    console.log('addBreweryInfoToEntry clicked');
    const truncatedPostalCode = brewery.postal_code.substring(0, 5);
    const breweryListAddress = `${brewery.address_1}
    ${brewery.city}, ${brewery.state} ${truncatedPostalCode}`;

    setTitle(brewery.name);
    setAddress(breweryListAddress);
    setDescription('Edit entry to add notes');
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!title || !address || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      const res = await fetch('https://gitpub.vercel.app/api/entries', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, address, description }),
      });
      // const res = await fetch('http://localhost:3000/api/entries', {
      //   method: 'POST',
      //   headers: { 'Content-type': 'application/json' },
      //   body: JSON.stringify({ title, address, description }),
      // });

      if (res.ok) {
        router.refresh();
        onOpenChange(false);
        router.push('/');
      } else {
        throw new Error('Failed to create an entry');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=' mx-auto max-w-3xl  px-4'>
        <div className='pt-4'>
          {/* {error && (
              <p className="text-md flex justify-center font-semibold italic text-red-500">
                {error}
              </p>
            )} */}

          <h1 className='pb-2 text-center text-3xl font-bold'>
            Search for a Brewery below
          </h1>
          <div className='pb-4'>
            <Select
              label='Select a State'
              className='max-w-3xl  '
              onChange={(e) => setState(e.target.value)}>
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {state && (
            <div className='pb-4'>
              <Select
                label='Select a City'
                className='max-w-3xl'
                onChange={(e) => setCity(e.target.value)}>
                {cities.sort().map((cityName) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}

          {/* show button after city is selected */}
          {city && (
            <div className='pt-2'>
              <Button
                color=''
                className='bg-amber-600 font-semibold text-white hover:bg-amber-500 active:bg-amber-600'
                onClick={handleCityFilter}>
                Search by City
              </Button>
            </div>
          )}

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
                          <CgCloseR
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
                              className=' rounded-lg bg-white p-8  shadow-2xl'
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
                                  className='m-4 rounded-xl border bg-amber-600 px-6 py-2 font-semibold font-semibold text-white text-white shadow hover:bg-amber-500 active:bg-amber-600 '
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
                          color='danger'
                          variant='light'
                          onPress={onClose}>
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
      </div>
    </>
  );
}

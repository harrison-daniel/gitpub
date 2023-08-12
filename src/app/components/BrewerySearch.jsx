'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BrewerySearch() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [breweryList, setBreweryList] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function getBreweryInfo(brewery) {
    setTitle(brewery.name);
    setDescription(brewery.street);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      const res = await fetch('https://gitpub.vercel.app/api/entries', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
        setShowModal(false);
      } else {
        throw new Error('Failed to create an entry');
      }
    } catch (error) {}
  };

  const handleSearch = async () => {
    setError(''); // clear previous error

    if (city === '' || state === '') {
      setError('Both fields are required');
      return;
    }

    // City should only contain alphabetical characters and spaces
    if (!/^[\p{L} ]+$/u.test(city)) {
      setError('City name should only contain letters and spaces');
      return;
    }

    console.log(`Searching for: City - ${city}, State - ${state}`);
    try {
      fetch(
        `https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=10`
      )
        .then((response) => response.json())
        .then((data) => {
          setBreweryList(data);
          setShowModal(true);
          console.log(data);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-4'>
      <div className='mb-3'>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='city'>
          City:
        </label>
        <input
          id='city'
          type='text'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder='Enter city'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
      </div>

      <div>
        <label
          htmlFor='SearchLocation'
          className='block text-lg font-bold text-black'>
          State
        </label>

        <select
          name='SearchLocationState'
          id='state'
          value={state}
          onChange={(e) => setState(e.target.value)}
          className='mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm'>
          <option value='AL'>Alabama</option>
          <option value='AK'>Alaska</option>
          <option value='AZ'>Arizona</option>
          <option value='AR'>Arkansas</option>
          <option value='CA'>California</option>
          <option value='CO'>Colorado</option>
          <option value='CT'>Connecticut</option>
          <option value='DE'>Delaware</option>
          <option value='DC'>District Of Columbia</option>
          <option value='FL'>Florida</option>
          <option value='GA'>Georgia</option>
          <option value='HI'>Hawaii</option>
          <option value='ID'>Idaho</option>
          <option value='IL'>Illinois</option>
          <option value='IN'>Indiana</option>
          <option value='IA'>Iowa</option>
          <option value='KS'>Kansas</option>
          <option value='KY'>Kentucky</option>
          <option value='LA'>Louisiana</option>
          <option value='ME'>Maine</option>
          <option value='MD'>Maryland</option>
          <option value='MA'>Massachusetts</option>
          <option value='MI'>Michigan</option>
          <option value='MN'>Minnesota</option>
          <option value='MS'>Mississippi</option>
          <option value='MO'>Missouri</option>
          <option value='MT'>Montana</option>
          <option value='NE'>Nebraska</option>
          <option value='NV'>Nevada</option>
          <option value='NH'>New Hampshire</option>
          <option value='NJ'>New Jersey</option>
          <option value='NM'>New Mexico</option>
          <option value='NY'>New York</option>
          <option value='NC'>North Carolina</option>
          <option value='ND'>North Dakota</option>
          <option value='OH'>Ohio</option>
          <option value='OK'>Oklahoma</option>
          <option value='OR'>Oregon</option>
          <option value='PA'>Pennsylvania</option>
          <option value='RI'>Rhode Island</option>
          <option value='SC'>South Carolina</option>
          <option value='SD'>South Dakota</option>
          <option value='TN'>Tennessee</option>
          <option value='TX'>Texas</option>
          <option value='UT'>Utah</option>
          <option value='VT'>Vermont</option>
          <option value='VA'>Virginia</option>
          <option value='WA'>Washington</option>
          <option value='WV'>West Virginia</option>
          <option value='WI'>Wisconsin</option>
          <option value='WY'>Wyoming</option>
        </select>
      </div>
      {error && <p className='text-red-500 text-xs italic'>{error}</p>}
      <button
        onClick={handleSearch}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
        Search
      </button>

      {showModal && (
        <form onSubmit={handleSubmit}>
          <div className='modal'>
            <div className='modal-content'>
              {/* Render your data here */}
              {breweryList.length > 0 && (
                <div>
                  {breweryList.map((brewery) => (
                    <div
                      className='rounded-lg bg-white p-8 shadow-2xl brewery-modal'
                      key={brewery.id}>
                      <h2 className='text-lg font-bold'>{brewery.name}</h2>

                      <p className='mt-2 text-sm text-gray-500'>
                        {brewery.street}
                      </p>

                      <div className='mt-4 flex gap-2'>
                        <button
                          type='submit'
                          onClick={(e) => getBreweryInfo(brewery)}
                          className='bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 m-4 border border-gray-400 rounded shadow'>
                          Add Brewery to Entries?
                        </button>
                        {/* WORKING -- only adds title of brewery
                        <button
                          type='submit'
                          onClick={(e) =>
                            setTitle(brewery.name) &&
                            setDescription(brewery.brewery_type)
                          }
                          value={title}
                          className='bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 m-4 border border-gray-400 rounded shadow'>
                          Add Brewery to Entries?
                        </button> */}
                        <button
                          type='button'
                          className='rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600'>
                          No, go back
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../components/Modal';

export default function BrewerySearch() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [breweryList, setBreweryList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [searchStage, setSearchStage] = useState('state');
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function AddBreweryInfoToEntry(brewery) {
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
      // const res = await fetch('https://gitpub.vercel.app/api/entries', {

      const res = await fetch('http://localhost:3000/api/entries', {
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

  const handleStateSearch = async () => {
    setError(''); // clear previous error

    // console.log(`Searching for: City - ${city}, State - ${state}`);
    console.log(`Searching for: State - ${state}`);

    try {
      const response = await fetch(
        `https://api.openbrewerydb.org/v1/breweries?by_state=${state}&per_page=200`
      );

      const data = await response.json();
      setBreweryList(data);
      console.log('initial data', data);
      setSearchStage('city');

      // setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCityFilter = () => {
    if (!city.trim()) {
      setError('Please provide a city before filtering.');
      return;
    }
    // if (city === '' || state === '') {
    //   setError('Both fields are required');
    //   return;
    // }

    // City should only contain alphabetical characters and spaces
    if (!/^[\p{L} ]+$/u.test(city)) {
      setError('City name should only contain letters and spaces');
      return;
    }

    const results = breweryList.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase()
    );
    setFilteredBreweries(results);
    setShowModal(true);
    console.log(
      'filteredBreweries on initial handlecityfilter',
      filteredBreweries
    );
  };

  useEffect(() => {
    console.log('Updated filteredBreweries', filteredBreweries);
    // When breweryList updates, filter it based on the user's city input
  }, [filteredBreweries, city.submit]);

  return (
    <div className='p-4'>
      <div>
        <label
          htmlFor='SearchState'
          className='block text-lg font-bold text-black'>
          State
        </label>

        <select
          name='SearchLocationState'
          id='state'
          value={state}
          onChange={(e) => setState(e.target.value)}
          className='mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm'>
          <option value='alabama'>Alabama</option>
          <option value='alaska'>Alaska</option>
          <option value='arizona'>Arizona</option>
          <option value='arkansas'>Arkansas</option>
          <option value='california'>California</option>
          <option value='colorado'>Colorado</option>
          <option value='connecticut'>Connecticut</option>
          <option value='delaware'>Delaware</option>
          <option value='district_of_columbia'>District Of Columbia</option>
          <option value='florida'>Florida</option>
          <option value='georgia'>Georgia</option>
          <option value='hawaii'>Hawaii</option>
          <option value='idaho'>Idaho</option>
          <option value='illinois'>Illinois</option>
          <option value='indiana'>Indiana</option>
          <option value='iowa'>Iowa</option>
          <option value='kansas'>Kansas</option>
          <option value='kentucky'>Kentucky</option>
          <option value='louisiana'>Louisiana</option>
          <option value='maine'>Maine</option>
          <option value='maryland'>Maryland</option>
          <option value='massachusetts'>Massachusetts</option>
          <option value='michigan'>Michigan</option>
          <option value='minnesota'>Minnesota</option>
          <option value='mississippi'>Mississippi</option>
          <option value='missouri'>Missouri</option>
          <option value='montana'>Montana</option>
          <option value='nebraska'>Nebraska</option>
          <option value='nevada'>Nevada</option>
          <option value='new_hampshire'>New Hampshire</option>
          <option value='new_jersey'>New Jersey</option>
          <option value='new_mexico'>New Mexico</option>
          <option value='new_york'>New York</option>
          <option value='north_carolina'>North Carolina</option>
          <option value='north_dakota'>North Dakota</option>
          <option value='ohio'>Ohio</option>
          <option value='oklahoma'>Oklahoma</option>
          <option value='oregon'>Oregon</option>
          <option value='pennsylvania'>Pennsylvania</option>
          <option value='rhode_island'>Rhode Island</option>
          <option value='south_carolina'>South Carolina</option>
          <option value='south_dakota'>South Dakota</option>
          <option value='tennessee'>Tennessee</option>
          <option value='texas'>Texas</option>
          <option value='utah'>Utah</option>
          <option value='vermont'>Vermont</option>
          <option value='virginia'>Virginia</option>
          <option value='washington'>Washington</option>
          <option value='west_virginia'>West Virginia</option>
          <option value='wisconsin'>Wisconsin</option>
          <option value='wyoming'>Wyoming</option>
        </select>
      </div>

      {error && <p className='text-red-500 text-xs italic'>{error}</p>}

      {searchStage === 'state' ? (
        <button
          onClick={handleStateSearch}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
          Search By State
        </button>
      ) : null}
      {searchStage === 'city' && (
        <>
          <div className='mb-3'>
            <label
              htmlFor='city'
              className='block text-gray-700 text-sm font-bold mb-2'>
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
          <button
            onClick={handleCityFilter}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
            Filter By City
          </button>
        </>
      )}

      {showModal && (
        <form type='submit' onSubmit={handleSubmit}>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className='text-2xl font-bold mb-4'>Modal Title</h2>
            <p className='mb-4'>
              This is modal content. You can place here any component you want!
            </p>
            {filteredBreweries.length > 0 && (
              <div>
                {filteredBreweries.map((brewery) => (
                  <div
                    className='rounded-lg bg-white p-8 shadow-2xl brewery-modal'
                    key={brewery.id}>
                    <h2 className='text-lg font-bold'>{brewery.name}</h2>

                    <p className='mt-2 text-sm text-gray-500'>
                      {brewery.street}
                    </p>

                    <div className='mt-4 flex gap-2'>
                      <button
                        onClick={(e) => AddBreweryInfoToEntry(brewery)}
                        className='bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 m-4 border border-gray-400 rounded shadow'>
                        Add Brewery to Entries?
                      </button>

                      <button
                        type='button'
                        // onClick={(e) => AddEntry(brewery)}
                        className='rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600'>
                        No, go back
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        </form>
      )}
    </div>
  );
}

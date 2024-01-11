import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
import './loading';
import { auth } from './auth';
import { headers } from 'next/headers';

async function getUserEntries (sortOption = 'date', sortDirection = 'desc') {

  try {
    // console.log('session in getUserEntries', session);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userEntries?sort=${sortOption}&direction=${sortDirection}`,
      {
        method: 'GET',
        headers: headers(),
      },
    
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching user entries:', error);
    return [];
  }
};

export default async function Home() {
  const session = await auth();
  let entries = [];
  if (session) {
    const response = await getUserEntries();
    entries = response.userEntries;
    console.log('entries', entries);
  } else {
    console.log('No session in Home component');
  }

  return (
    <>
      <BrewerySearch />
      {session ? (
        <EntryList userEntries={entries} />
      ) : (
        <div className='dark: m-auto flex w-72 justify-center text-xl font-bold text-black dark:text-white'>
          <p>
            Search for a brewery above, or create an account to save an entry
            from your favorite brewery!
          </p>
        </div>
      )}
    </>
  );
}

import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
import './loading';
import { auth } from './auth';
import getUserEntries from './lib/getUserEntries';

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

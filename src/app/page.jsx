import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
import './loading';
import { auth } from './auth';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <BrewerySearch />
      {session ? (
        <EntryList />
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

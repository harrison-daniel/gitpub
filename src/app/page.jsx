import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
import { auth } from './auth';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <BrewerySearch />
      {session ? <EntryList /> : null}
    </>
  );
}

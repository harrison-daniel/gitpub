import getAllEntries from './lib/getAllEntries';
import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
import { Analytics } from '@vercel/analytics/react';
import './loading';

export default async function Home() {
  const { entries = [] } = (await getAllEntries()) || {};

  return (
    <>
      <BrewerySearch />
      <EntryList entries={entries} />
      <Analytics />
    </>
  );
}

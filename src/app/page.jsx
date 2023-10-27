import BrewerySearch from './components/BrewerySearch';
import Background from './components/Background';
import EntryList from './components/EntryList';
import { Analytics } from '@vercel/analytics/react';
import './loading';
import getAllEntries from './lib/getAllEntries';

export default async function Home() {
  const { entries = [] } = (await getAllEntries()) || {};

  return (
    <>
      <Background />
      <BrewerySearch />
      <EntryList entries={entries} />
      <Analytics />
    </>
  );
}

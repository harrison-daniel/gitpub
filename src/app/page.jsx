import EntryList from './components/EntryList';
import BrewerySearch from './components/BrewerySearch';
import Background from './components/Background';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <div>
      <Background />
      <BrewerySearch />
      <EntryList />
      <Analytics />
    </div>
  );
}

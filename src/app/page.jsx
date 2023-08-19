import EntryList from './components/EntryList';
import BrewerySearch from './components/BrewerySearch';

import { Analytics } from '@vercel/analytics/react';
// import Image from 'next/image';
// import mug from '../../public/assets/images/mug.png';

export default function Home() {
  return (
    <>
      <BrewerySearch />
      <EntryList />
      <Analytics />
    </>
  );
}

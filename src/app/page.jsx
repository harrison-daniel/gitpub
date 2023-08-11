import EntryList from '../components/EntryList';

import BrewerySearch from '../components/BrewerySearch';

// import ZipCodeSearch from '../components/ZipCodeSearch';
// import SearchedBreweryList from '../components/SearchedBreweryList';

export default function Home() {
  return (
    <>
      <BrewerySearch />
      <div className='brewery-list'></div>
      {/* <SearchedBreweryList /> */}

      <EntryList />
    </>
  );
}

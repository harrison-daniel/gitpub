import EntryList from '../../components/EntryList';
import BrewerySearch from '../../components/BrewerySearch';

export default function Home() {
  return (
    <>
      <BrewerySearch />
      {/* <div className='brewery-list'></div> */}
      <EntryList />
    </>
  );
}

// import getAllEntries from './lib/getAllEntries';
import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
// import { Analytics } from '@vercel/analytics/react';
import './loading';
import { getServerSession } from 'next-auth/next';
import { signIn, signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]/options';
import { headers } from 'next/headers';

const getUserEntries = async (sortOption = 'date', sortDirection = 'desc') => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { entries: [] };
  }

  if (session) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries?sort=${sortOption}&direction=${sortDirection}`,
        {
          method: 'GET',
          headers: headers(),
        },
      );
      if (res.ok) {
        const userEntries = await res.json();
        console.log(userEntries);
        return userEntries;
      }
    } catch (error) {}
  } else {
    console.log('no session');
  }
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  const { userEntries = [] } = (await getUserEntries()) || {};

  if (session) {
    return (
      <>
        <BrewerySearch />
        {/* {session?.user?.name} <br /> */}
        <div>
          <EntryList userEntries={userEntries} />
        </div>
      </>
    );
  }

  return (
    <>
      <BrewerySearch />
      <div className='dark: m-auto flex w-72 justify-center text-xl font-bold text-black dark:text-white'>
        <p>
          Search for a brewery above, or create an account to save an entry from
          your favorite brewery!
        </p>
      </div>

      <div className='justify center flex'>
        <div className='font-white flex justify-center bg-black'></div>
      </div>
      {/* <Analytics /> */}
    </>
  );
}

import BrewerySearch from './components/BrewerySearch';
import EntryList from './components/EntryList';
import './loading';
// import { getServerSession } from 'next-auth/next';

// import { authOptions } from './api/auth/[...nextauth]/options';
import { headers } from 'next/headers';

const getAllEntries = async (
  userId,
  sortOption = 'date',
  sortDirection = 'desc',
) => {
  if (!userId) return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/entries?userId=${userId}&sort=${sortOption}&direction=${sortDirection}`,
      {
        method: 'GET',
        headers: headers(),
      },
    );
    if (res.ok) {
      const userEntries = await res.json();
      return userEntries;
    } else {
      console.error('Failed to fetch user entries:', res.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching user entries:', error);
    return [];
  }
};

export default async function Home() {
  const { entries = [] } = (await getAllEntries()) || {};

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Background />
      <BrewerySearch />
      <EntryList entries={entries} />
      <Analytics />
      {/* </Suspense> */}
    </>
  );
}

// export default async function Home() {
//   const session = await getServerSession(authOptions);

//   let userEntries = [];
//   console.log('session', session);
//   if (session) {
//     userEntries = await getUserEntries(session.user.id);
//     return (
//       <>
//         <BrewerySearch />
//         <div>
//           <EntryList userEntries={userEntries} />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <p>
//         Search for a brewery above, or create an account to save an entry from
//         your favorite brewery!
//       </p>
//     </>
//   );

// return (
//   <>
//     <BrewerySearch />
//     {session ? (
//       <div>
//         <EntryList userEntries={userEntries} />
//       </div>
//     ) : (
//       <div className='dark: m-auto flex w-72 justify-center text-xl font-bold text-black dark:text-white'>
//         <p>
//           Search for a brewery above, or create an account to save an entry
//           from your favorite brewery!
//         </p>
//       </div>
//     )}

//   </>
// );
// }

// export default async function Home() {
//   const session = await getServerSession(authOptions);

//   const { userEntries = [] } = (await getUserEntries()) || {};

//   if (session) {
//     return (
//       <>
//         <BrewerySearch />
//         {/* {session?.user?.name} <br /> */}
//         <div>
//           <EntryList userEntries={userEntries} />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <BrewerySearch />
//       <div className='dark: m-auto flex w-72 justify-center text-xl font-bold text-black dark:text-white'>
//         <p>
//           Search for a brewery above, or create an account to save an entry from
//           your favorite brewery!
//         </p>
//       </div>

//       <div className='justify center flex'>
//         <div className='font-white flex justify-center bg-black'></div>
//       </div>
//       {/* <Analytics /> */}
//     </>
//   );
// }

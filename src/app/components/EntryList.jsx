import RemoveBtn from './RemoveBtn';
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';

const getEntries = async () => {
  'use server';
  try {
    const res = await fetch('https://gitpub.vercel.app/api/entries', {
      cache: 'no-store',
    });
    // const res = await fetch('http://localhost:3000/api/entries', {
    //   cache: 'no-store',
    // });

    if (!res.ok) {
      throw new Error('Failed to fetch entries');
    }

    return res.json();
  } catch (error) {
    console.log('Error loading entries: ', error);
  }
};

export default async function EntryList() {
  const { entries = [] } = (await getEntries()) || {};

  return (
    <>
      {/* <div className=""> */}
      <h1 className='cards px-4 pt-4 font-mono text-3xl font-bold'>
        My Brewery Trips:
      </h1>
      {entries.map((entry) => (
        <div
          className='card m-4 flex  items-start justify-between gap-5 border border-slate-900  bg-amber-500  bg-opacity-80 p-4 '
          key={entry._id}>
          <div>
            <h1 className='whitespace-pre-wrap text-2xl font-bold'>
              {entry.title}
            </h1>
            <h2 className=' italic'>{entry.address}</h2>
            <div className='text-md whitespace-pre-wrap'>
              {entry.description}
            </div>
          </div>

          <div className='delete-btn flex flex-col gap-3'>
            <span className='sr-only'>Delete</span>
            <RemoveBtn id={entry._id} className='' />

            <Link href={`/editEntry/${entry._id}`}>
              <HiPencilAlt size={28} className=' hover:text-stone-700' />
            </Link>
          </div>
        </div>
      ))}
      {/* </div> */}
    </>
  );
}

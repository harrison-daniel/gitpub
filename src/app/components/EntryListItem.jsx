import RemoveBtn from './RemoveBtn';
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';
import { format } from 'date-fns';

export default function EntryListItem({ entry }) {
  return (
    <>
      <div className='card mb-2 flex   justify-between  rounded-lg border  border-slate-900  bg-amber-500 bg-opacity-80 p-4'>
        <div>
          <h1 className='whitespace-pre-wrap text-2xl font-bold'>
            {entry.title}
          </h1>
          <h2 className=' italic'>{entry.address}</h2>
          <div className='text-md whitespace-pre-wrap'>{entry.description}</div>
          <div className='font-bold'>
            {entry.date && !isNaN(new Date(entry.date).getTime())
              ? format(new Date(entry.date), 'PPP')
              : null}
          </div>
        </div>

        <div className=' flex flex-col  justify-center gap-3 '>
          <RemoveBtn id={entry._id} />

          <Link href={`/editEntry/${entry._id}`}>
            <HiPencilAlt size={28} className='  hover:text-stone-600' />
          </Link>
        </div>
      </div>
    </>
  );
}

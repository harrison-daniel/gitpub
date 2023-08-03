import Link from 'next/link';
import RemoveBtn from './RemoveBtn';
// change icon??
import { HiPencilAlt } from 'react-icons/hi';

export default function EntryList() {
  return (
    <>
      <div className='flex justify-between items-start border border-slate-900 p-4 m-4 gap-5 '>
        <div>
          <h1 className='text-2xl font-bold'>Entry Title</h1>
          <div>Entry Description</div>
        </div>

        <div>
          <RemoveBtn />
          <Link href={'/editEntry/123'}>
            <HiPencilAlt size={24} />
          </Link>
        </div>
      </div>
    </>
  );
}

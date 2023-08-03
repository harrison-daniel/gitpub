import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center p-6 bg-slate-600'>
      <Link href={'/'} className=''>
        <button class='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Home
        </button>
      </Link>
      <Link href={'/addEntry'} className=''>
        <button class='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Add Entry
        </button>
      </Link>
    </nav>
  );
}

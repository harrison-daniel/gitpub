'use client';

import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function RemoveBtn({ id }) {
  const router = useRouter();

  const removeEntry = async () => {
    const confirmed = confirm('Are you sure you want to delete this entry?');

    if (confirmed) {
      await fetch(`https://gitpub.vercel.app/api/entries?id=${id}`, {
        method: 'DELETE',
      });
      // await fetch(`http://localhost:3000/api/entries?id=${id}`, {
      //   method: 'DELETE',
      // });

      router.refresh();
    }
  };

  return (
    <>
      <button onClick={removeEntry} className='text-red-700'>
        <HiOutlineTrash size={24} />
      </button>
    </>
  );
}

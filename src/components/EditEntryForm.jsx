'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditEntryForm({ id, title, description }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newTitle, newDescription }),
      });

      if (!res.ok) {
        throw new Error('Failed to update entry');
      }
      router.refresh();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col '>
        <input
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          className='border border-cyan-800 p-6 m-4 '
          type='text'
          placeholder='Entry Title'
        />
        <input
          onChange={(e) => setNewDescription(e.target.value)}
          value={newDescription}
          className='border border-cyan-800 p-6 m-4'
          type='text'
          placeholder='Entry Description'
        />

        <button className='bg-green-700 hover:bg-green-500 text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Update Entry
        </button>
      </form>
    </>
  );
}

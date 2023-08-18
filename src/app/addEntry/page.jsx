'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddEntry() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      // const res = await fetch('https://gitpub.vercel.app/api/entries', {
      const res = await fetch('http://localhost:3000/api/entries', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Failed to create an entry');
      }
    } catch (error) {}
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col '>
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className='border border-cyan-800 p-6 m-4 '
          type='text'
          placeholder='Entry Title'
        />
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='border border-cyan-800 p-6 m-4'
          type='text'
          placeholder='Entry Description'
        />

        <button
          type='submit'
          className='bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 m-4 border border-gray-400 rounded shadow'>
          Add Entry
        </button>
      </form>
    </>
  );
}

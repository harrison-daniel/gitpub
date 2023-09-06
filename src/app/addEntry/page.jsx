'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddEntry() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !address || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      // const res = await fetch("https://gitpub.vercel.app/api/entries", {
      const res = await fetch('http://localhost:3000/api/entries', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, address, description }),
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
          className='m-4 border border-cyan-800 p-6 '
          type='text'
          placeholder='Entry Title'
        />
        <textarea
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          className='m-4 border border-cyan-800 p-6'
          type='text'
          placeholder='Address or Location'
        />
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='m-4 border border-cyan-800 p-6'
          type='text'
          placeholder='Entry Description'
        />

        <button
          type='submit'
          className='m-4 rounded border border-gray-400 bg-amber-600 px-6 py-2 font-semibold text-white shadow hover:bg-amber-500 active:bg-amber-600'>
          Add Entry
        </button>
      </form>
    </>
  );
}

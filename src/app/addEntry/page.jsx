'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea, Button } from '@nextui-org/react';

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
      const res = await fetch('https://gitpub.vercel.app/api/entries', {
        // const res = await fetch('http://localhost:3000/api/entries', {
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
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-6'>
        <Textarea
          isRequired
          label='Entry Name'
          labelPlacement='outside'
          placeholder='Enter your description'
          className='max-w-2xl'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          rows={3}
        />
        <Textarea
          isRequired
          label='Location'
          labelPlacement='outside'
          placeholder='Enter your location'
          className='max-w-2xl'
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          rows={3}
        />
        <Textarea
          isRequired
          label='Notes'
          labelPlacement='outside'
          placeholder='Enter your notes'
          className='max-w-2xl'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          rows={3}
        />
        <Button color='' type='submit' className='bg-amber-500'>
          Add Entry
        </Button>
      </form>
    </>
  );
}

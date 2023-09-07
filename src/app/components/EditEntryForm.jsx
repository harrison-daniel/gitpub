'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea, Button } from '@nextui-org/react';

export default function EditEntryForm({ id, title, address, description }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newAddress, setNewAddress] = useState(address);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://gitpub.vercel.app/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newTitle, newAddress, newDescription }),
      });
      // const res = await fetch(`http://localhost:3000/api/entries/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ newTitle, newAddress, newDescription }),
      // });

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
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-6'>
        <Textarea
          isRequired
          label='Entry Name'
          labelPlacement='outside'
          placeholder='Enter your description'
          className='max-w-2xl'
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          rows={3}
        />
        <Textarea
          isRequired
          label='Location'
          labelPlacement='outside'
          placeholder='Enter your location'
          className='max-w-2xl'
          onChange={(e) => setNewAddress(e.target.value)}
          value={newAddress}
          rows={3}
        />
        <Textarea
          isRequired
          label='Notes'
          labelPlacement='outside'
          placeholder='Enter your notes'
          className='max-w-2xl'
          onChange={(e) => setNewDescription(e.target.value)}
          value={newDescription}
          rows={3}
        />
        <Button color='' type='submit' className='bg-amber-500'>
          Update Entry
        </Button>
      </form>
    </>
  );
}

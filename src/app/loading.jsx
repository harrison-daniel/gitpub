'use client';
import React from 'react';
import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className=' '>
      <Spinner
        className='mx-auto my-auto  flex justify-center gap-4 text-center'
        label='Loading...'
        size='lg'
      />
    </div>
  );
}

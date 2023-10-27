'use client';
import React from 'react';
import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className='mx-auto gap-4 text-center'>
      <Spinner label='Loading...' size='lg' className='top-50' />
    </div>
  );
}

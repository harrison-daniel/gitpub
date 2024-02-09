'use client';
import React from 'react';

export default function Loading() {
  return (
    <div className='mt-48 flex items-center justify-center space-x-2'>
      <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2  border-blue-500'></div>
      {/* <div class='h-8 w-8 animate-spin rounded-full   border-2 border-t-2 border-amber-500 '></div> */}

      <div className='text-xl font-semibold '>Loading ...</div>
    </div>
  );
}

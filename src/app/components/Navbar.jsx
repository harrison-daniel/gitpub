'use client';
import React from 'react';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <nav className='mx-auto flex  max-w-3xl flex-col items-center justify-between p-6 pb-0  '>
        <Link href={'/'} className='mb-2 font-serif text-8xl font-extrabold'>
          GitPub
        </Link>

        <div className='flex w-full justify-between px-12 pt-4'>
          <Link href={'/'}>
            <Button color='' className='bg-white'>
              Home
            </Button>
          </Link>

          <Link href={'/addEntry'} className=''>
            <Button color='' className='bg-white'>
              Add Entry
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
}

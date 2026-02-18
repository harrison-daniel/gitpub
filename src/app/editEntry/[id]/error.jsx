'use client';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function EditEntryError({ reset }) {
  return (
    <div className='mx-auto mt-32 flex max-w-sm flex-col items-center gap-4 px-6 text-center'>
      <h2 className='text-2xl font-bold'>Could not load entry</h2>
      <p className='text-sm text-muted-foreground'>
        This entry may have been deleted or you may not have access to it.
      </p>
      <div className='flex gap-3'>
        <Button variant='outline' onClick={reset}>
          Try again
        </Button>
        <Button asChild variant='outline'>
          <Link href='/'>Go home</Link>
        </Button>
      </div>
    </div>
  );
}

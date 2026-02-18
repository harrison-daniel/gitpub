'use client';
import { Button } from './components/ui/button';

export default function Error({ error, reset }) {
  return (
    <div className='mx-auto mt-32 flex max-w-sm flex-col items-center gap-4 px-6 text-center'>
      <h2 className='text-2xl font-bold'>Something went wrong</h2>
      <p className='text-sm text-muted-foreground'>
        {error?.message || 'An unexpected error occurred.'}
      </p>
      <Button variant='outline' onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

import Link from 'next/link';
import { Button } from './components/ui/button';

export default function NotFound() {
  return (
    <div className='mx-auto mt-32 flex max-w-sm flex-col items-center gap-4 px-6 text-center'>
      <h1 className='font-serif text-8xl font-extrabold'>404</h1>
      <p className='text-xl font-semibold'>Page not found</p>
      <p className='text-sm text-muted-foreground'>
        This page doesn&apos;t exist or was moved.
      </p>
      <Button asChild variant='outline'>
        <Link href='/'>Go home</Link>
      </Button>
    </div>
  );
}

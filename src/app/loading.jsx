import { Skeleton } from './components/ui/skeleton';

export default function Loading() {
  return (
    <div className='mx-12 mb-12 mt-3 flex flex-col items-center lg:mt-5'>
      <Skeleton className='mb-3 h-8 w-64 rounded-lg lg:h-10 lg:w-80' />
      <Skeleton className='mt-2 h-10 w-48 rounded-xl' />
    </div>
  );
}

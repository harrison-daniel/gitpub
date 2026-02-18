import { Skeleton } from '../components/ui/skeleton';

export default function UserDashLoading() {
  return (
    <div className='mx-auto mt-12 flex max-w-sm flex-col items-center gap-4 px-6'>
      <Skeleton className='h-20 w-20 rounded-full' />
      <Skeleton className='h-6 w-48 rounded' />
      <Skeleton className='h-4 w-64 rounded' />
      <Skeleton className='h-10 w-32 rounded-md' />
    </div>
  );
}

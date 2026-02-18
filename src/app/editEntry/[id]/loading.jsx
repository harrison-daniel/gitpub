import { Skeleton } from '../../components/ui/skeleton';

export default function EditEntryLoading() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col px-8'>
      <div className='mx-auto mb-4 mt-5 flex flex-row gap-3'>
        <Skeleton className='h-10 w-[200px] rounded-md' />
      </div>
      <div className='flex flex-col items-center gap-2'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='w-full'>
            <Skeleton className='mb-1 h-4 w-32 rounded' />
            <Skeleton className='h-10 w-full rounded-md' />
          </div>
        ))}
      </div>
      <div className='flex justify-center pt-6'>
        <Skeleton className='h-10 w-28 rounded-md' />
      </div>
    </div>
  );
}

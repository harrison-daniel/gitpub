import { Skeleton } from './components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      {/* Brewery search skeleton */}
      <div className='mx-12 mb-12 mt-3 flex flex-col items-center lg:mt-5'>
        <Skeleton className='mb-3 h-8 w-64 rounded-lg lg:h-10 lg:w-80' />
        <Skeleton className='mt-2 h-10 w-48 rounded-xl' />
      </div>

      {/* Entry list skeleton */}
      <div className='mx-auto max-w-md px-3 pb-12 md:max-w-xl'>
        <Skeleton className='mb-4 h-10 w-32 rounded-lg' />
        {[0, 1].map((i) => (
          <div key={i} className='mb-3'>
            <Skeleton className='mb-2 h-14 w-full rounded-xl' />
            {[0, 1, 2].map((j) => (
              <Skeleton key={j} className='mb-2 h-[72px] w-full rounded-xl' />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

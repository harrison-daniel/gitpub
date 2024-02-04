'use client';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useUserEntries() {
  const { data: session } = useSession();

  const shouldFetch = session !== undefined;

  const { data, error, mutate } = useSWR(
    shouldFetch ? '/api/entries' : null,
    fetcher,
  );

  // Use useEffect to log when we're fetching data
  useEffect(() => {
    if (shouldFetch) {
      console.log('fetching SWRRRR');
    }
  }, [shouldFetch]);

  return {
    entries: data?.userEntries ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// 'use client';
// import useSWR from 'swr';
// import { useSession } from 'next-auth/react';

// const fetcher = (url) => fetch(url).then((res) => res.json());

// export default function useUserEntries() {
//   const { data: session } = useSession();

//   const { data, error, mutate } = useSWR(
//     session ? '/api/entries' : null,
//     fetcher,
//   );

//   return {
//     entries: data?.userEntries ?? [],
//     isLoading: !error && !data,
//     isError: error,
//     mutate,
//   };
// }

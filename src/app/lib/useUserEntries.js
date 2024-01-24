// hooks/useUserEntries.js
'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useUserEntries() {
  const { data, error, mutate } = useSWR('/api/entries', fetcher);

  return {
    entries: data?.userEntries,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

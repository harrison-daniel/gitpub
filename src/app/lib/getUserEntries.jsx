import { headers } from 'next/headers';

export default async function getUserEntries(
  sortOption = 'date',
  sortDirection = 'desc',
) {
  try {
    // console.log('session in getUserEntries', session);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userEntries?sort=${sortOption}&direction=${sortDirection}`,
      {
        method: 'GET',
        headers: headers(),
      },
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching user entries:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';
// import { cookies } from 'next/headers';

// async function getCookieData() {
//   const cookieData = cookies().getAll();
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       resolve(cookieData);
//     }, 1000),
//   );
// }

export default async function getUserEntries(
  sortOption = 'date',
  sortDirection = 'desc',
) {
  // const cookieData = await getCookieData();
  // console.log('cookieData', cookieData);
  try {
    // console.log('session in getUserEntries', session);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userEntries?sort=${sortOption}&direction=${sortDirection}`,
      {
        cache: 'force-cache',
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

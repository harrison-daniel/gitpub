// import { getSession } from 'next-auth/react';

// export default async function getAllEntries() {
//   const session = await getSession();

//   if (!session) {
//     // Handle the case where there is no session
//     return { entries: [] };
//   }

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entries`, {
//     headers: {
//       Authorization: `Bearer ${session.accessToken}`,
//     },
//   });

//   if (res.ok) {
//     const entries = await res.json();
//     return entries;
//   }
// }

// export default async function getAllEntries(
//   sortOption = 'date',
//   sortDirection = 'desc',
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/entries?sort=${sortOption}&direction=${sortDirection}`,
//     { cache: 'no-store' },
//   );

//   if (!res.ok) {
//     throw new Error('Failed to fetch entries');
//   }
//   return res.json();
// }

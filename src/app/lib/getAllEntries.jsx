export default async function getAllEntries(
  sortOption = 'date',
  sortDirection = 'desc',
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/entries?sort=${sortOption}&direction=${sortDirection}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch entries');
  }
  return res.json();
}

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

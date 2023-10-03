export default async function getAllEntries(
  sortOption = 'date',
  sortDirection = 'desc',
) {
  const res = await fetch(
    `http://localhost:3000/api/entries?sort=${sortOption}&direction=${sortDirection}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch entries');
  }
  return res.json();
}
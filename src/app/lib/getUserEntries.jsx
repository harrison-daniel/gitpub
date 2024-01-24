export default async function getUserEntries(
  sortOption = 'date',
  sortDirection = 'desc',
) {
  // const cookieData = await getCookieData();
  // console.log('cookieData', cookieData);
  try {
    // console.log('session in getUserEntries', session);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userEntries`,
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

export const groupEntriesByYear = (
  entries,
  sortOption = 'date',
  sortDirection = 'desc',
) => {
  // Group entries by year
  const grouped = entries.reduce((acc, entry) => {
    const year = new Date(entry.date).getFullYear();
    acc[year] = acc[year] || [];
    acc[year].push(entry);
    return acc;
  }, {});

  // Sort entries within each year
  for (let year in grouped) {
    grouped[year].sort((a, b) => {
      if (sortOption === 'date') {
        return sortDirection === 'desc'
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else if (sortOption === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortDirection === 'asc'
          ? a.address.localeCompare(b.address)
          : b.address.localeCompare(a.address);
      }
    });
  }

  // Return the grouped and sorted entries
  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a)) // Sort years in descending order
    .map((year) => ({ year, entries: grouped[year] }));
};

// return Object.keys(grouped)
//   .sort((a, b) => b - a)
//   .map((year) => ({
//     year,
//     entries: grouped[year],
//   }));
// };

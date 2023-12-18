'use client';
import { useState } from 'react';
import EntryListItem from './EntryListItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { HiOutlineSelector } from 'react-icons/hi';

export default function NoDateEntries({ userEntries }) {
  const [sortOption, setSortOption] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (option) => {
    setSortOption(option);
    setSortDirection(
      sortOption === option && sortDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const sortedEntries = userEntries.sort((a, b) => {
    // Check if the properties exist and are not undefined
    const valueA = a[sortOption] || '';
    const valueB = b[sortOption] || '';

    // Use localeCompare if both values are strings, otherwise compare as-is
    const comparison =
      typeof valueA === 'string' && typeof valueB === 'string'
        ? valueA.localeCompare(valueB)
        : valueA > valueB
          ? 1
          : -1;

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <Accordion
      key='no-date'
      type='single'
      collapsible
      className='my-2 border border-black'>
      <AccordionItem value='no-date' className='mx-4'>
        <AccordionTrigger className='entryList-header flex justify-center text-3xl font-extrabold'>
          No Date
        </AccordionTrigger>
        <AccordionContent>
          <div className='mb-4 flex justify-around gap-4 '>
            <Button
              onClick={() => handleSort('title')}
              className='bg-amber-700  text-white hover:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Name
              {sortOption === 'title' && (
                <HiOutlineSelector className='h-5 w-5' />
              )}
            </Button>
            <Button
              onClick={() => handleSort('cityStateAddress')}
              className='bg-amber-700  text-white hover:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200'>
              Sort by Location
              {sortOption === 'cityStateAddress' && (
                <HiOutlineSelector className='h-5 w-5' />
              )}
            </Button>
          </div>
          {sortedEntries.map((entry) => (
            <EntryListItem key={entry._id} entry={entry} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
// 'use client';

// import { useState } from 'react';
// import EntryListItem from './EntryListItem';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '../components/ui/accordion';
// import { Button } from '../components/ui/button';
// import { HiOutlineSelector } from 'react-icons/hi';

// export default function NoDateEntries({ entries }) {
//   const [sortOption, setSortOption] = useState('title');
//   const [sortDirection, setSortDirection] = useState('asc');

//   const handleSort = (option) => {
//     setSortOption(option);
//     setSortDirection(
//       sortOption === option && sortDirection === 'asc' ? 'desc' : 'asc',
//     );
//   };

//   const sortedEntries = entries.sort((a, b) => {
//     const comparison = a[sortOption].localeCompare(b[sortOption]);
//     return sortDirection === 'asc' ? comparison : -comparison;
//   });

//   return (
//     <Accordion
//       key='no-date'
//       type='single'
//       collapsible
//       className='my-2 border border-black'>
//       <AccordionItem value='no-date ' className='mx-4'>
//         <AccordionTrigger className='entryList-header flex justify-center text-3xl font-extrabold'>
//           No Date
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className='mb-4 flex justify-around gap-4 '>
//             <Button
//               onClick={() => handleSort('title')}
//               className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200'>
//               Sort by Name
//               {sortOption === 'title' && (
//                 <HiOutlineSelector className=' h-5 w-5' />
//               )}
//             </Button>
//             <Button
//               onClick={() => handleSort('address')}
//               className=' bg-amber-700  text-white hover:bg-amber-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-200'>
//               Sort by Location
//               {sortOption === 'address' && (
//                 <HiOutlineSelector className=' h-5 w-5' />
//               )}
//             </Button>
//           </div>
//           {sortedEntries.map((entry) => (
//             <EntryListItem key={entry._id} entry={entry} />
//           ))}
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// }

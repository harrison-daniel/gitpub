// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { useToast } from '../components/ui/use-toast';
// import { HiOutlineTrash } from 'react-icons/hi';
// import { Button } from '../components/ui/button';
// import useUserEntries from '../lib/useUserEntries';
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from '../components/ui/drawer';

// export default function RemoveBtn({ id, onClose }) {
//   const { mutate } = useUserEntries();
//   const { toast } = useToast();
//   const router = useRouter();

//   const handleClose = () => {
//     onClose();
//   };

//   const removeEntry = async (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     await mutate((currentEntries) => {
//       if (Array.isArray(currentEntries)) {
//         return currentEntries.filter((entry) => entry._id !== id);
//       }
//       return currentEntries;
//     }, false); // false to not revalidate immediately

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${id}`,
//         { method: 'DELETE' },
//       );
//       if (!response.ok) {
//         const errorData = response.status !== 204 ? await response.json() : {};
//         throw new Error(errorData.error || 'Failed to delete entry');
//       }

//       onClose();
//       mutate();
//       toast({ description: 'Entry Deleted' });
//     } catch (error) {
//       console.error('Failed to delete entry:', error);
//       toast({ description: error.message, status: 'error' });

//       mutate();
//     }
//   };

//   return (
//     <div>
//       <Drawer>
//         <DrawerTrigger className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
//           <HiOutlineTrash size={19} />
//           Delete
//           {/* </button> */}
//         </DrawerTrigger>
//         <DrawerContent className='bg-amber-400 dark:bg-zinc-800'>
//           <DrawerHeader className='mx-auto flex flex-col items-center'>
//             <DrawerTitle className='text-lg font-bold'>
//               Are you sure you want to delete this entry?
//             </DrawerTitle>
//             <DrawerDescription className='font-semibold text-amber-900 '>
//               This action cannot be undone.
//             </DrawerDescription>
//           </DrawerHeader>
//           <DrawerFooter>
//             <Button onClick={(e) => removeEntry(e)} className=''>
//               Delete
//             </Button>
//             <DrawerClose>
//               No, Go Back
//               {/* <Button variant='outline'>Cancel</Button> */}
//             </DrawerClose>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </div>
//   );
// }

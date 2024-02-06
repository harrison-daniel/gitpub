// 'use client';
// import { useToast } from '../components/ui/use-toast';
// import { HiOutlineTrash } from 'react-icons/hi';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';
// // import {
// //   Modal,
// //   ModalContent,
// //   ModalHeader,
// //   ModalBody,
// //   ModalFooter,
// //   useDisclosure,
// // } from '@nextui-org/react';
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
// import { Button } from '../components/ui/button';
// import useUserEntries from '../lib/useUserEntries';

// export default function RemoveBtn({ id, onClose }) {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const { mutate } = useUserEntries();
//   // const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   // const [modalPlacement, setModalPlacement] = React.useState('auto');
//   const { toast } = useToast();

//   async function handleClose() {
//     setOpen(false);

//     onClose();
//   }

//   const removeEntry = async () => {
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

//       setOpen(false);
//       mutate();
//       toast({ description: 'Entry Deleted' });
//     } catch (error) {
//       console.error('Failed to delete entry:', error);
//       toast({ description: error.message, status: 'error' });

//       mutate();
//     }
//   };
//   return (
//     <>
//       <Drawer open={open} onOpenChange={setOpen}>
//         <DrawerTrigger className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
//           <HiOutlineTrash size={19} />
//           Delete
//           {/* </button> */}
//         </DrawerTrigger>
//         <DrawerContent className='bg-amber-400 dark:bg-zinc-800'>
//           <div>
//             <DrawerHeader className='mx-auto flex flex-col items-center'>
//               <DrawerTitle className='text-lg font-bold'>
//                 Are you sure you want to delete this entry?{' '}
//               </DrawerTitle>
//               <DrawerDescription className='font-semibold text-amber-900 '>
//                 This action cannot be undone.
//               </DrawerDescription>
//             </DrawerHeader>
//             <DrawerFooter>
//               <button
//                 className='m-2 bg-red-700 text-white hover:bg-red-500 dark:bg-red-700  dark:text-white dark:hover:bg-red-600 '
//                 onClick={removeEntry}>
//                 Delete Entry
//               </button>
//             </DrawerFooter>
//             <DrawerClose onClick={handleClose}>No, Go Back</DrawerClose>
//           </div>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// }

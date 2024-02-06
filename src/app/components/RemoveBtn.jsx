'use client';
import { useToast } from '../components/ui/use-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import React from 'react';
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
// } from '@nextui-org/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/ui/drawer';
import { Button } from '../components/ui/button';
import useUserEntries from '../lib/useUserEntries';

export default function RemoveBtn({ id, onRemove, onClose }) {
  const router = useRouter();
  const { mutate } = useUserEntries();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [modalPlacement, setModalPlacement] = React.useState('auto');
  const { toast } = useToast();

  const handleClose = () => {
    onClose();
  };

  const removeEntry = async () => {
    await mutate((currentEntries) => {
      if (Array.isArray(currentEntries)) {
        return currentEntries.filter((entry) => entry._id !== id);
      }
      return currentEntries;
    }, false); // false to not revalidate immediately

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${id}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        const errorData = response.status !== 204 ? await response.json() : {};
        throw new Error(errorData.error || 'Failed to delete entry');
      }

      onClose();
      mutate();
      toast({ description: 'Entry Deleted' });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({ description: error.message, status: 'error' });

      mutate();
    }
  };
  return (
    <>
      <Drawer>
        <DrawerTrigger className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
          <HiOutlineTrash size={19} />
          Delete
          {/* </button> */}
        </DrawerTrigger>
        <DrawerContent className='bg-amber-400 dark:bg-zinc-800'>
          <div>
            <DrawerHeader className='mx-auto flex flex-col items-center'>
              <DrawerTitle className='text-lg font-bold'>
                Are you sure you want to delete this entry?{' '}
              </DrawerTitle>
              <DrawerDescription className='font-semibold text-amber-900 '>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={handleClose} className='m-2'>
                No, Go Back
              </Button>
              <Button
                className='m-2 bg-red-700 text-white hover:bg-red-500 dark:bg-red-700  dark:text-white dark:hover:bg-red-600 '
                onClick={removeEntry}>
                Delete Entry
              </Button>
              {/* <DrawerClose>
              No, Go Back
              <Button variant='outline'>Cancel</Button>
            </DrawerClose> */}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
{
  /* old */
}
{
  /* 
      <div className='flex flex-col gap-2 '>
        <button
          onClick={onOpenChange}
          className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
          <HiOutlineTrash size={19} />
          Delete
        </button> */
}

{
  /* <Modal
          isOpen={isOpen}
          placement={modalPlacement}
          onOpenChange={onOpenChange}>
          <ModalContent className='bg-amber-500 dark:bg-slate-950'>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1 '>
                  Are you sure you want to delete this entry?
                </ModalHeader>
                <ModalBody></ModalBody>
                <ModalFooter>
                  <Button onClick={onClose} className='bg-amber-500'>
                    No, Go Back
                  </Button>
                  <Button
                    className='bg-red-700 text-white hover:bg-red-500 dark:bg-red-700 dark:text-white  dark:hover:bg-red-600 '
                    onClick={handleDelete}>
                    Delete Entry
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal> */
}

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

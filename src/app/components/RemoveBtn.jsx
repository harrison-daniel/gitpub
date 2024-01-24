'use client';

import { useToast } from '../components/ui/use-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { Button } from '../components/ui/button';
import useUserEntries from '../lib/useUserEntries';

export default function RemoveBtn({ id }) {
  const router = useRouter();
  const { mutate } = useUserEntries();
  const { isOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = React.useState('auto');
  const { toast } = useToast();

  const removeEntry = async () => {
    // Safely update state
    await mutate((currentEntries) => {
      if (Array.isArray(currentEntries)) {
        // Filter out the entry to delete
        return currentEntries.filter((entry) => entry._id !== id);
      }
      return currentEntries; // Return as is if not an array
    }, false); // false to not revalidate immediately

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${id}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        // Safely parse JSON only if response is not empty
        const errorData = response.status !== 204 ? await response.json() : {};
        throw new Error(errorData.error || 'Failed to delete entry');
      }

      // Revalidate from the server
      mutate();
      toast({ description: 'Entry Deleted' });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({ description: error.message, status: 'error' });
      // Revert changes if error occurs
      mutate();
    } finally {
      onOpenChange(false);
    }
  };
  return (
    <div className='flex flex-col gap-2 '>
      <button
        onClick={() => onOpenChange(true)}
        className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
        <HiOutlineTrash size={19} />
        Delete
      </button>

      <Modal
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}>
        <ModalContent className='bg-amber-500 dark:bg-slate-950'>
          <>
            <ModalHeader className='flex flex-col gap-1 '>
              Are you sure you want to delete this entry?
            </ModalHeader>
            <ModalBody></ModalBody>
            <ModalFooter>
              <Button
                onClick={() => onOpenChange(false)}
                className='bg-amber-500'>
                No, Go Back
              </Button>
              <Button
                className='bg-red-700 text-white hover:bg-red-500 dark:bg-red-700 dark:text-white  dark:hover:bg-red-600 '
                onClick={removeEntry}>
                Delete Entry
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

// 'use client';

// import { useToast } from '../components/ui/use-toast';
// import { HiOutlineTrash } from 'react-icons/hi';
// import { useRouter } from 'next/navigation';
// import React from 'react';
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
// } from '@nextui-org/react';
// import { Button } from '../components/ui/button';

// export default function RemoveBtn({ id, onRemove }) {
//   const router = useRouter();
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const [modalPlacement, setModalPlacement] = React.useState('auto');
//   const { toast } = useToast();

//   const removeEntry = async () => {
//     console.log('Deleting entry');
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${id}`, {
//         method: 'DELETE',
//       });

//       if (onRemove) onRemove();
//       router.refresh();
//     } catch (error) {
//       console.error('Failed to delete entry:', error);
//     } finally {
//       onOpenChange(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await removeEntry(); // Wait for entry removal to complete
//       toast({ description: 'Entry Deleted' }); // Show toast after removal
//     } catch (error) {
//       toast({ description: 'Error deleting entry', status: 'error' });
//     } finally {
//       onOpenChange(false); // Ensure modal is closed in both success and failure cases
//     }
//   };

//   return (
//     <div className='flex flex-col gap-2 '>
//       <button
//         onClick={onOpenChange}
//         className='flex flex-row items-center gap-2 text-red-700 hover:text-red-500 active:text-red-700'>
//         <HiOutlineTrash size={19} />
//         Delete
//       </button>

//       <Modal
//         isOpen={isOpen}
//         placement={modalPlacement}
//         onOpenChange={onOpenChange}>
//         <ModalContent className='bg-amber-500 dark:bg-slate-950'>
//           {(onClose) => (
//             <>
//               <ModalHeader className='flex flex-col gap-1 '>
//                 Are you sure you want to delete this entry?
//               </ModalHeader>
//               <ModalBody></ModalBody>
//               <ModalFooter>
//                 <Button onClick={onClose} className='bg-amber-500'>
//                   No, Go Back
//                 </Button>
//                 <Button
//                   className='bg-red-700 text-white hover:bg-red-500 dark:bg-red-700 dark:text-white  dark:hover:bg-red-600 '
//                   onClick={handleDelete}>
//                   Delete Entry
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

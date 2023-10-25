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

export default function RemoveBtn({ id, onRemove }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = React.useState('auto');
  const { toast } = useToast();

  const removeEntry = async () => {
    console.log('Deleting entry');
    try {
      // await fetch(`https://gitpub.vercel.app/api/entries?id=${id}`, {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entries?id=${id}`, {
        method: 'DELETE',
      });

      if (onRemove) onRemove();
      router.refresh();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    } finally {
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    try {
      await removeEntry(); // Wait for entry removal to complete
      toast({ description: 'Entry Deleted' }); // Show toast after removal
    } catch (error) {
      // Handle error (e.g., show an error toast or log to an error reporting service)
      toast({ description: 'Error deleting entry', status: 'error' });
    } finally {
      onOpenChange(false); // Ensure modal is closed in both success and failure cases
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <button
        onClick={onOpenChange}
        className='text-red-700 hover:text-red-500 active:text-red-700'>
        <HiOutlineTrash size={28} />
      </button>

      <Modal
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Are you sure you want to delete this entry?
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button variant='outline' onClick={onClose}>
                  No, Go Back
                </Button>
                <Button
                  className='bg-red-600 text-white hover:bg-red-500'
                  onClick={handleDelete}>
                  Delete Entry
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

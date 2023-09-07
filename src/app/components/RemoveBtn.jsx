'use client';

import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

export default function RemoveBtn({ id }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = React.useState('auto');

  const removeEntry = async () => {
    console.log('Deleting entry');
    try {
      // await fetch(`https://gitpub.vercel.app/api/entries?id=${id}`, {
      await fetch(`http://localhost:3000/api/entries?id=${id}`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    } finally {
      onOpenChange(false);
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
                <Button color='danger' variant='light' onPress={removeEntry}>
                  Delete Entry
                </Button>
                <Button color='primary' onPress={onClose}>
                  No, Go Back
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

'use client';

import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function RemoveBtn({ id }) {
  const router = useRouter();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const removeEntry = async () => {
    console.log('Deleting entry');
    try {
      await fetch(`https://gitpub.vercel.app/api/entries?id=${id}`, {
        // await fetch(`http://localhost:3000/api/entries?id=${id}`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className='text-red-700 hover:text-red-500 active:text-red-700'>
        <HiOutlineTrash size={28} />
      </button>

      <div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as='div' className='relative z-10' onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <div className='fixed inset-0  bg-black bg-opacity-25' />
            </Transition.Child>

            <div className='fixed inset-0  overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center p-4 '>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'>
                  <Dialog.Panel className='w-full max-w-md transform rounded-2xl bg-white  p-6  text-center shadow-xl transition-all'>
                    <Dialog.Title
                      as='h3'
                      className='flex pt-4  text-lg font-medium leading-6 text-gray-900'>
                      Are you sure you want to delete this entry?
                    </Dialog.Title>

                    <button
                      type='button'
                      className='m-4 rounded border border-gray-400 bg-red-600 px-6 py-2 font-semibold text-white shadow hover:bg-red-500 active:bg-red-600'
                      onClick={removeEntry}>
                      Yes
                    </button>
                    <button
                      type='button'
                      className='m-4 overflow-hidden rounded border border-gray-400 bg-white px-6 py-2 font-semibold text-gray-800 shadow  hover:bg-gray-100 active:bg-white'
                      onClick={closeModal}>
                      No
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

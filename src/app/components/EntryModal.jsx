'use client';

import { useState, useCallback } from 'react';
import useMediaQuery from '../lib/useMediaQuery';
import EntryForm from './EntryForm';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from './ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export default function EntryModal({ open, onOpenChange, mode, entry, onSuccess }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);

  const handleDirtyChange = useCallback((dirty) => {
    setIsDirty(dirty);
  }, []);

  const handleOpenChange = (val) => {
    if (!val && isDirty) {
      setShowDiscardAlert(true);
      return;
    }
    onOpenChange(val);
  };

  const handleDiscard = () => {
    setShowDiscardAlert(false);
    setIsDirty(false);
    onOpenChange(false);
  };

  const title = mode === 'edit' ? 'Edit Entry' : 'Add Entry';
  const formKey = entry?._id ?? 'add';
  const initialValues = entry
    ? {
        title: entry.title,
        streetAddress: entry.streetAddress,
        cityStateAddress: entry.cityStateAddress,
        description: entry.description,
        date: entry.date,
        websiteUrl: entry.websiteUrl,
        phoneNumber: entry.phoneNumber,
      }
    : {};

  const discardAlert = (
    <AlertDialog open={showDiscardAlert} onOpenChange={setShowDiscardAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to close without
            saving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDiscard}
            className='bg-red-700 text-white hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800'>
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className='max-h-[85vh] overflow-hidden bg-white p-0 dark:bg-neutral-950 sm:max-w-md'>
            <DialogHeader className='rounded-t-lg bg-amber-700 px-4 py-3 dark:bg-zinc-800'>
              <DialogTitle className='text-center text-lg font-bold text-white'>
                {title}
              </DialogTitle>
              <DialogDescription className='sr-only'>
                {mode === 'edit' ? 'Edit your brewery journal entry' : 'Add a new brewery to your journal'}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className='max-h-[calc(85vh-60px)]'>
              <EntryForm
                key={formKey}
                mode={mode}
                id={entry?._id}
                initialValues={initialValues}
                isModal
                onSuccess={onSuccess}
                onDirtyChange={handleDirtyChange}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        {discardAlert}
      </>
    );
  }

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        dismissible={!isDirty}>
        <DrawerContent className='max-h-[90vh] bg-white dark:bg-neutral-950'>
          <DrawerHeader className='pb-0'>
            <DrawerTitle className='entryList-header text-center text-xl font-extrabold'>
              {title}
            </DrawerTitle>
            <DrawerDescription className='sr-only'>
              {mode === 'edit' ? 'Edit your brewery journal entry' : 'Add a new brewery to your journal'}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='max-h-[calc(90vh-80px)] overflow-auto'>
            <EntryForm
              key={formKey}
              mode={mode}
              id={entry?._id}
              initialValues={initialValues}
              isModal
              onSuccess={onSuccess}
              onDirtyChange={handleDirtyChange}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
      {discardAlert}
    </>
  );
}

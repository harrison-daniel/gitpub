'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import BrewerySearch from './BrewerySearch';
import EntryList from './EntryList';
import EntryModal from './EntryModal';
import useUserEntries from '../lib/useUserEntries';

export default function HomeContent() {
  const { data: session } = useSession();
  const { mutate } = useUserEntries();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalEntry, setModalEntry] = useState(null);

  // Listen for Navbar "Add Entry" event
  useEffect(() => {
    const handleOpenAdd = () => {
      setModalMode('add');
      setModalEntry(null);
      setModalOpen(true);
    };
    window.addEventListener('open-add-entry', handleOpenAdd);
    return () => window.removeEventListener('open-add-entry', handleOpenAdd);
  }, []);

  const handleEdit = useCallback((entry) => {
    setModalMode('edit');
    setModalEntry(entry);
    setModalOpen(true);
  }, []);

  const handleSuccess = useCallback(
    async (data) => {
      const savedEntry = data.entry;
      if (!savedEntry) {
        await mutate();
        setModalOpen(false);
        return;
      }

      await mutate((currentData) => {
        const entries = currentData?.userEntries ?? [];
        // Edit: replace existing entry; Add: append
        const exists = entries.some((e) => e._id === savedEntry._id);
        const updated = exists
          ? entries.map((e) => (e._id === savedEntry._id ? savedEntry : e))
          : [...entries, savedEntry];
        return { ...currentData, userEntries: updated };
      }, false);

      setModalOpen(false);
    },
    [mutate],
  );

  return (
    <>
      <BrewerySearch />
      {session ? <EntryList onEdit={handleEdit} /> : null}
      <EntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        entry={modalEntry}
        onSuccess={handleSuccess}
      />
    </>
  );
}

import { auth } from '../auth';
import { redirect } from 'next/navigation';
import AddEntryForm from '../components/AddEntryForm';

export const metadata = {
  title: 'Add Entry | GitPub',
  description: 'Add a new brewery to your journal',
};

export default async function AddEntry() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return <AddEntryForm />;
}

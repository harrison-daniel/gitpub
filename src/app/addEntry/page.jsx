import { auth } from '../auth';
import { redirect } from 'next/navigation';
import AddEntryForm from '../components/AddEntryForm';

export default async function AddEntry() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return <AddEntryForm />;
}

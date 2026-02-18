import { auth } from '../auth';
import { redirect } from 'next/navigation';
import UserInfo from '../components/UserInfo';

export default async function UserDash() {
  const session = await auth();
  if (!session) redirect('/');
  return <UserInfo />;
}

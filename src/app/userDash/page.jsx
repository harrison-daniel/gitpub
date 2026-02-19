import { auth } from '../auth';
import { redirect } from 'next/navigation';
import UserInfo from '../components/UserInfo';

export const metadata = {
  title: 'Dashboard | GitPub',
  description: 'View your brewery journal stats and account info',
};

export default async function UserDash() {
  const session = await auth();
  if (!session) redirect('/');
  return <UserInfo />;
}

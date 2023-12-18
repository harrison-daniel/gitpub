import { authOptions } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import UserInfo from '../components/UserInfo';

export default async function UserDash() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <>
        <UserInfo />
      </>
    );
  } else {
    redirect('/');
  }
}

import { auth } from '../auth';
import { redirect } from 'next/navigation';
import UserInfo from '../components/UserInfo';

export default async function UserDash() {
  const session = await auth();
  if (session) {
    return (
      <>
        <div className='grid mt-72 place-items-center'>
          <div className='my-6 flex flex-col gap-2 bg-zinc-300/10 p-8 shadow-lg'>
            <UserInfo />
          </div>
        </div>
      </>
    );
  } else {
    redirect('/');
  }
}

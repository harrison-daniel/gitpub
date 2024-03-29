import { auth } from '../auth';
import { redirect } from 'next/navigation';
import UserInfo from '../components/UserInfo';

export default async function UserDash() {
  const session = await auth();
  if (session) {
    return (
      <>
        <div className='mx-auto my-auto flex justify-center pt-32  '>
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
